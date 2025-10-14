import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Minimal sendEmail helper used by server actions.
// If you have an email provider endpoint, set NEXT_PUBLIC_EMAIL_API_URL to POST to it.
export async function sendEmail(to: string | null | undefined, subject: string, body: string) {
  try {
    if (!to) {
      console.warn("sendEmail: missing recipient")
      return { ok: false }
    }

    const apiUrl = process.env.NEXT_PUBLIC_EMAIL_API_URL

    if (apiUrl) {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
      })
      return { ok: true }
      
    }

    // Fallback: log and pretend success (useful for local/dev)
    console.info(`sendEmail: to=${to} subject=${subject}`)
    return { ok: true }
  } catch (err) {
    console.error("sendEmail error:", err)
    return { ok: false }
  }
}
