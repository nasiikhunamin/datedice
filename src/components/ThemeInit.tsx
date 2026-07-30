"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"

export default function ThemeInit() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    let dark = false
    if (stored === "dark") {
      dark = true
      document.documentElement.classList.add("dark")
    } else if (stored === "light") {
      dark = false
      document.documentElement.classList.remove("dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      dark = prefersDark
      if (prefersDark) document.documentElement.classList.add("dark")
    }
    
    // Wrap state updates in setTimeout to run asynchronously
    const timer = setTimeout(() => {
      setIsDark(dark)
      setMounted(true)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  if (!mounted) return null

  return (
    <motion.button
      onClick={toggle}
      className="fixed top-3 right-3 z-50 flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </motion.button>
  )
}
