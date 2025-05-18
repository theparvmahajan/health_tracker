import Link from "next/link"
import { AnimatedLogo } from "@/components/animated-logo"
import { AnimatedFeatures } from "@/components/animated-features"
import { LoginSignupButtons } from "@/components/login-signup-buttons"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="w-full max-w-3xl mx-auto space-y-8">
          <AnimatedLogo />

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text animate-gradient">
            Wellness Tracker
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Track your sleep, fitness, and mental health all in one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up">
            <LoginSignupButtons />
          </div>
        </div>
      </div>

      <AnimatedFeatures />

      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Wellness Tracker. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
