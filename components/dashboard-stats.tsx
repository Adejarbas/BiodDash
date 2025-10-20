"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Droplet, Leaf, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"

interface DashboardData {
  energyGenerated: number
  wasteProcessed: number
  taxSavings: number
  // variações percentuais mês a mês
  changeWaste: number
  changeEnergy: number
  changeTax: number
}

type IndicatorRow = {
  energy_generated: number | null
  waste_processed: number | null
  tax_savings: number | null
  measured_at?: string | null
  created_at?: string | null
}

function devLog(...args: any[]) {
  if (process.env.NODE_ENV !== "production") {
    try { (globalThis as any)?.console?.warn?.(...args) } catch {}
  }
}

function fmtPct(n: number) {
  const sign = n >= 0 ? "+" : ""
  return `${sign}${n.toFixed(1)}%`
}

function monthKey(d: Date) {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, "0")
  return `${y}-${m}` // YYYY-MM
}

export function DashboardStats() {
  const [mounted, setMounted] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    energyGenerated: 0,
    wasteProcessed: 0,
    taxSavings: 0,
    changeWaste: 0,
    changeEnergy: 0,
    changeTax: 0,
  })

  useEffect(() => {
    setMounted(true)
    void loadDashboardData()

    const interval = setInterval(loadDashboardData, 30_000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      // Pega do mês passado até agora para reduzir volume
      const now = new Date()
      const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const isoStartPrev = startPrevMonth.toISOString()

      const baseSelect =
        "energy_generated, waste_processed, tax_savings, measured_at, created_at"

      // Busca registros desde o início do mês passado.
      // Usamos OR porque measured_at pode estar nulo em alguns registros.
      const { data, error } = await supabase
        .from("biodigester_indicators")
        .select(baseSelect)
        .or(`measured_at.gte.${isoStartPrev},created_at.gte.${isoStartPrev}`)
        .order("measured_at", { ascending: false, nullsFirst: false })
        .limit(1000)

      if (error) {
        // fallback: tenta ordenar por created_at caso measured_at não exista
        devLog("[DashboardStats] erro por measured_at, tentando created_at:", error)
        const fb = await supabase
          .from("biodigester_indicators")
          .select(baseSelect)
          .gte("created_at", isoStartPrev)
          .order("created_at", { ascending: false, nullsFirst: false })
          .limit(1000)

        if (fb.error) throw fb.error
        computeAndSet(fb.data ?? [])
        return
      }

      computeAndSet(data ?? [])
    } catch (e) {
      devLog("[DashboardStats] falha geral:", e)
      // mantém zeros silenciosamente
    }
  }

  const computeAndSet = (rows: IndicatorRow[]) => {
    // Agrega por mês (YYYY-MM): soma das métricas
    const bucket = new Map<
      string,
      { waste: number; energy: number; tax: number }
    >()

    for (const r of rows) {
      const dateStr = r.measured_at ?? r.created_at
      if (!dateStr) continue
      const d = new Date(dateStr)
      const key = monthKey(d)
      const agg = bucket.get(key) ?? { waste: 0, energy: 0, tax: 0 }
      agg.waste += Number(r.waste_processed ?? 0)
      agg.energy += Number(r.energy_generated ?? 0)
      agg.tax += Number(r.tax_savings ?? 0)
      bucket.set(key, agg)
    }

    // Determina mês atual e mês anterior com base na data atual
    const now = new Date()
    const currKey = monthKey(now)
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevKey = monthKey(prevMonthDate)

    // Se não existir dado do mês atual (ex.: estamos no início do mês),
    // caímos para o último mês disponível da série
    let current = bucket.get(currKey)
    let previous = bucket.get(prevKey)

    if (!current) {
      // pega o mês mais recente existente nos dados
      const keys = Array.from(bucket.keys()).sort() // ordem crescente
      const lastKey = keys.at(-1)
      const lastPrevKey = keys.at(-2)
      current = lastKey ? bucket.get(lastKey)! : { waste: 0, energy: 0, tax: 0 }
      previous = lastPrevKey ? bucket.get(lastPrevKey)! : { waste: 0, energy: 0, tax: 0 }
    }

    const calcChange = (curr: number, prev: number) => {
      if (!prev || Math.abs(prev) < 1e-9) return 0
      return ((curr - prev) / prev) * 100
    }

    const wasteNow = current?.waste ?? 0
    const energyNow = current?.energy ?? 0
    const taxNow = current?.tax ?? 0

    const wastePrev = previous?.waste ?? 0
    const energyPrev = previous?.energy ?? 0
    const taxPrev = previous?.tax ?? 0

    setDashboardData({
      energyGenerated: energyNow,
      wasteProcessed: wasteNow,
      taxSavings: taxNow,
      changeWaste: calcChange(wasteNow, wastePrev),
      changeEnergy: calcChange(energyNow, energyPrev),
      changeTax: calcChange(taxNow, taxPrev),
    })
  }

  if (!mounted) return null

  const statsData = {
    wasteProcessed: {
      value: dashboardData.wasteProcessed.toFixed(1),
      unit: "kg",
      change: fmtPct(dashboardData.changeWaste),
      increasing: dashboardData.changeWaste >= 0,
    },
    energyGenerated: {
      value: dashboardData.energyGenerated.toFixed(1),
      unit: "kWh",
      change: fmtPct(dashboardData.changeEnergy),
      increasing: dashboardData.changeEnergy >= 0,
    },
    taxDeduction: {
      value: `R$ ${dashboardData.taxSavings.toFixed(2)}`,
      unit: "",
      change: fmtPct(dashboardData.changeTax),
      increasing: dashboardData.changeTax >= 0,
    },
    efficiency: {
      // se quiser, calcule eficiência real com outra tabela/campo
      value: "94.2",
      unit: "%",
      change: "+1.2%",
      increasing: true,
    },
  }

  return (
    <>
      <Card className="bio-stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Resíduos Processados</CardTitle>
          <div className="rounded-full bg-green-100 p-2">
            <Droplet className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {statsData.wasteProcessed.value}
            <span className="text-xs font-normal text-green-500 ml-1">
              {statsData.wasteProcessed.unit}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {statsData.wasteProcessed.increasing ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={statsData.wasteProcessed.increasing ? "text-green-500" : "text-red-500"}
            >
              {statsData.wasteProcessed.change}
            </span>{" "}
            em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card className="bio-stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Energia Gerada</CardTitle>
          <div className="rounded-full bg-yellow-100 p-2">
            <Zap className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {statsData.energyGenerated.value}
            <span className="text-xs font-normal text-green-500 ml-1">
              {statsData.energyGenerated.unit}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {statsData.energyGenerated.increasing ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={statsData.energyGenerated.increasing ? "text-green-500" : "text-red-500"}
            >
              {statsData.energyGenerated.change}
            </span>{" "}
            em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card className="bio-stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Imposto Abatido</CardTitle>
          <div className="rounded-full bg-blue-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-blue-600"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6"></path>
              <path d="M12 18v2"></path>
              <path d="M12 4v2"></path>
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {statsData.taxDeduction.value}
            <span className="text-xs font-normal text-green-500 ml-1">
              {statsData.taxDeduction.unit}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {statsData.taxDeduction.increasing ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={statsData.taxDeduction.increasing ? "text-green-500" : "text-red-500"}
            >
              {statsData.taxDeduction.change}
            </span>{" "}
            em relação ao mês anterior
          </p>
        </CardContent>
      </Card>

      <Card className="bio-stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Eficiência do Sistema</CardTitle>
          <div className="rounded-full bg-green-100 p-2">
            <Leaf className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {statsData.efficiency.value}
            <span className="text-xs font-normal text-green-500 ml-1">
              {statsData.efficiency.unit}
            </span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {statsData.efficiency.increasing ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span
              className={statsData.efficiency.increasing ? "text-green-500" : "text-red-500"}
            >
              {statsData.efficiency.change}
            </span>{" "}
            em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
    </>
  )
}
