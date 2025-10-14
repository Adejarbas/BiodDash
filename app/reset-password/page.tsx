"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function ResetPasswordPage() {
  const { token } = useParams()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // valida o token salvo no localStorage (simulação)
    const saved = localStorage.getItem(`reset-${email}`)
    
    // CORREÇÃO DE TIPO: useParams pode retornar um array de strings ou string | undefined.
    // Garantimos que 'token' é tratado como string para comparação.
    const tokenString = Array.isArray(token) ? token[0] : token
    
    if (saved === tokenString) {
      // aqui você chamaria sua API para atualizar a senha real
      setSuccess(true)
      localStorage.removeItem(`reset-${email}`)
    } else {
      alert("Token inválido ou expirado.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!success ? (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md w-96 space-y-4">
          <h1 className="text-xl font-semibold">Redefinir senha</h1>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="border w-full p-2 rounded-md"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nova senha"
            className="border w-full p-2 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded-md p-2 hover:bg-green-700 transition"
          >
            Redefinir
          </button>
        </form>
      ) : (
        <div className="p-6 bg-green-100 rounded-lg shadow-md w-96 text-center">
          <h2 className="text-green-700 font-semibold mb-2">Senha redefinida!</h2>
          <p>Agora você já pode fazer login com sua nova senha.</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Ir para o login
          </button>
        </div>
      )}
    </div>
  )
}