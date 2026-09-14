import { createContext, useContext, useEffect, useState } from 'react'
import { api, setAuthToken, loadStoredToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = loadStoredToken()
    setToken(stored)
    setReady(true)
  }, [])

  async function login(email, password) {
    const { access_token } = await api.login(email, password)
    setAuthToken(access_token)
    setToken(access_token)
  }

  async function register(email, password) {
    await api.register(email, password)
    await login(email, password)
  }

  function logout() {
    setAuthToken(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
