"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from your API
const data = [
  {
    name: "Jan",
    wasteProcessed: 400,
    energyGenerated: 240,
    taxDeduction: 100,
  },
  {
    name: "Fev",
    wasteProcessed: 300,
    energyGenerated: 139,
    taxDeduction: 80,
  },
  {
    name: "Mar",
    wasteProcessed: 200,
    energyGenerated: 980,
    taxDeduction: 200,
  },
  {
    name: "Abr",
    wasteProcessed: 278,
    energyGenerated: 390,
    taxDeduction: 108,
  },
  {
    name: "Mai",
    wasteProcessed: 189,
    energyGenerated: 480,
    taxDeduction: 120,
  },
  {
    name: "Jun",
    wasteProcessed: 239,
    energyGenerated: 380,
    taxDeduction: 150,
  },
  {
    name: "Jul",
    wasteProcessed: 349,
    energyGenerated: 430,
    taxDeduction: 180,
  },
]

export function Overview() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex items-center">
        <TabsList className="ml-auto">
          <TabsTrigger value="all">Todas Métricas</TabsTrigger>
          <TabsTrigger value="waste">Resíduos</TabsTrigger>
          <TabsTrigger value="energy">Energia</TabsTrigger>
          <TabsTrigger value="tax">Impostos</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all" className="space-y-4 mt-4">
        <div className="h-[300px] bg-white p-4 rounded-lg border border-green-100">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="wasteProcessed"
                name="Resíduos (kg)"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 8, fill: "#10b981" }}
              />
              <Line
                type="monotone"
                dataKey="energyGenerated"
                name="Energia (kWh)"
                stroke="#f59e0b"
                strokeWidth={2}
                activeDot={{ r: 8, fill: "#f59e0b" }}
              />
              <Line
                type="monotone"
                dataKey="taxDeduction"
                name="Impostos ($)"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="waste" className="space-y-4 mt-4">
        <div className="h-[300px] bg-white p-4 rounded-lg border border-green-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="wasteProcessed" name="Resíduos Processados (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="energy" className="space-y-4 mt-4">
        <div className="h-[300px] bg-white p-4 rounded-lg border border-green-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="energyGenerated" name="Energia Gerada (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="tax" className="space-y-4 mt-4">
        <div className="h-[300px] bg-white p-4 rounded-lg border border-green-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="taxDeduction" name="Imposto Abatido ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
