import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Overview } from "@/components/overview"
import { RecentActivity } from "@/components/recent-activity"
import { DashboardStats } from "@/components/dashboard-stats"
import { ExportButtons } from "@/components/export-buttons"
import { BarChart3, TrendingUp, AlertCircle, FileText, Bell, MapPin } from "lucide-react"
// ...existing code...
import MapWrapper from "@/components/map-wrapper"
import BiodigestorMonitoring from "@/components/indicadores-widget"


import dynamic from 'next/dynamic';


export default async function DashboardPage() {
  const supabase = createClient()

  // Get authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (error || !user) {
    redirect("/login")
  }

  // Type assertion to ensure supabase is the real client
  const realSupabase = supabase as import("@supabase/supabase-js").SupabaseClient

  // Get user profile data
  const { data: userProfile } = await realSupabase.from("users").select("*").eq("id", user.id).single()

  const defaultAddress = userProfile?.address || "Av. Paulista, 1578 - Bela Vista, São Paulo - SP, 01310-200"
  const companyName = userProfile?.company_name || "EcoTech Solutions"

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
                <CardTitle className="text-green-800">Atividades Recentes</CardTitle>
                <CardDescription className="text-green-600">
                  Atividades do biodigestor nos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BiodigestorMonitoring />
                {/*<RecentActivity />*/}
              </CardContent>
            </Card>
          </div>

          <Card className="bio-card">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização da Empresa
              </CardTitle>
              <CardDescription className="text-green-600">
                Localização do biodigestor e instalações da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full z-[0]">
                <MapWrapper />
              </div>
             
            </CardContent>
          </Card>
        </TabsContent>

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
                    <span className="text-2xl font-bold text-green-800">92%</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  <p className="text-xs text-green-600">+5% comparado ao mês anterior</p>
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
                      <p className="text-xl font-bold text-green-800">1,850</p>
                      <p className="text-xs text-green-600">↑ 12% esta semana</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Resíduos (kg)</p>
                      <p className="text-xl font-bold text-green-800">2,450</p>
                      <p className="text-xs text-green-600">↑ 8% esta semana</p>
                    </div>
                  </div>
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
                  <div className="text-3xl font-bold text-green-800">98.5%</div>
                  <div className="text-sm text-green-600">Uptime do Sistema</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800">R$ 3,240</div>
                  <div className="text-sm text-green-600">Economia Fiscal</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800">15.2 t</div>
                  <div className="text-sm text-green-600">CO₂ Evitado</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                        <span className="text-sm font-medium">Janeiro 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Total de Energia:</span>
                        <span className="text-sm font-medium">5,550 kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Resíduos Processados:</span>
                        <span className="text-sm font-medium">7,350 kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Economia Total:</span>
                        <span className="text-sm font-medium text-green-800">R$ 9,720</span>
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
                        <span className="text-sm font-medium">08-14 Jan 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Energia Gerada:</span>
                        <span className="text-sm font-medium">1,280 kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Eficiência Média:</span>
                        <span className="text-sm font-medium">91.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Status:</span>
                        <span className="text-sm font-medium text-green-800">Ótimo</span>
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
                    <p className="text-xs text-yellow-600">Manutenção preventiva agendada para 20/01/2024</p>
                    <p className="text-xs text-yellow-500 mt-1">Há 1 dia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">Relatório mensal disponível</p>
                    <p className="text-xs text-blue-600">Relatório de janeiro foi gerado e está pronto para download</p>
                    <p className="text-xs text-blue-500 mt-1">Há 2 dias</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Meta de eficiência atingida</p>
                    <p className="text-xs text-green-600">Sistema atingiu 92% de eficiência, superando a meta de 90%</p>
                    <p className="text-xs text-green-500 mt-1">Há 3 dias</p>
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
