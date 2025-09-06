"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Loader2 } from "lucide-react"
import { signUp } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Criando conta...
        </>
      ) : (
        "Criar conta"
      )}
    </Button>
  )
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(signUp, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4 py-12">
      <Card className="w-full max-w-md border-green-100 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-green-100 p-3">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Criar conta</CardTitle>
          <CardDescription className="text-green-600">Preencha os dados para criar sua conta</CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-4">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{state.error}</div>
            )}

            {state?.success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {state.success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="border-green-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-700">
                Senha
              </Label>
              <Input id="password" name="password" type="password" required className="border-green-200" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <SubmitButton />
            <div className="text-center text-sm text-green-700">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-800 hover:underline">
                Fazer login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
