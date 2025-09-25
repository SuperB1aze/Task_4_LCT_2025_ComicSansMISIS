import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginCredentials } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        try {
          // TODO: Replace with actual API call
          const mockUser: User = {
            id: '1',
            email: credentials.email,
            name: 'Авиационный Инженер',
            role: 'engineer',
            department: 'Техническое обслуживание',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
