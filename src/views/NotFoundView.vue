<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)]">
      
      <!-- Icon & 404 Badge -->
      <div class="relative inline-flex items-center justify-center">
        <div class="w-24 h-24 bg-slate-50 border border-slate-200/80 rounded-3xl flex items-center justify-center shadow-inner">
          <SearchX class="w-12 h-12 text-slate-400 stroke-[1.5]" />
        </div>
        <span class="absolute -bottom-2 -right-2 px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow-sm">
          404
        </span>
      </div>

      <!-- Text Content -->
      <div class="space-y-3">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Página não encontrada
        </h1>
        <p class="text-slate-500 text-sm leading-relaxed font-light">
          A página que você tentou acessar não existe, foi removida ou o endereço digitado está incorreto.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <router-link 
          to="/"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-slate-900/10"
        >
          <Home class="w-4 h-4" />
          <span>Voltar para o Início</span>
        </router-link>

        <button 
          @click="goBack"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-all border border-slate-200"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Página Anterior</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { SearchX, Home, ArrowLeft } from '@lucide/vue'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
