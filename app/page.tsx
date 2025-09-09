import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">BioDash</h1>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Biodigester Management System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Monitor and optimize your biodigester performance with our comprehensive dashboard.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="p-4 bg-green-100 rounded-full">
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
                    className="h-6 w-6 text-green-600"
                  >
                    <path d="M2 22v-5l5-5 5 5-5 5z"></path>
                    <path d="M9.5 14.5 16 8"></path>
                    <path d="m17 2 5 5-5 5-5-5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Waste Processing Tracking</h3>
                <p className="text-gray-500">Monitor the amount of waste processed by your biodigester in real-time.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="p-4 bg-yellow-100 rounded-full">
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
                    className="h-6 w-6 text-yellow-600"
                  >
                    <path d="M12 2v8"></path>
                    <path d="m4.93 10.93 1.41 1.41"></path>
                    <path d="M2 18h2"></path>
                    <path d="M20 18h2"></path>
                    <path d="m19.07 10.93-1.41 1.41"></path>
                    <path d="M22 22H2"></path>
                    <path d="m8 22 4-10 4 10"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Energy Generation</h3>
                <p className="text-gray-500">
                  Track the energy produced by your biodigester system with detailed analytics.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="p-4 bg-blue-100 rounded-full">
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
                    className="h-6 w-6 text-blue-600"
                  >
                    <path d="M2 9a3 3 0 0 1 0 6v2a5 5 0 0 0 0-10Z"></path>
                    <path d="M22 9a3 3 0 0 0 0 6v2a5 5 0 0 1 0-10Z"></path>
                    <path d="M6 7.5a3.5 3.5 0 0 1 0 9v2a5.5 5.5 0 0 0 0-13Z"></path>
                    <path d="M18 7.5a3.5 3.5 0 0 0 0 9v2a5.5 5.5 0 0 1 0-13Z"></path>
                    <path d="M12 6a6 6 0 0 0-6 6v6a6 6 0 0 0 12 0v-6a6 6 0 0 0-6-6Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Tax Deduction Tracking</h3>
                <p className="text-gray-500">
                  Calculate and visualize tax benefits from your sustainable energy production.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-8">
          <p className="text-sm text-gray-500">© 2024 BioDash. All rights reserved.</p>
          <nav className="flex gap-4 text-sm">
            <Link href="#" className="text-gray-500 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-gray-500 hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
