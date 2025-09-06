import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import CalendlyWidget from "@/components/calendly-widget"
import BiodigestorMonitoring from "@/components/indicadores-widget"

export const metadata: Metadata = {
  title: "Biodash by Biogen",
  description: "Biodigestor Operational System",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        <script
  src="https://assets.calendly.com/assets/external/widget.js"
  type="text/javascript"
  async
/>
        
      </body>
    </html>
  )
}
