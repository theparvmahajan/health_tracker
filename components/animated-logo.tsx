"use client"

import { useEffect, useState } from "react"

export function AnimatedLogo() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative w-32 h-32 mx-auto">
      <div
        className={`absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full transition-all duration-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />

      <div
        className={`absolute inset-0 m-auto w-4/5 h-4/5 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-full transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 scale-85" : "opacity-0 scale-0"
        }`}
      />

      <div
        className={`absolute inset-0 m-auto w-3/5 h-3/5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center transition-all duration-700 delay-400 ${
          isVisible ? "opacity-100 scale-60" : "opacity-0 scale-0"
        }`}
      >
        <div
          className={`text-2xl font-bold transition-all duration-500 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          WT
        </div>
      </div>
    </div>
  )
}
