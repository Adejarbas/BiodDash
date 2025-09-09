"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Droplet, Leaf, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardData {
  energyGenerated: number
  wasteProcessed: number
  taxSavings: number
}

export function DashboardStats() {
  const [mounted, setMounted] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    energyGenerated: 0,
    wasteProcessed: 0,
    taxSavings: 0,
  })

  useEffect(() => {
    setMounted(true)
    loadDashboardData()

    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard/indicators")
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  if (!mounted) {
    return null
  }

  const statsData = {
    wasteProcessed: {
      value: dashboardData.wasteProcessed.toFixed(1),
      unit: "kg",
      change: "+12.5%",
      increasing: true,
    },
    energyGenerated: {
      value: dashboardData.energyGenerated.toFixed(1),
      unit: "kWh",
      change: "+8.2%",
      increasing: true,
    },
    taxDeduction: {
      value: `R$ ${dashboardData.taxSavings.toFixed(2)}`,
      unit: "",
      change: "+15.3%",
      increasing: true,
    },
    efficiency: {
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
            <span className="text-xs font-normal text-green-500 ml-1">{statsData.wasteProcessed.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {statsData.wasteProcessed.increasing ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={statsData.wasteProcessed.increasing ? "text-green-500" : "text-red-500"}>
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
            <span className="text-xs font-normal text-green-500 ml-1">{statsData.energyGenerated.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {statsData.energyGenerated.increasing ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={statsData.energyGenerated.increasing ? "text-green-500" : "text-red-500"}>
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
            <span className="text-xs font-normal text-green-500 ml-1">{statsData.taxDeduction.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {statsData.taxDeduction.increasing ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={statsData.taxDeduction.increasing ? "text-green-500" : "text-red-500"}>
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
            <span className="text-xs font-normal text-green-500 ml-1">{statsData.efficiency.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {statsData.efficiency.increasing ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={statsData.efficiency.increasing ? "text-green-500" : "text-red-500"}>
              {statsData.efficiency.change}
            </span>{" "}
            em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
    </>
  )
}
