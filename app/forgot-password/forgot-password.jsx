"use client"

import { useState } from "react"
import { sendEmail } from "@/lib/utils"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    // gerar um token simples (em produção: use UUID/crypto)
    const token = Math.random().toString(36).substring(2)
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`

    // salva token no storage/backend depois
    localStorage.setItem(`reset-${email}`, token)

    const emailBody = `
      <h2>Redefinição de Senha</h2>
      <p>Você solicitou redefinir sua senha. Clique abaixo para continuar:</p>
      <p><a href="${resetLink}" target="_blank">Redefinir Senha</a></p>
      <p>Se você não fez esta solicitação, ignore este e-mail.</p>
    `

    const res = await sendEmail(email, "🔐 Redefinição de Senha", emailBody)
    setLoading(false)

    if (res.ok) setSent(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!sent ? (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md w-96 space-y-4">
          <h1 className="text-xl font-semibold">Esqueceu sua senha?</h1>
          <p className="text-gray-500 text-sm">
            Informe seu e-mail e enviaremos um link para redefinição.
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            className="border w-full p-2 rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white rounded-md p-2 hover:bg-green-700 transition"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      ) : (
        <div className="p-6 bg-green-100 rounded-lg shadow-md w-96 text-center">
          <h2 className="text-green-700 font-semibold mb-2">E-mail enviado!</h2>
          <p>Verifique sua caixa de entrada e siga o link enviado.</p>
        </div>
      )}
    </div>
  )
  
}
