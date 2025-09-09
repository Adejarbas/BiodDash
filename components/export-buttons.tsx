"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportButtonsProps {
  data?: any[]
  filename?: string
}

export function ExportButtons({ data = [], filename = "biodigester-report" }: ExportButtonsProps) {
  const { toast } = useToast()

  const exportToPDF = async () => {
    try {
      const reportData = {
        title: "Relatório do Biodigestor",
        date: new Date().toLocaleDateString("pt-BR"),
        stats: {
          wasteProcessed: "2,450 kg",
          energyGenerated: "1,850 kWh",
          efficiency: "92%",
          taxSavings: "R$ 3,240",
        },
        activities:
          data.length > 0
            ? data
            : [
                { date: "2024-01-15", activity: "Manutenção preventiva realizada", status: "Concluído" },
                { date: "2024-01-14", activity: "Produção de energia: 125 kWh", status: "Normal" },
                { date: "2024-01-13", activity: "Processamento de resíduos: 180 kg", status: "Normal" },
              ],
      }

      // Simulate PDF generation
      const pdfContent = `
        ${reportData.title}
        Data: ${reportData.date}
        
        ESTATÍSTICAS:
        - Resíduos Processados: ${reportData.stats.wasteProcessed}
        - Energia Gerada: ${reportData.stats.energyGenerated}
        - Eficiência: ${reportData.stats.efficiency}
        - Economia Fiscal: ${reportData.stats.taxSavings}
        
        ATIVIDADES RECENTES:
        ${reportData.activities
          .map((activity) => `${activity.date} - ${activity.activity} (${activity.status})`)
          .join("\n")}
      `

      const blob = new Blob([pdfContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "PDF exportado",
        description: "Relatório em PDF foi baixado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o PDF.",
        variant: "destructive",
      })
    }
  }

  const exportToCSV = async () => {
    try {
      const csvData = [
        ["Data", "Atividade", "Status", "Valor"],
        ["2024-01-15", "Resíduos Processados", "Normal", "180 kg"],
        ["2024-01-15", "Energia Gerada", "Normal", "125 kWh"],
        ["2024-01-14", "Eficiência do Sistema", "Ótimo", "92%"],
        ["2024-01-14", "Economia Fiscal", "Calculado", "R$ 3,240"],
        ["2024-01-13", "Manutenção", "Concluído", "Preventiva"],
      ]

      const csvContent = csvData.map((row) => row.join(",")).join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "CSV exportado",
        description: "Dados exportados em formato CSV com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o CSV.",
        variant: "destructive",
      })
    }
  }

  const exportToExcel = async () => {
    try {
      const excelData = [
        ["Relatório do Biodigestor", "", "", ""],
        ["Data do Relatório", new Date().toLocaleDateString("pt-BR"), "", ""],
        ["", "", "", ""],
        ["ESTATÍSTICAS GERAIS", "", "", ""],
        ["Métrica", "Valor", "Unidade", "Status"],
        ["Resíduos Processados", "2450", "kg", "Normal"],
        ["Energia Gerada", "1850", "kWh", "Normal"],
        ["Eficiência do Sistema", "92", "%", "Ótimo"],
        ["Economia Fiscal", "3240", "R$", "Calculado"],
        ["", "", "", ""],
        ["ATIVIDADES RECENTES", "", "", ""],
        ["Data", "Atividade", "Status", "Observações"],
        ["15/01/2024", "Manutenção preventiva", "Concluído", "Sistema funcionando perfeitamente"],
        ["14/01/2024", "Produção de energia", "Normal", "125 kWh gerados"],
        ["13/01/2024", "Processamento de resíduos", "Normal", "180 kg processados"],
      ]

      const csvContent = excelData.map((row) => row.join(",")).join("\n")
      const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Excel exportado",
        description: "Relatório em Excel foi baixado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o Excel.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={exportToPDF}
        variant="outline"
        size="sm"
        className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
      >
        <FileText className="h-4 w-4 mr-2" />
        Exportar PDF
      </Button>
      <Button
        onClick={exportToCSV}
        variant="outline"
        size="sm"
        className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar CSV
      </Button>
      <Button
        onClick={exportToExcel}
        variant="outline"
        size="sm"
        className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Exportar Excel
      </Button>
    </div>
  )
}
