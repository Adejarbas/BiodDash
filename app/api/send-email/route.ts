import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { to, subject, body } = await req.json()

    if (!to) return NextResponse.json({ ok: false, error: "Missing recipient" }, { status: 400 })

    await resend.emails.send({
      from: "Suporte Biodigestor <onboarding@resend.dev>",
      to,
      subject,
      html: body,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error)
    return NextResponse.json({ ok: false, error })
  }
}
