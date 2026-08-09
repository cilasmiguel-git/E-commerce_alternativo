import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.educacaoalternativa360.com.br',
  withCredentials: true // Importante para receber cookies (JWT) do backend
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    storeProfile: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  
  actions: {
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

    async verifyOtp(email, code) {
      this.loading = true
      this.error = null
      try {
        const tenantId = import.meta.env.VITE_TENANT_ID || 'ID_DO_COLACO_AQUI'
        const response = await api.post('/api/auth/store/verify-otp', {
          email,
          tenantId,
          code
        })
        
        if (response.data.status === 'success') {
          this.user = response.data.user
          this.storeProfile = response.data.storeProfile
          this.isAuthenticated = true
          return response.data
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Código inválido ou expirado'
        throw err
      } finally {
        this.loading = false
      }
    },

    async completeProfile(profileData) {
      this.loading = true
      this.error = null
      try {
        // Exemplo de rota de atualização - precisará ser confirmada com o backend
        const response = await api.put('/api/auth/store/profile', profileData)
        
        if (response.data.storeProfile) {
          this.storeProfile = response.data.storeProfile
        } else {
          // Atualização otimista caso a API não retorne o perfil inteiro
          this.storeProfile = { ...this.storeProfile, ...profileData, statusCadastro: 'completo' }
        }
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
      this.isAuthenticated = false
      // api.post('/api/auth/logout') // Opcional: chamar API de logout se existir
    }
  }
})
