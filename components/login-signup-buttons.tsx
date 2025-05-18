"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"

export function LoginSignupButtons() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()

  const handleSuccess = () => {
    setOpen(false)
    router.push("/dashboard")
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Get Started
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to Wellness Tracker</DialogTitle>
            <DialogDescription>
              Sign in to your account or create a new one to start tracking your wellness journey.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm onSuccess={() => setActiveTab("login")} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="lg"
        onClick={() => {
          router.push("/dashboard")
        }}
      >
        Try Demo
      </Button>
    </>
  )
}
