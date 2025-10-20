import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Overview } from "@/components/overview"
import { DashboardStats } from "@/components/dashboard-stats"
import { ExportButtons } from "@/components/export-buttons"
import { BarChart3, TrendingUp, AlertCircle, FileText, Bell, MapPin } from "lucide-react"
import MapWrapper from "@/components/map-wrapper"
import BiodigestorMonitoring from "@/components/biodigestor-monitoring"

/* ===== Helpers de data/formatos ===== */
const fmtBRNumber = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 })
const fmtBRInt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 })
const fmtBRCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const fmtMonthLong = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function startOfNextMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 1) }

/* ===== Tipos ===== */
type IndicatorRow = {
  energy_generated: number | null
  waste_processed: number | null
  tax_savings: number | null
  efficiency: number | null
  measured_at?: string | null
  created_at?: string | null
}

/* ===== Constantes/Helpers adicionais ===== */
// Fator de CO2 evitado por kWh (toneladas/kWh). Ajuste via env: CO2_TON_PER_KWH=0.00007 (70 g/kWh) por exemplo.
const CO2_TON_PER_KWH = Number(process.env.CO2_TON_PER_KWH ?? "0.00007")

function getDayKey(d: Date) {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

function ensureDateISO(row: IndicatorRow) {
  return row.measured_at ?? row.created_at ?? null
}

/* ===== Queries ===== */
async function fetchRange(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  fromISO: string,
  toISO: string,
  filters?: { userId?: string }
) {
  let q = supabase
    .from("biodigester_indicators")
    .select("energy_generated, waste_processed, tax_savings, efficiency, measured_at, created_at")
    .gte("measured_at", fromISO)
    .lt("measured_at", toISO)
    .order("measured_at", { ascending: true })

  if (filters?.userId) q = q.eq("user_id", filters.userId)

  let { data, error } = await q
  if (error) {
    // fallback para created_at caso measured_at não exista
    let fb = supabase
      .from("biodigester_indicators")
      .select("energy_generated, waste_processed, tax_savings, efficiency, measured_at, created_at")
      .gte("created_at", fromISO)
      .lt("created_at", toISO)
      .order("created_at", { ascending: true })

    if (filters?.userId) fb = fb.eq("user_id", filters.userId)

    const res = await fb
    if (res.error) throw res.error
    data = res.data
  }
  return (data ?? []) as IndicatorRow[]
}

async function fetchLatest(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  filters?: { userId?: string }
) {
  let q = supabase
    .from("biodigester_indicators")
    .select("energy_generated, waste_processed, tax_savings, efficiency, measured_at, created_at")
    .order("measured_at", { ascending: false, nullsFirst: false })
    .limit(1)

  if (filters?.userId) q = q.eq("user_id", filters.userId)

  let { data, error } = await q
  if (error || !data?.length) {
    let fb = supabase
      .from("biodigester_indicators")
      .select("energy_generated, waste_processed, tax_savings, efficiency, measured_at, created_at")
      .order("created_at", { ascending: false, nullsFirst: false })
      .limit(1)

    if (filters?.userId) fb = fb.eq("user_id", filters.userId)

    const res = await fb
    if (res.error) throw res.error
    return res.data?.[0] as IndicatorRow | undefined
  }
  return data[0] as IndicatorRow | undefined
}

/* ===== Agregações e métricas derivadas ===== */
function sum(rows: IndicatorRow[]) {
  let energy = 0, waste = 0, tax = 0, effTotal = 0, effCount = 0
  for (const r of rows) {
    energy += Number(r.energy_generated ?? 0)
    waste += Number(r.waste_processed ?? 0)
    tax += Number(r.tax_savings ?? 0)
    if (r.efficiency !== null && r.efficiency !== undefined) {
      effTotal += Number(r.efficiency); effCount++
    }
  }
  const avgEff = effCount ? effTotal / effCount : null
  return { energy, waste, tax, avgEff }
}

function calcCO2AvoidedTonByEnergyKWh(energyKWh: number) {
  return energyKWh * CO2_TON_PER_KWH
}

function calcMonthUptimePercent(rows: IndicatorRow[], monthStart: Date, monthEndExcl: Date) {
  const totalDays = Math.max(
    1,
    Math.ceil((+monthEndExcl - +monthStart) / (1000 * 60 * 60 * 24))
  )
  const daysWithData = new Set<string>()
  for (const r of rows) {
    const iso = ensureDateISO(r)
    if (!iso) continue
    const d = new Date(iso)
    if (d >= monthStart && d < monthEndExcl) {
      daysWithData.add(getDayKey(d))
    }
  }
  return (daysWithData.size / totalDays) * 100
}

export const dynamic = "force-dynamic" // garante cookies/session no SSR

export default async function DashboardPage() {
  const supabase = createClient()

  // Autenticação
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) redirect("/login")
  const user = authData.user

  const realSupabase = supabase as import("@supabase/supabase-js").SupabaseClient

  // Perfil (para mapa)
  const { data: userProfile } = await realSupabase
    .from("user_profiles")
    .select("address, company, city, state, zip_code")
    .eq("id", user.id)
    .single()

  // ===== Períodos =====
  const now = new Date()
  const today = startOfDay(now)

  const weekFrom = startOfDay(addDays(today, -6))
  const weekTo = addDays(today, 1)

  const prevWeekTo = startOfDay(addDays(weekFrom, 0))
  const prevWeekFrom = startOfDay(addDays(prevWeekTo, -7))

  const monthFrom = startOfMonth(today)
  const monthTo = startOfNextMonth(today)

  // Filtro por usuário (RLS)
  const filters = { userId: user.id }

  // Leitura do banco
  const [weekRows, prevWeekRows, monthRows, latestRow] = await Promise.all([
    fetchRange(realSupabase, weekFrom.toISOString(), weekTo.toISOString(), filters),
    fetchRange(realSupabase, prevWeekFrom.toISOString(), prevWeekTo.toISOString(), filters),
    fetchRange(realSupabase, monthFrom.toISOString(), monthTo.toISOString(), filters),
    fetchLatest(realSupabase, filters),
  ])

  const weekAgg = sum(weekRows)
  const prevWeekAgg = sum(prevWeekRows)
  const monthAgg = sum(monthRows)

  // Deltas semanais
  const pct = (curr: number, prev: number) => (prev ? ((curr - prev) / prev) * 100 : null)
  const energyWeekDelta = pct(weekAgg.energy, prevWeekAgg.energy)
  const wasteWeekDelta = pct(weekAgg.waste, prevWeekAgg.waste)

  // Eficiência atual (último registro) ou média do mês
  const effCurrent = latestRow?.efficiency ?? (monthAgg.avgEff !== null ? monthAgg.avgEff : null)

  // Labels
  const monthLabel = fmtMonthLong.format(monthFrom)
  const weekLabel = `${weekFrom.toLocaleDateString("pt-BR")} - ${addDays(weekTo, -1).toLocaleDateString("pt-BR")}`

  // Strings formatadas
  const energyWeekStr = fmtBRInt.format(Math.round(weekAgg.energy))
  const wasteWeekStr = fmtBRInt.format(Math.round(weekAgg.waste))
  const energyWeekDeltaStr =
    energyWeekDelta === null ? "—" : `${energyWeekDelta >= 0 ? "↑" : "↓"} ${fmtBRNumber.format(Math.abs(energyWeekDelta))}%`
  const wasteWeekDeltaStr =
    wasteWeekDelta === null ? "—" : `${wasteWeekDelta >= 0 ? "↑" : "↓"} ${fmtBRNumber.format(Math.abs(wasteWeekDelta))}%`

  const effCurrentStr = effCurrent === null ? "—" : `${fmtBRNumber.format(effCurrent)}%`
  const effBarWidth = effCurrent === null ? "0%" : `${Math.max(0, Math.min(100, effCurrent))}%`

  const monthEnergyStr = fmtBRInt.format(Math.round(monthAgg.energy)) + " kWh"
  const monthWasteStr = fmtBRInt.format(Math.round(monthAgg.waste)) + " kg"
  const monthTaxStr = fmtBRCurrency.format(monthAgg.tax)

  const weekEnergyStr = fmtBRInt.format(Math.round(weekAgg.energy)) + " kWh"
  const weekEffStr = weekAgg.avgEff === null ? "—" : `${fmtBRNumber.format(weekAgg.avgEff)}%`

  // ===== Métricas dinâmicas adicionais =====
  const uptimeMonth = calcMonthUptimePercent(monthRows, monthFrom, monthTo)
  const uptimeMonthStr = isFinite(uptimeMonth) ? `${fmtBRNumber.format(uptimeMonth)}%` : "—"

  const monthCO2Ton = calcCO2AvoidedTonByEnergyKWh(monthAgg.energy)
  const monthCO2TonStr = `${fmtBRNumber.format(monthCO2Ton)} t`

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard do Biodigestor" text="Monitore e gerencie o desempenho do seu biodigestor" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bio-card">
              <CardHeader>
                <CardTitle className="text-green-800">Visão Geral de Desempenho</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>

            <Card className="col-span-3 bio-card">
              <CardHeader>
                <CardTitle className="text-green-800">Manutenções Agendadas</CardTitle>
                <CardDescription className="text-green-600">Últimas manutenções agendadas</CardDescription>
              </CardHeader>
              <CardContent>
                <BiodigestorMonitoring />
              </CardContent>
            </Card>
          </div>

          <Card className="bio-card">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full z-[0]">
                <MapWrapper />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bio-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Análise de Eficiência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Eficiência Atual</span>
                    <span className="text-2xl font-bold text-green-800">{effCurrentStr}</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: effBarWidth }} />
                  </div>
                  <p className="text-xs text-green-600">
                    {effCurrent === null ? "Sem dados de eficiência" : "Baseado no último registro"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bio-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendências de Produção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700">Energia (kWh)</p>
                      <p className="text-xl font-bold text-green-800">{energyWeekStr}</p>
                      <p className="text-xs text-green-600">{energyWeekDeltaStr} vs. semana anterior</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Resíduos (kg)</p>
                      <p className="text-xl font-bold text-green-800">{wasteWeekStr}</p>
                      <p className="text-xs text-green-600">{wasteWeekDeltaStr} vs. semana anterior</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Período: {weekLabel}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bio-card">
            <CardHeader>
              <CardTitle className="text-green-800">Análise Detalhada de Performance</CardTitle>
              <CardDescription className="text-green-600">Métricas avançadas e comparativos históricos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800">{uptimeMonthStr}</div>
                  <div className="text-sm text-green-600">Uptime do Sistema (mês)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800">{monthTaxStr}</div>
                  <div className="text-sm text-green-600">Economia Fiscal (mês)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800">{monthCO2TonStr}</div>
                  <div className="text-sm text-green-600">CO₂ Evitado (mês)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REPORTS */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="bio-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios e Exportações
                </CardTitle>
                <CardDescription className="text-green-600">
                  Gere e exporte relatórios detalhados do seu biodigestor
                </CardDescription>
              </div>
              <ExportButtons filename="relatorio-biodigestor" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800">Relatório Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Período:</span>
                        <span className="text-sm font-medium capitalize">{fmtMonthLong.format(monthFrom)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Total de Energia:</span>
                        <span className="text-sm font-medium">{monthEnergyStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Resíduos Processados:</span>
                        <span className="text-sm font-medium">{monthWasteStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Economia Total:</span>
                        <span className="text-sm font-medium text-green-800">{monthTaxStr}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800">Relatório Semanal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Período:</span>
                        <span className="text-sm font-medium">{weekLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Energia Gerada:</span>
                        <span className="text-sm font-medium">{weekEnergyStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Eficiência Média:</span>
                        <span className="text-sm font-medium">{weekEffStr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Status:</span>
                        <span className="text-sm font-medium text-green-800">
                          {effCurrent === null ? "Sem dados" : effCurrent >= 90 ? "Ótimo" : effCurrent >= 75 ? "Bom" : "Atenção"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t border-green-200 pt-4">
                <h4 className="text-sm font-medium text-green-800 mb-3">Formatos de Exportação Disponíveis:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <FileText className="h-4 w-4" />
                    <span>PDF - Relatório completo formatado</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <FileText className="h-4 w-4" />
                    <span>CSV - Dados brutos para análise</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <FileText className="h-4 w-4" />
                    <span>Excel - Planilha com gráficos</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS (ilustrativo) */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bio-card">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Central de Notificações
              </CardTitle>
              <CardDescription className="text-green-600">Gerencie alertas e notificações do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Sistema funcionando normalmente</p>
                    <p className="text-xs text-green-600">Todos os parâmetros dentro dos valores esperados</p>
                    <p className="text-xs text-green-500 mt-1">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">Manutenção programada</p>
                    <p className="text-xs text-yellow-600">Manutenção preventiva agendada</p>
                    <p className="text-xs text-yellow-500 mt-1">Há 1 dia</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-green-200 pt-4">
                <h4 className="text-sm font-medium text-green-800 mb-3">Configurações de Notificação:</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-green-300" />
                    <span className="text-green-700">Alertas de manutenção</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-green-300" />
                    <span className="text-green-700">Relatórios automáticos</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-green-300" />
                    <span className="text-green-700">Alertas de eficiência</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-green-300" />
                    <span className="text-green-700">Notificações por email</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
