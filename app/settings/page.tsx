"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"

const STORAGE_BUCKET = "avatars" // <-- troque para o nome exato do bucket (ex.: "avatars")

type ToastVariant = "default" | "destructive"

/** Mapeia erros comuns do Supabase / Storage para mensagens amigáveis */
function mapSupabaseError(err: any): { title: string; description: string; variant: ToastVariant } {
  const fallback = {
    title: "Erro",
    description: "Algo deu errado. Tente novamente.",
    variant: "destructive" as ToastVariant,
  }
  if (!err) return fallback

  const code = err.code || err?.error?.code
  const status = err.statusCode || err.status || err?.error?.statusCode || err?.error?.status
  const message = (err.message || err?.error?.message || "").toString().toLowerCase()

  // Regras específicas — PostgREST (tabelas/colunas)
  if (code === "PGRST205" || message.includes("could not find the table")) {
    return {
      title: "Tabela não encontrada",
      description:
        "A tabela 'public.user_profiles' não foi encontrada pelo PostgREST. Confirme o nome e faça Reset API cache nas configurações do Supabase.",
      variant: "destructive",
    }
  }
  if (code === "PGRST204" || message.includes("could not find the") && message.includes("column")) {
    return {
      title: "Coluna não encontrada",
      description:
        "Uma coluna referenciada não existe no schema. Verifique se 'avatar_url' existe em public.user_profiles e recarregue o cache da API.",
      variant: "destructive",
    }
  }

  // Storage
  if (status === 404 || message.includes("bucket not found")) {
    return {
      title: "Bucket não encontrado",
      description:
        "O bucket do Storage não foi encontrado. Verifique o nome do bucket e se o projeto/ENV (URL e ANON KEY) estão corretos.",
      variant: "destructive",
    }
  }
  if (
    status === 403 ||
    message.includes("row-level security") ||
    message.includes("violates row-level security") ||
    message.includes("new row violates row-level security policy")
  ) {
    return {
      title: "Permissão negada",
      description:
        "A política de segurança (RLS) bloqueou a operação. Verifique as policies em storage.objects e user_profiles para o usuário atual.",
      variant: "destructive",
    }
  }
  if (status === 413 || message.includes("payload too large")) {
    return {
      title: "Arquivo muito grande",
      description: "O arquivo excede o limite permitido pelo Storage.",
      variant: "destructive",
    }
  }

  // Erros comuns de auth
  if (message.includes("jwt") || message.includes("token") || message.includes("auth")) {
    return {
      title: "Sessão expirada",
      description: "Sua sessão pode ter expirado. Entre novamente para continuar.",
      variant: "destructive",
    }
  }

  // Offline
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      title: "Sem conexão",
      description: "Você está offline. Conecte-se à internet e tente novamente.",
      variant: "destructive",
    }
  }

  // Fallback com o texto original do erro (útil para debug)
  return {
    title: "Erro",
    description: err?.message || "Não foi possível completar a operação.",
    variant: "destructive",
  }
}

