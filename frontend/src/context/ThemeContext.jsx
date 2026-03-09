import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [lowCarbon, setLowCarbon] = useState(() => {
        return localStorage.getItem('lowCarbon') === 'true'
    })

    useEffect(() => {
        localStorage.setItem('lowCarbon', lowCarbon)
        if (lowCarbon) {
            document.body.classList.add('low-carbon')
        } else {
            document.body.classList.remove('low-carbon')
        }
    }, [lowCarbon])

    const toggleLowCarbon = () => setLowCarbon(prev => !prev)

    return (
        <ThemeContext.Provider value={{ lowCarbon, toggleLowCarbon }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}