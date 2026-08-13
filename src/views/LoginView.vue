<template>
  <div class="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Acesso Seguro</h1>
      <p class="text-slate-500 text-sm">
        <template v-if="step === 1">Use o e-mail cadastrado na escola para acessar sua conta.</template>
        <template v-else-if="step === 2">Informe a sua senha para entrar na loja.</template>
        <template v-else-if="step === 3">Digite o código enviado por e-mail para validar seu acesso.</template>
      </p>
    </div>

    <!-- Etapa 1: E-mail -->
    <div v-if="step === 1">
      <form @submit.prevent="goToPasswordStep" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Seu E-mail</label>
          <div class="relative">
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="pai@exemplo.com"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              :disabled="authStore.loading"
            >
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading || !email"
          class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          <span>Continuar</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </form>

      <div class="mt-6 pt-6 border-t border-slate-100 text-center">
        <button 
          @click="requestOtpDirectly" 
          :disabled="authStore.loading || !email"
          class="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-40"
        >
          Primeiro acesso ou entrar sem senha (via Código por E-mail)
        </button>
      </div>
    </div>

    <!-- Etapa 2: Senha -->
    <div v-else-if="step === 2" class="space-y-6">
      <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
        <div class="text-xs text-slate-600 truncate">
          Entrando como: <span class="font-bold text-slate-900">{{ email }}</span>
        </div>
        <button 
          @click="step = 1" 
          class="text-xs text-slate-500 hover:text-slate-900 underline ml-2 shrink-0"
        >
          Alterar
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Sua Senha</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all pr-10"
              :disabled="authStore.loading"
            >
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading || !password"
          class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          <span v-if="authStore.loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>Entrar na Loja</span>
        </button>
      </form>

      <div class="text-center space-y-2 pt-2 border-t border-slate-100">
        <button 
          @click="requestOtpDirectly" 
          :disabled="authStore.loading"
          class="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors block w-full text-center"
        >
          Primeiro Acesso / Esqueceu a Senha? <span class="text-amber-600 font-bold">Entrar com Código por E-mail</span>
        </button>
      </div>
    </div>

    <!-- Etapa 3: Código OTP (+ Definição opcional de Senha) -->
    <div v-else-if="step === 3" class="space-y-6">
      <div class="text-center text-sm text-slate-600 mb-4">
        Enviamos um código de 6 dígitos para <br><span class="font-semibold text-slate-900">{{ email }}</span>
      </div>
      
      <form @submit.prevent="handleVerifyOtp" class="space-y-6">
        <!-- Grid de inputs (6 dígitos) -->
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-2 text-center">Digite o código de 6 dígitos</label>
          <div class="flex justify-between gap-2" @paste="handlePaste">
            <input 
              v-for="(digit, index) in code" 
              :key="index"
              :ref="el => inputRefs[index] = el"
              v-model="code[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="w-12 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
              @input="handleInput(index, $event)"
              @keydown="handleKeydown(index, $event)"
              :disabled="authStore.loading"
            >
          </div>
        </div>

        <!-- Campo Opcional de Criar/Cadastrar Senha para Primeiro Acesso -->
        <div class="bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 space-y-2">
          <label class="block text-xs font-bold text-slate-800">
            Cadastrar senha para próximos acessos (opcional):
          </label>
          <div class="relative">
            <input 
              v-model="newPassword" 
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Digite uma nova senha (opcional)"
              class="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 outline-none transition-all pr-8"
              :disabled="authStore.loading"
            />
            <button 
              type="button" 
              @click="showNewPassword = !showNewPassword"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Eye v-if="!showNewPassword" class="w-3.5 h-3.5" />
              <EyeOff v-else class="w-3.5 h-3.5" />
            </button>
          </div>
          <p class="text-[11px] text-slate-500">Ao cadastrar a senha, você poderá logar direto sem precisar de códigos.</p>
        </div>

        <button 
          type="submit" 
          :disabled="authStore.loading || code.join('').length < 6"
          class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          <span v-if="authStore.loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>Confirmar e Entrar</span>
        </button>
      </form>

      <div class="flex items-center justify-between text-xs pt-2">
        <button 
          @click="step = 1" 
          class="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Voltar
        </button>

        <button 
          @click="resendOtp" 
          :disabled="countdown > 0 || authStore.loading"
          class="font-medium text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          {{ countdown > 0 ? `Reenviar em ${countdown}s` : 'Reenviar código' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue-sonner'
