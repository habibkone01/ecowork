import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    const login = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
    }

    const isAdmin = () => user?.role === 'administrateur'
    const isUser = () => user?.role === 'utilisateur'

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}