import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { temperature } = await req.json();

    // envie o e-mail
    const data = await resend.emails.send({
      from: "Alerta Biodigestor <alerta@seudominio.com>", // use um domínio verificado ou email@resend.dev
      to: "usuario@exemplo.com", // e-mail do usuário
      subject: "⚠️ Alerta: Temperatura Elevada no Biodigestor",
      html: `
        <h2>Alerta de Segurança</h2>
        <p>A temperatura do biodigestor atingiu <strong>${temperature.toFixed(
          1
        )}°C</strong>.</p>
        <p>Recomenda-se verificar o sistema imediatamente.</p>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
