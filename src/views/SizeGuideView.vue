<template>
  <div class="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
    
    <!-- Cabeçalho -->
    <div class="text-center max-w-3xl mx-auto space-y-3">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
        <Ruler class="w-4 h-4 text-amber-600" />
        <span>Uniformes Escolares Colégio Alternativo Colaço</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-light text-slate-800 tracking-tight">
        Guia de <span class="font-semibold text-slate-900">Tamanhos e Medidas</span>
      </h1>
      <p class="text-slate-500 font-light text-base sm:text-lg leading-relaxed">
        Confira as tabelas de medidas oficiais dos uniformes escolares para escolher o tamanho ideal para o seu filho com total tranquilidade.
      </p>
    </div>

    <!-- Calculadora Interativa de Recomendação -->
    <div class="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        <div class="lg:col-span-1 space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Sparkles class="w-6 h-6" />
          </div>
          <h2 class="text-xl font-semibold text-white">Recomendador de Tamanho</h2>
          <p class="text-xs text-slate-300 font-light leading-relaxed">
            Informe a altura ou a idade do aluno e nossa ferramenta indicará o tamanho mais recomendado.
          </p>
        </div>

        <div class="lg:col-span-2 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-200 mb-1.5">Idade do Aluno</label>
              <select 
                v-model="calcAge" 
                class="w-full px-4 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Selecione a idade...</option>
                <option v-for="age in 16" :key="age" :value="age">{{ age }} {{ age === 1 ? 'ano' : 'anos' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-200 mb-1.5">Altura Aproximada (cm)</label>
              <input 
                v-model.number="calcHeight" 
                type="number" 
                placeholder="Ex: 125"
                class="w-full px-4 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-500"
              />
            </div>
          </div>

          <!-- Resultado Recomendado -->
          <div v-if="recommendedSize" class="pt-3 border-t border-white/10 flex items-center justify-between bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span class="text-xs font-medium text-amber-200">Tamanho Recomendado:</span>
            </div>
            <span class="text-xl font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/30">
              {{ recommendedSize }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navegação por Categorias de Uniformes -->
    <div class="space-y-6">
      <div class="flex justify-center border-b border-slate-200 overflow-x-auto scrollbar-hide">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-3.5 px-6 font-medium text-sm border-b-2 transition-all whitespace-nowrap flex items-center gap-2',
            activeTab === tab.id 
              ? 'border-slate-900 text-slate-900 font-semibold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tabela Infantil -->
      <div v-if="activeTab === 'infantil'" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="font-semibold text-slate-900 text-base">Tabela de Tamanhos Infantis (Tamanhos 2 a 16)</h3>
            <p class="text-xs text-slate-500 mt-0.5">Indicado para Educação Infantil e Ensino Fundamental I</p>
          </div>
          <span class="text-xs font-medium bg-slate-200/70 text-slate-700 px-3 py-1 rounded-full self-start sm:self-auto">Medidas em cm</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-100/70 text-slate-700 uppercase text-xs font-semibold">
              <tr>
                <th class="py-3.5 px-6">Tamanho</th>
                <th class="py-3.5 px-6">Idade Sugerida</th>
                <th class="py-3.5 px-6">Altura (cm)</th>
                <th class="py-3.5 px-6">Tórax (cm)</th>
                <th class="py-3.5 px-6">Cintura (cm)</th>
                <th class="py-3.5 px-6">Comprimento Camiseta (cm)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="item in childSizes" 
                :key="item.size"
                :class="{'bg-amber-50/60 font-medium text-slate-900': recommendedSize === item.size}"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="py-4 px-6 font-bold text-slate-900">Tamanho {{ item.size }}</td>
                <td class="py-4 px-6">{{ item.age }}</td>
                <td class="py-4 px-6">{{ item.height }}</td>
                <td class="py-4 px-6">{{ item.chest }}</td>
                <td class="py-4 px-6">{{ item.waist }}</td>
                <td class="py-4 px-6">{{ item.length }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabela Juvenil / Adulto -->
      <div v-if="activeTab === 'adulto'" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="font-semibold text-slate-900 text-base">Tabela de Tamanhos Juvenil e Adulto (PP ao XGG)</h3>
            <p class="text-xs text-slate-500 mt-0.5">Indicado para Ensino Fundamental II e Ensino Médio</p>
          </div>
          <span class="text-xs font-medium bg-slate-200/70 text-slate-700 px-3 py-1 rounded-full self-start sm:self-auto">Medidas em cm</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-100/70 text-slate-700 uppercase text-xs font-semibold">
              <tr>
                <th class="py-3.5 px-6">Tamanho</th>
                <th class="py-3.5 px-6">Altura (cm)</th>
                <th class="py-3.5 px-6">Tórax (cm)</th>
                <th class="py-3.5 px-6">Cintura (cm)</th>
                <th class="py-3.5 px-6">Quadril (cm)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="item in adultSizes" 
                :key="item.size"
                :class="{'bg-amber-50/60 font-medium text-slate-900': recommendedSize === item.size}"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="py-4 px-6 font-bold text-slate-900">{{ item.size }}</td>
                <td class="py-4 px-6">{{ item.height }}</td>
                <td class="py-4 px-6">{{ item.chest }}</td>
                <td class="py-4 px-6">{{ item.waist }}</td>
                <td class="py-4 px-6">{{ item.hip }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Seção Ilustrativa: Como Medir o Aluno -->
    <div class="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <h2 class="text-2xl font-semibold text-slate-900">Como medir seu filho corretamente</h2>
        <p class="text-xs sm:text-sm text-slate-500">
          Use uma fita métrica flexível sem apertar demais a pele do aluno. Se a medida ficar entre dois tamanhos, recomendamos escolher o tamanho maior!
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">1</div>
          <h4 class="font-semibold text-slate-900 text-sm">1. Tórax</h4>
          <p class="text-xs text-slate-500 leading-relaxed">
            Passe a fita métrica ao redor do peito do aluno, logo abaixo das axilas, contornando a parte mais larga das costas.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">2</div>
          <h4 class="font-semibold text-slate-900 text-sm">2. Cintura</h4>
          <p class="text-xs text-slate-500 leading-relaxed">
            Passe a fita ao redor da cintura natural (logo acima do umbigo). Mantenha a fita firme, porém confortável.
          </p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
          <div class="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">3</div>
          <h4 class="font-semibold text-slate-900 text-sm">3. Comprimento</h4>
          <p class="text-xs text-slate-500 leading-relaxed">
            Meça do ponto mais alto do ombro (junto ao pescoço) até a barra desejada da camiseta ou casaco.
          </p>
        </div>
      </div>
    </div>

    <!-- Dúvidas e Suporte -->
    <div class="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <HelpCircle class="w-6 h-6 text-amber-600 flex-shrink-0" />
        <div>
          <h4 class="font-semibold text-amber-950 text-sm">Ainda em dúvida sobre o tamanho?</h4>
          <p class="text-xs text-amber-800 mt-0.5">Você pode experimentar amostras de tamanhos diretamente na secretaria do colégio.</p>
        </div>
      </div>
      <router-link to="/" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap">
        Voltar para a Loja
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Ruler, Sparkles, CheckCircle2, Shirt, User, HelpCircle } from '@lucide/vue'

const activeTab = ref('infantil')
const calcAge = ref('')
const calcHeight = ref(null)

const tabs = [
  { id: 'infantil', label: 'Infantil (Tamanhos 2 ao 16)', icon: Shirt },
  { id: 'adulto', label: 'Juvenil / Adulto (PP ao XGG)', icon: User }
]

const childSizes = [
  { size: '2', age: '2 a 3 anos', height: '88 - 98 cm', chest: '52 cm', waist: '50 cm', length: '40 cm' },
  { size: '4', age: '4 a 5 anos', height: '98 - 108 cm', chest: '56 cm', waist: '52 cm', length: '44 cm' },
  { size: '6', age: '6 a 7 anos', height: '108 - 118 cm', chest: '60 cm', waist: '54 cm', length: '48 cm' },
  { size: '8', age: '8 a 9 anos', height: '118 - 128 cm', chest: '64 cm', waist: '56 cm', length: '52 cm' },
  { size: '10', age: '10 a 11 anos', height: '128 - 138 cm', chest: '68 cm', waist: '58 cm', length: '56 cm' },
  { size: '12', age: '12 a 13 anos', height: '138 - 148 cm', chest: '74 cm', waist: '62 cm', length: '60 cm' },
  { size: '14', age: '14 a 15 anos', height: '148 - 156 cm', chest: '80 cm', waist: '66 cm', length: '64 cm' },
  { size: '16', age: '15 a 16 anos', height: '156 - 164 cm', chest: '86 cm', waist: '70 cm', length: '68 cm' }
]

const adultSizes = [
  { size: 'PP', height: '160 - 165 cm', chest: '88 - 92 cm', waist: '72 - 76 cm', hip: '90 - 94 cm' },
  { size: 'P', height: '165 - 170 cm', chest: '93 - 97 cm', waist: '77 - 81 cm', hip: '95 - 99 cm' },
  { size: 'M', height: '170 - 175 cm', chest: '98 - 102 cm', waist: '82 - 86 cm', hip: '100 - 104 cm' },
  { size: 'G', height: '175 - 180 cm', chest: '103 - 107 cm', waist: '87 - 91 cm', hip: '105 - 109 cm' },
  { size: 'GG', height: '180 - 185 cm', chest: '108 - 112 cm', waist: '92 - 96 cm', hip: '110 - 114 cm' },
  { size: 'XGG', height: '185 - 190 cm', chest: '113 - 118 cm', waist: '97 - 102 cm', hip: '115 - 120 cm' }
]

// Calculadora de Recomendação
const recommendedSize = computed(() => {
  if (calcHeight.value) {
    const h = calcHeight.value
    if (h <= 98) return '2'
    if (h <= 108) return '4'
    if (h <= 118) return '6'
    if (h <= 128) return '8'
    if (h <= 138) return '10'
    if (h <= 148) return '12'
    if (h <= 156) return '14'
    if (h <= 164) return '16'
    if (h <= 170) return 'P'
    if (h <= 175) return 'M'
    if (h <= 180) return 'G'
    return 'GG'
  }

  if (calcAge.value) {
    const age = Number(calcAge.value)
    if (age <= 3) return '2'
    if (age <= 5) return '4'
    if (age <= 7) return '6'
    if (age <= 9) return '8'
    if (age <= 11) return '10'
    if (age <= 13) return '12'
    if (age <= 15) return '14'
    return '16 / P'
  }

  return null
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