import { ArrowRight, ArrowLeft, Eye, EyeOff } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1) // 1: Email, 2: Password, 3: OTP Verification
const email = ref('')
const password = ref('')
const newPassword = ref('')
const showPassword = ref(false)
const showNewPassword = ref(false)

const code = ref(['', '', '', '', '', ''])
const inputRefs = ref([])
const countdown = ref(0)
let timer = null

const goToPasswordStep = () => {
  if (!email.value || !email.value.includes('@')) {
    toast.error('Informe um e-mail válido.')
    return
  }
  step.value = 2
}

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    toast.success('Login realizado com sucesso!')
    
    if (authStore.storeProfile?.statusCadastro === 'incompleto') {
      router.push('/completar-cadastro')
    } else {
      router.push('/checkout')
    }
  } catch (err) {
    const status = err.response?.data?.status
    if (status === 'no_password' || err.response?.status === 400) {
      toast.info('Sua conta ainda não possui senha cadastrada. Enviamos um código para seu e-mail!')
      await requestOtpDirectly()
    } else if (err.response?.status === 401) {
      toast.error('E-mail ou senha incorretos.')
    } else {
      toast.error(authStore.error || 'Erro ao realizar login.')
    }
  }
}

const requestOtpDirectly = async () => {
  if (!email.value || !email.value.includes('@')) {
    toast.error('Informe um e-mail válido primeiro.')
    return
  }
  try {
    await authStore.sendOtp(email.value)
    toast.success('Código enviado!', {
      description: 'Verifique sua caixa de entrada e spam.'
    })
    step.value = 3
    startCountdown()
    setTimeout(() => {
      if (inputRefs.value[0]) inputRefs.value[0].focus()
    }, 100)
  } catch (err) {
    if (err.response?.status === 404) {
      toast.error('E-mail não encontrado no sistema da escola.')
    } else {
      toast.error(authStore.error || 'Erro ao enviar código')
    }
  }
}

const handleVerifyOtp = async () => {
  const fullCode = code.value.join('')
  try {
    await authStore.verifyOtp(email.value, fullCode, newPassword.value || null)
    toast.success('Acesso confirmado com sucesso!')
    
    if (authStore.storeProfile?.statusCadastro === 'incompleto') {
      router.push('/completar-cadastro')
    } else {
      router.push('/checkout')
    }
  } catch (err) {
    if (err.response?.status === 400) {
      toast.error('O código expirou ou é inválido. Solicite um novo.')
    } else if (err.response?.status === 401) {
      toast.error('Código inválido. Tente novamente.')
    } else {
      toast.error('Erro ao validar o código.')
    }
    code.value = ['', '', '', '', '', '']
    if (inputRefs.value[0]) inputRefs.value[0].focus()
  }
}

const startCountdown = () => {
  countdown.value = 60
  clearInterval(timer)
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const resendOtp = async () => {
  if (countdown.value > 0) return
  await requestOtpDirectly()
}

onUnmounted(() => {
  clearInterval(timer)
})

const handleInput = (index, event) => {
  const value = event.target.value
  if (!/^[0-9]$/.test(value)) {
    code.value[index] = ''
    return
  }
  if (index < 5 && value) {
    inputRefs.value[index + 1].focus()
  }
}

const handleKeydown = (index, event) => {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    inputRefs.value[index - 1].focus()
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  if (pastedData) {
    const chars = pastedData.split('')
    chars.forEach((char, i) => {
      code.value[i] = char
    })
    const nextEmpty = code.value.findIndex(c => !c)
    const targetIndex = nextEmpty === -1 ? 5 : nextEmpty
    if (inputRefs.value[targetIndex]) inputRefs.value[targetIndex].focus()
    
    if (pastedData.length === 6) {
      setTimeout(() => handleVerifyOtp(), 100)
    }
  }
}
</script>
