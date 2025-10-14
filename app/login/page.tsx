"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Loader2, Eye, EyeOff } from "lucide-react"
// Certifique-se de que a action 'signIn' lida com o campo 'remember' se for necessário
import { signIn } from "@/lib/actions" 

/**
 * Componente de botão de envio com estado de carregamento.
 * Utiliza useFormStatus para saber se o formulário está pendente.
 */
function SubmitButton() {
  // Hook do React-DOM para acessar o estado de submissão do formulário
  const { pending } = useFormStatus() 

  return (
    <Button 
      type="submit" 
      className="w-full bg-green-600 hover:bg-green-700" 
      disabled={pending}
      aria-live="polite" // Melhora a acessibilidade, indicando que o conteúdo pode mudar
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          {/* Altera o texto para o passado se estiver "entrando" */}
          Aguarde...
        </>
      ) : (
        "Entrar"
      )}
    </Button>
  )
}

/**
 * Página de Login principal.
 */
export default function LoginPage() {
  const router = useRouter()
  // Inicializa o estado da ação do servidor: [estado atual, função para submeter]
  const [state, formAction] = useActionState(signIn, null)
  // Estado local para alternar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false)
  // Estado local para o checkbox "Lembrar-me" (opcional, mas bom para UI/UX)
  const [rememberMe, setRememberMe] = useState(false) 

  // Efeito colateral para redirecionamento após login bem-sucedido
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
      // Opcional: Limpar o estado para evitar redirecionamento em renders futuros se o usuário navegar de volta
      // Não é estritamente necessário se a ação de login definir o estado corretamente
    }
    // Adiciona o state.success como dependência para ser mais específico no efeito
  }, [state?.success, router]) 

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4 py-12">
      <Card className="w-full max-w-md border-green-100 shadow-xl"> {/* Sombra mais proeminente */}
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-green-100 p-3">
              <Leaf className="h-8 w-8 text-green-600" aria-hidden="true" /> {/* Adicionado aria-hidden */}
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold text-green-800">Acesso</CardTitle> {/* Título maior e mais impactante */}
          <CardDescription className="text-green-600">
            Entre com suas credenciais para acessar seu dashboard.
          </CardDescription>
        </CardHeader>
        {/* A prop 'action' aponta para a função do Server Action */}
        <form action={formAction}> 
          <CardContent className="space-y-4">
            {/* Exibição de Erro */}
            {state?.error && (
              <div 
                className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg" // Borda e fundo ligeiramente mais escuros
                role="alert" // Acessibilidade: Indica uma mensagem de erro
              >
                <p className="font-medium">Erro ao Entrar:</p>
                <p>{state.error}</p>
              </div>
            )}

            {/* Credenciais de Demonstração (Mantenho a estrutura original, mas ajusto a cor do texto para melhor contraste) */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm"> {/* Cor do texto mais escura */}
              <p className="font-semibold mb-1">Credenciais de Demonstração:</p>
              <p>
                <strong>Email:</strong> <code>demo@biodigester.com</code>
              </p>
              <p>
                <strong>Senha:</strong> <code>demo123456</code>
              </p>
              <p className="text-xs mt-1 text-blue-600">
                ⚠️ Registre-se primeiro com essas credenciais. Login imediato após registro.
              </p>
            </div>
            
            {/* Campo de Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@example.com"
                required
                className="border-green-300 focus:border-green-500" // Foco e borda levemente mais verde
                autoComplete="email" // Ajuda o navegador a preencher
              />
            </div>

            {/* Campo de Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-green-700">
                  Senha
                </Label>
                <Link
                  href="/forgot-password" 
                  className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="border-green-300 focus:border-green-500 pr-10"
                  autoComplete={rememberMe ? "current-password" : "off"} // Autocompletar dependendo do "Lembrar-me"
                />
                <button
                  type="button"
                  tabIndex={-1} // Impede que o botão seja focado pela navegação por teclado (já que o input deve ser focado)
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors" // Adiciona um pequeno efeito hover para UX
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Visualizar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Checkbox "Lembrar-me" - Corrigido para ser capturável pelo Server Action */}
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember" 
                name="remember" // **CORREÇÃO: Adicionado o atributo name** para que o valor seja incluído no FormData
                checked={rememberMe} // **MELHORIA: Controlado pelo estado local**
                onChange={(e) => setRememberMe(e.target.checked)} // **MELHORIA: Atualiza o estado**
                className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500" 
              />
              <Label htmlFor="remember" className="text-sm font-normal text-green-700 cursor-pointer"> {/* cursor-pointer para UX */}
                Lembrar-me
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <SubmitButton />
            <div className="text-center text-sm text-green-700">
              Não tem uma conta?{" "}
              <Link 
                href="/register" 
                className="font-semibold text-green-600 hover:text-green-800 hover:underline transition-colors" // Font-semibold para destacar
              >
                Registre-se agora
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}