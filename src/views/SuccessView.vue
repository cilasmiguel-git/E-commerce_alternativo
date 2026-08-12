<template>
  <div class="max-w-2xl mx-auto py-16 px-4">
    <div class="bg-white rounded-3xl shadow-[0_8px_30px_-5px_rgba(6,81,237,0.05)] border border-slate-100 p-10 md:p-16 text-center">
      
      <div class="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
        <CheckCircle2 class="w-12 h-12 stroke-1" />
      </div>
      
      <h1 class="text-3xl font-light text-slate-800 tracking-tight mb-4">
        Pedido <span class="font-semibold">Confirmado</span>!
      </h1>
      
      <p class="text-slate-500 mb-10 font-light text-lg leading-relaxed">
        Agradecemos a sua confiança. Enviamos os detalhes do seu pedido e o link de pagamento para o e-mail informado.
      </p>

      <div class="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-10 text-sm text-amber-800 text-left flex gap-4 items-start">
        <AlertCircle class="w-6 h-6 flex-shrink-0 text-amber-500" />
        <p><strong>Atenção:</strong> Caso ainda não tenha concluído o pagamento pela plataforma AbacatePay, você pode acessar o link diretamente no seu e-mail para finalizar.</p>
      </div>

      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <router-link to="/orders" class="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 px-8 rounded-full transition-all shadow-md shadow-amber-500/20">
          <ShoppingBag class="w-5 h-5" />
          Acompanhar em Meus Pedidos
        </router-link>
        <router-link to="/" class="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 px-8 rounded-full transition-colors shadow-md shadow-slate-900/10">
          Continuar Navegando
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle2, AlertCircle, ShoppingBag } from '@lucide/vue'
</script>
