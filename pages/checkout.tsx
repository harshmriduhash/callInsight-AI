import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Shield, Check } from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";

export default function Checkout() {
  const router = useRouter();
  const { plan = "pro", userId } = router.query;
  const { user, updateSubscription } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans = {
    pro: { name: "Pro Plan", price: 79 },
    enterprise: { name: "Enterprise", price: 199 },
  };

  const currentPlan = plans[plan as keyof typeof plans] || plans.pro;

  const handlePayment = async () => {
    setProcessing(true);

    // Simular processamento de pagamento
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Atualizar assinatura do usuário
    updateSubscription(plan as "pro" | "enterprise");

    setProcessing(false);
    setSuccess(true);

    // Redirecionar após sucesso
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">Pagamento Realizado!</h1>
          <p className="text-gray-300 mb-4">Bem-vindo ao {currentPlan.name}</p>
          <p className="text-sm text-gray-400">
            Redirecionando para o painel...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => router.back()}
          className="flex items-center space-x-2 mb-8 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Detalhes do Pagamento</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                      defaultValue="4242 4242 4242 4242"
                    />
                    <CreditCard className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                      defaultValue="12/25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                      defaultValue="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-emerald-500 focus:outline-none"
                    defaultValue="John Doe"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={processing}
                whileHover={{ scale: processing ? 1 : 1.02 }}
                whileTap={{ scale: processing ? 1 : 0.98 }}
                className={`w-full mt-6 py-4 rounded-lg font-medium text-lg ${
                  processing
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600"
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  `Pagar $${currentPlan.price}/mês`
                )}
              </motion.button>
            </form>

            <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Pagamento seguro via Stripe</span>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-8"
          >
            <h3 className="text-xl font-bold mb-6">Resumo do Pedido</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{currentPlan.name}</span>
                <span>${currentPlan.price}/month</span>
              </div>

              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="gradient-text">
                    ${currentPlan.price}/month
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <h4 className="font-medium mb-2">O que está incluído:</h4>
              <ul className="space-y-1 text-sm">
                {plan === "enterprise" ? (
                  <>
                    <li>✓ Tudo do Plano Pro</li>
                    <li>✓ Integração com CRM</li>
                    <li>✓ Solução white-label</li>
                    <li>✓ Acesso à API</li>
                    <li>✓ Suporte dedicado</li>
                  </>
                ) : (
                  <>
                    <li>✓ Coaching com IA avançado</li>
                    <li>✓ Análises de equipe</li>
                    <li>✓ Gravações ilimitadas</li>
                    <li>✓ Relatórios personalizados</li>
                    <li>✓ Suporte prioritário</li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
