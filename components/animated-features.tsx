"use client"

import { useEffect, useState } from "react"
import { Moon, Activity, Heart } from "lucide-react"

export function AnimatedFeatures() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: <Moon className="h-10 w-10 text-indigo-500" />,
      title: "Sleep Tracking",
      description: "Log your sleep patterns and visualize your rest quality over time.",
    },
    {
      icon: <Activity className="h-10 w-10 text-pink-500" />,
      title: "Fitness Routines",
      description: "Create custom workout routines with exercise timers and progress tracking.",
    },
    {
      icon: <Heart className="h-10 w-10 text-orange-500" />,
      title: "Mental Wellness",
      description: "Journal your thoughts and track your mood with beautiful visualizations.",
    },
  ]

  return (
    <div className="py-16 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-card rounded-lg p-6 shadow-sm border flex flex-col items-center text-center transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="mb-4 p-3 rounded-full bg-muted">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
