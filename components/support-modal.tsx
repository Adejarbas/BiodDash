"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, MessageCircle, Phone, Clock } from "lucide-react"

export default function SupportModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    issue: "",
    priority: "medium",
    date: "",
    time: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica de envio
    alert("Agendamento solicitado com sucesso! Entraremos em contato em breve.")
    setIsOpen(false)
    setStep(1)
    setFormData({
      name: "",
      email: "",
      phone: "",
      issue: "",
      priority: "medium",
      date: "",
      time: "",
    })
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">Agendar Suporte</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div className={`flex-1 h-1 ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`} />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div className={`flex-1 h-1 ${step >= 3 ? "bg-green-600" : "bg-gray-200"}`} />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 3 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Dados</span>
                <span>Problema</span>
                <span>Agendamento</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Dados pessoais */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Seus dados</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Descrição do problema */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Descreva o problema</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="low">Baixa - Dúvida geral</option>
                      <option value="medium">Média - Problema técnico</option>
                      <option value="high">Alta - Sistema parado</option>
                      <option value="urgent">Urgente - Emergência</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição detalhada</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.issue}
                      onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                      placeholder="Descreva o problema que está enfrentando..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Agendamento */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Quando podemos te ajudar?</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data preferida</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário preferido</label>
                    <select
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione um horário</option>
                      <option value="09:00">09:00 - Manhã</option>
                      <option value="10:00">10:00 - Manhã</option>
                      <option value="11:00">11:00 - Manhã</option>
                      <option value="14:00">14:00 - Tarde</option>
                      <option value="15:00">15:00 - Tarde</option>
                      <option value="16:00">16:00 - Tarde</option>
                      <option value="17:00">17:00 - Tarde</option>
                    </select>
                  </div>

                  {/* Resumo */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Resumo do agendamento:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Nome:</strong> {formData.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {formData.email}
                      </p>
                      <p>
                        <strong>Prioridade:</strong> {formData.priority}
                      </p>
                      <p>
                        <strong>Data:</strong> {formData.date}
                      </p>
                      <p>
                        <strong>Horário:</strong> {formData.time}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de navegação */}
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Voltar
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Agendar Suporte</span>
                  </button>
                )}
              </div>
            </form>

            {/* Contatos alternativos */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600 mb-2">Ou entre em contato diretamente:</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span>(11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>Seg-Sex 8h-18h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
