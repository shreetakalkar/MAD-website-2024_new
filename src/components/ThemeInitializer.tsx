"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = theme === 'dark' || (theme === 'system' && systemDark)
      
      if (isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.style.colorScheme = 'dark'
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.style.colorScheme = 'light'
      }
    } catch (e) {}
  }, [])

  return null
}