/** Mostra o toast de erro com segurança */
function safeToastError(toast: ReturnType<typeof useToast>["toast"], err: any, override?: string) {
  const mapped = mapSupabaseError(err)
  toast({
    title: mapped.title,
    description: override || mapped.description,
    variant: mapped.variant,
  })
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [profileData, setProfileData] = useState({
    name: "",
    company: "",
    email: "",
    avatar: "/abstract-profile.png",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cnpj: "",
    razao_social: "",
    numero: "",
    phone: "",
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          toast({
            title: "Sem conexão",
            description: "Você está offline. Algumas informações podem não carregar.",
          })
        }

        const { data, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError

        const currentUser = data?.user
        if (!currentUser) {
          toast({
            title: "Não autenticado",
            description: "Entre na sua conta para acessar as configurações.",
            variant: "destructive",
          })
          return
        }

        setUser(currentUser)

        const { data: userData, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        if (error) throw error

        setProfileData({
          name: userData?.name || "",
          company: userData?.company || "",
          email: currentUser.email || "",
          avatar: userData?.avatar_url || "/abstract-profile.png",
          address: userData?.address || "",
          city: userData?.city || "",
          state: userData?.state || "",
          zipCode: userData?.zip_code || "",
          cnpj: userData?.cnpj || "",
          razao_social: userData?.razao_social || "",
          numero: userData?.numero || "",
          phone: userData?.phone || "",
        })
      } catch (err: any) {
        console.error("Erro ao carregar usuário/perfil:", err)
        safeToastError(toast, err, "Não foi possível carregar suas informações de perfil.")
      }
    }
    loadUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Entre na sua conta para atualizar o perfil.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        throw new Error("OFFLINE")
      }

      const { error } = await supabase
        .from("user_profiles")
        .update({
          name: profileData.name?.trim(),
          company: profileData.company?.trim(),
          address: profileData.address?.trim(),
          city: profileData.city?.trim(),
          state: profileData.state?.trim(),
          zip_code: profileData.zipCode?.trim(),
          cnpj: profileData.cnpj?.trim(),
          razao_social: profileData.razao_social?.trim(),
          numero: profileData.numero?.trim(),
          phone: profileData.phone?.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err)
      if (err?.message === "OFFLINE") {
        toast({
          title: "Sem conexão",
          description: "Conecte-se à internet para salvar as alterações.",
          variant: "destructive",
        })
      } else {
        safeToastError(toast, err, "Não foi possível atualizar o perfil.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        throw new Error("OFFLINE")
      }

      // Exemplo: substitua por supabase.auth.updateUser({ password })
      await new Promise((r) => setTimeout(r, 800))

      toast({
        title: "Senha alterada",
        description: "Sua senha foi atualizada com sucesso.",
      })
    } catch (err: any) {
      console.error("Erro ao alterar senha:", err)
      if (err?.message === "OFFLINE") {
        toast({
          title: "Sem conexão",
          description: "Conecte-se à internet para alterar a senha.",
          variant: "destructive",
        })
      } else {
        safeToastError(toast, err, "Não foi possível alterar a senha.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Entre na sua conta para enviar a foto.",
        variant: "destructive",
      })
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setIsLoading(true)

    try {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        throw new Error("OFFLINE")
      }

      // Validação de arquivo
      if (file.size > 2 * 1024 * 1024) throw new Error("MAX_2MB")
      if (!/^image\/(png|jpe?g|gif)$/i.test(file.type)) throw new Error("BAD_TYPE")

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
      const unique =
        (globalThis.crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2)
      const filePath = `${user.id}/${unique}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        // Tipagem frouxa: StorageApiError possui statusCode
        // @ts-ignore
        const status = uploadError?.statusCode || uploadError?.status
        if (status === 404) {
          const e404 = new Error("BUCKET_NOT_FOUND")
          // @ts-ignore
          e404.status = 404
          throw e404
        }
        throw uploadError
      }

      // Se bucket for público, ok usar getPublicUrl
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
      const avatarUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      setProfileData((prev) => ({ ...prev, avatar: avatarUrl }))

      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi alterada com sucesso.",
      })
    } catch (err: any) {
      console.error("Error uploading avatar:", err)
      if (err?.message === "OFFLINE") {
        toast({
          title: "Sem conexão",
          description: "Conecte-se à internet para enviar a foto.",
          variant: "destructive",
        })
      } else if (err?.message === "MAX_2MB") {
        toast({
          title: "Arquivo muito grande",
          description: "Tamanho máximo permitido é 2MB.",
          variant: "destructive",
        })
      } else if (err?.message === "BAD_TYPE") {
        toast({
          title: "Formato inválido",
          description: "Use JPG, PNG ou GIF.",
          variant: "destructive",
        })
      } else if (err?.message === "BUCKET_NOT_FOUND" || err?.status === 404) {
        toast({
          title: "Bucket não encontrado",
          description:
            "Verifique o nome do bucket de Storage e as variáveis NEXT_PUBLIC_SUPABASE_URL/ANON_KEY.",
          variant: "destructive",
        })
      } else {
        safeToastError(toast, err, "Não foi possível fazer upload da foto.")
      }
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      toast({
        title: "Sem conexão",
        description: "Você está offline. Conecte-se para enviar uma nova foto.",
        variant: "destructive",
      })
      return
    }
    fileInputRef.current?.click()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Configurações" text="Gerencie suas informações pessoais e configurações da conta" />

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="bio-card">
          <CardHeader>
            <CardTitle className="text-green-800">Informações do Perfil</CardTitle>
            <CardDescription className="text-green-600">
              Atualize suas informações pessoais e da empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="bg-green-100 text-green-800 text-lg">
                  {profileData.name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button
                  type="button"
                  onClick={openFileDialog}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Alterar Foto"}
                </Button>

                {/* use sr-only no lugar de hidden para evitar bloqueios em iOS/Safari */}
                <Input
                  ref={fileInputRef}
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />

                <p className="text-sm text-green-600 mt-1">JPG, PNG ou GIF (máx. 2MB)</p>
              </div>
            </div>

            {/* Form de perfil */}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-green-800">
                    Nome do Usuário
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-green-800">
                    Nome Fantasia
                  </Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, company: e.target.value }))}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razao_social" className="text-green-800">Razão Social</Label>
                  <Input
                    id="razao_social"
                    value={profileData.razao_social}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, razao_social: e.target.value }))}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-green-800">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={profileData.cnpj}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "")
                      v = v.replace(/(\d{2})(\d)/, "$1.$2")
                      v = v.replace(/(\d{3})(\d)/, "$1.$2")
                      v = v.replace(/(\d{3})(\d)/, "$1/$2")
                      v = v.replace(/(\d{4})(\d)/, "$1-$2")
                      setProfileData((prev) => ({ ...prev, cnpj: v }))
                    }}
                    className="border-green-300 focus:border-green-500"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-800">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              {/* Address Fields Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-green-800">Endereço da Empresa</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address" className="text-green-800">
                      Endereço Completo
                    </Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                      className="border-green-300 focus:border-green-500"
                      placeholder="Rua, número, bairro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero" className="text-green-800">Número</Label>
                    <Input
                      id="numero"
                      value={profileData.numero}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, numero: e.target.value }))}
                      className="border-green-300 focus:border-green-500"
                      placeholder="Número"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-green-800">
                      Cidade
                    </Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, city: e.target.value }))}
                      className="border-green-300 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-green-800">
                      Estado
                    </Label>
                    <Input
                      id="state"
                      value={profileData.state}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, state: e.target.value }))}
                      className="border-green-300 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-green-800">
                      CEP
                    </Label>
                    <Input
                      id="zipCode"
                      value={profileData.zipCode}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "")
                        v = v.replace(/(\d{5})(\d)/, "$1-$2")
                        setProfileData((prev) => ({ ...prev, zipCode: v }))
                      }}
                      className="border-green-300 focus:border-green-500"
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-green-800">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={profileData.phone || ""}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "")
                    v = v.replace(/(\d{2})(\d)/, "($1) $2")
                    v = v.replace(/(\d{5})(\d)/, "$1-$2")
                    setProfileData((prev) => ({ ...prev, phone: v }))
                  }}
                  className="border-green-300 focus:border-green-500"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="bio-card">
          <CardHeader>
            <CardTitle className="text-green-800">Alterar Senha</CardTitle>
            <CardDescription className="text-green-600">Mantenha sua conta segura com uma senha forte</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-green-800">
                  Senha Atual
                </Label>
                <Input id="current-password" type="password" className="border-green-300 focus:border-green-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-green-800">
                    Nova Senha
                  </Label>
                  <Input id="new-password" type="password" className="border-green-300 focus:border-green-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-green-800">
                    Confirmar Nova Senha
                  </Label>
                  <Input id="confirm-password" type="password" className="border-green-300 focus:border-green-500" />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
