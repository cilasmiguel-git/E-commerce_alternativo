import { defineStore } from 'pinia'
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.educacaoalternativa360.com.br',
  withCredentials: true // Importante para receber cookies (JWT) do backend
})

// Adiciona o token Bearer no cabeçalho se o cookie falhar (CORS/Cross-Origin)
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('store_auth')
  if (stored) {
    try {
      const data = JSON.parse(stored)
      if (data.token) {
        if (config.headers.set) {
          config.headers.set('Authorization', `Bearer ${data.token}`)
        } else {
          config.headers.Authorization = `Bearer ${data.token}`
        }
      }
    } catch (e) {}
  }
  return config
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    storeProfile: null,
    token: null, // Armazenando o token do backend
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const tenantId = import.meta.env.VITE_TENANT_ID || 'ID_DO_COLACO_AQUI'
        const response = await api.post('/api/auth/store/login', {
          email,
          password,
          tenantId
        })
        
        if (response.data.status === 'success') {
          this.user = response.data.user
          this.storeProfile = response.data.storeProfile
          this.token = response.data.token
          this.isAuthenticated = true
          this.persistState()
          return response.data
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao realizar login'
        throw err
      } finally {
        this.loading = false
      }
    },

    async sendOtp(email) {
      this.loading = true
      this.error = null
      try {
        const tenantId = import.meta.env.VITE_TENANT_ID || 'ID_DO_COLACO_AQUI'
        const response = await api.post('/api/auth/store/send-otp', {
          email,
          tenantId
        })
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao enviar código'
        throw err
      } finally {
        this.loading = false
      }
    },

    async verifyOtp(email, code, password = null) {
      this.loading = true
      this.error = null
      try {
        const tenantId = import.meta.env.VITE_TENANT_ID || 'ID_DO_COLACO_AQUI'
        const payload = {
          email,
          tenantId,
          code
        }
        if (password) {
          payload.password = password
        }

        const response = await api.post('/api/auth/store/verify-otp', payload)
        
        if (response.data.status === 'success') {
          this.user = response.data.user
          this.storeProfile = response.data.storeProfile
          this.token = response.data.token // Salva o token
          this.isAuthenticated = true
          
          // Salva no localStorage para não perder no refresh
          this.persistState()
          
          return response.data
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Código inválido ou expirado'
        throw err
      } finally {
        this.loading = false
      }
    },

    async setPassword(password) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/auth/store/set-password', {
          password
        })
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao definir senha'
        throw err
      } finally {
        this.loading = false
      }
    },

    async completeProfile(profileData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put('/api/auth/store/profile', profileData)
        
        if (response.data.storeProfile) {
          this.storeProfile = response.data.storeProfile
        } else {
          this.storeProfile = { ...this.storeProfile, ...profileData, statusCadastro: 'completo' }
        }
        
        this.persistState()
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao atualizar perfil'
        throw err
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.storeProfile = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('store_auth')
      // api.post('/api/auth/logout') // Opcional: chamar API de logout
    },

    persistState() {
      localStorage.setItem('store_auth', JSON.stringify({
        user: this.user,
        storeProfile: this.storeProfile,
        token: this.token,
        isAuthenticated: this.isAuthenticated
      }))
    },

    initAuth() {
      const stored = localStorage.getItem('store_auth')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          this.user = data.user
          this.storeProfile = data.storeProfile
          this.token = data.token
          this.isAuthenticated = data.isAuthenticated
        } catch (e) {
          console.error('Erro ao ler auth state do storage', e)
        }
      }
    }
  }
})
