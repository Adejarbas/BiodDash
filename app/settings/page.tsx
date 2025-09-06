"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    name: "",
    company: "",
    email: "",
    avatar: "/abstract-profile.png",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (userData) {
          setProfileData({
            name: userData.name || "",
            company: userData.company || "",
            email: user.email || "",
            avatar: userData.avatar_url || "/abstract-profile.png",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
            zipCode: userData.zip_code || "",
          })
        }
      }
    }
    loadUserData()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: profileData.name,
          company: profileData.company,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zip_code: profileData.zipCode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Senha alterada",
        description: "Sua senha foi atualizada com sucesso.",
      })
    }, 1000)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsLoading(true)

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      const avatarUrl = data.publicUrl

      // Update user record with new avatar URL
      const { error: updateError } = await supabase
        .from("users")
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Update local state
      setProfileData((prev) => ({ ...prev, avatar: avatarUrl }))

      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi alterada com sucesso.",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da foto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Alterar Foto"}
                  </Button>
                </Label>
                <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <p className="text-sm text-green-600 mt-1">JPG, PNG ou GIF (máx. 2MB)</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-green-800">
                    Nome Completo
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
                    Nome da Empresa
                  </Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, company: e.target.value }))}
                    className="border-green-300 focus:border-green-500"
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
                <div className="space-y-2">
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
                <div className="grid grid-cols-3 gap-4">
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
                      onChange={(e) => setProfileData((prev) => ({ ...prev, zipCode: e.target.value }))}
                      className="border-green-300 focus:border-green-500"
                    />
                  </div>
                </div>
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
