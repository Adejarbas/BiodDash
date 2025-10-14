"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sendEmail } from "@/lib/utils"

// Update the signIn function to handle redirects properly
export async function signUp(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
        data: {
          email_confirm: true, // This helps bypass email confirmation in some cases
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user && !data.user.email_confirmed_at) {
      // Try to confirm the user programmatically
      const { error: confirmError } = await supabase.auth.admin.updateUserById(data.user.id, { email_confirm: true })

      if (confirmError) {
        console.log("Could not auto-confirm user:", confirmError.message)
      }
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: data.user.id,
        email: data.user.email,
        company_name: "Empresa Demo",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zip_code: "01234-567",
        phone: "(11) 99999-9999",
        full_name: "Usuário Demo",
      })

      if (profileError) {
        console.error("Error creating profile:", profileError)
      }

      await supabase.from("biodigester_data").insert([
        {
          user_id: data.user.id,
          energy_generated: 150.5,
          waste_processed: 200.0,
          efficiency: 85.2,
          temperature: 38.5,
          ph_level: 7.2,
          gas_production: 45.8,
        },
        {
          user_id: data.user.id,
          energy_generated: 148.2,
          waste_processed: 195.5,
          efficiency: 83.1,
          temperature: 37.8,
          ph_level: 7.1,
          gas_production: 44.2,
        },
      ])

      await supabase.from("activities").insert([
        {
          user_id: data.user.id,
          type: "maintenance",
          description: "Sistema de biodigestor iniciado com sucesso",
        },
        {
          user_id: data.user.id,
          type: "alert",
          description: "Temperatura dentro dos parâmetros normais",
        },
      ])

      // Envio do e-mail de boas-vindas
      await sendEmail(
        data.user.email,
        "Cadastro realizado com sucesso",
        "Seu cadastro foi realizado com sucesso! Bem-vindo à plataforma."
      )
    }

    return { success: "Conta criada com sucesso! Você já pode fazer login." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signIn(prevState: any, formData: FormData) {
  // Basic validation
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    if (data && (data.user || data.session)) {
      // successful sign in; client will redirect
      return { success: "Autenticado com sucesso" }
    }

    return { error: "Credenciais inválidas" }
  } catch (err) {
    console.error("Sign in error:", err)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/login")
}
