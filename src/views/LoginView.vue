<template>
  <div class="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Acesso Seguro</h1>
      <p class="text-slate-500 text-sm">Use o e-mail cadastrado na escola para acessar a loja sem precisar de senhas.</p>
    </div>

    <!-- Etapa 1: E-mail -->
    <div v-if="step === 1">
      <form @submit.prevent="handleSendOtp" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Seu E-mail</label>
          <input 
            v-model="email" 
            type="email" 
            required
            placeholder="pai@exemplo.com"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            :disabled="authStore.loading"
          >
        </div>
        <button 
          type="submit" 
          :disabled="authStore.loading || !email"
          class="w-full bg-primary hover:bg-primary/90 text-slate-900 font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          <span v-if="authStore.loading" class="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
          <span v-else>Receber Código de Acesso</span>
        </button>
      </form>
    </div>

    <!-- Etapa 2: Código OTP -->
    <div v-else-if="step === 2" class="space-y-6">
      <div class="text-center text-sm text-slate-600 mb-6">
        Enviamos um código de 6 dígitos para <br><span class="font-semibold text-slate-900">{{ email }}</span>
      </div>
      
      <form @submit.prevent="handleVerifyOtp" class="space-y-6">
        <!-- Grid de inputs (6 dígitos) -->
        <div class="flex justify-between gap-2" @paste="handlePaste">
          <input 
            v-for="(digit, index) in code" 
            :key="index"
            :ref="el => inputRefs[index] = el"
            v-model="code[index]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-12 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
            :disabled="authStore.loading"
          >
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

      <div class="text-center">
        <button 
          @click="resendOtp" 
          :disabled="countdown > 0 || authStore.loading"
          class="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          {{ countdown > 0 ? `Reenviar em ${countdown}s` : 'Não recebi o código' }}
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

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const email = ref('')
const code = ref(['', '', '', '', '', ''])
const inputRefs = ref([])
const countdown = ref(0)
let timer = null

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

onUnmounted(() => {
  clearInterval(timer)
})

const handleSendOtp = async () => {
  try {
    await authStore.sendOtp(email.value)
    toast.success('Código enviado!', {
      description: 'Verifique sua caixa de entrada e spam.'
    })
    step.value = 2
    startCountdown()
    // Auto focus first input after DOM updates
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
    await authStore.verifyOtp(email.value, fullCode)
    toast.success('Login realizado com sucesso!')
    
    if (authStore.storeProfile?.statusCadastro === 'incompleto') {
      router.push('/completar-cadastro')
    } else {
      router.push('/checkout')
    }
  } catch (err) {
    if (err.response?.status === 400) {
      toast.error('O código expirou. Solicite um novo.')
    } else if (err.response?.status === 401) {
      toast.error('Código inválido. Tente novamente.')
    } else {
      toast.error('Erro ao validar o código.')
    }
    // Clear code on error
    code.value = ['', '', '', '', '', '']
    if (inputRefs.value[0]) inputRefs.value[0].focus()
  }
}

const resendOtp = async () => {
  if (countdown.value > 0) return
  await handleSendOtp()
}

// Lógica refinada para os inputs do OTP
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
    // Foca no próximo input vazio ou no último
    const nextEmpty = code.value.findIndex(c => !c)
    const targetIndex = nextEmpty === -1 ? 5 : nextEmpty
    inputRefs.value[targetIndex].focus()
    
    // Auto-submit se colou os 6
    if (pastedData.length === 6) {
      setTimeout(() => handleVerifyOtp(), 100)
    }
  }
}
</script>
