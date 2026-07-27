"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "motion/react"
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { loginAction } from "../_actions/authAction"
import { useRouter } from "next/navigation"


const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(3, "Password must be at least 3 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  async function onSubmit(values: LoginValues) {
  
    
    const loginCredentials = {
      email: values.email,
      password: values.password
    }
    const res = await loginAction(loginCredentials);

    if(res.success){
      toast.success("Welcome back");
      router.push("/")
    }else{
      toast.error(res.message || "Login failed. Please try again.")
    }
  
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <Card className="relative overflow-hidden rounded-xl border-0 bg-card/70 shadow-xl ring-1 ring-foreground/10 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
        {/* subtle top accent glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-primary/15 blur-3xl"
        />

        <CardHeader className="relative gap-2 text-center">
          <motion.div variants={item} initial="hidden" animate="show">
            <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Lock className="size-5" />
            </div>
            <CardTitle className="text-xl tracking-tight">Welcome back</CardTitle>
            <CardDescription className="mt-1">
              Sign in to your account to continue
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="relative">
          <motion.form
            variants={container}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <motion.div variants={item} className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="group relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  className="h-11 pl-9 transition-shadow duration-200 focus-visible:shadow-[0_0_0_4px] focus-visible:shadow-primary/10"
                  {...register("email")}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </motion.div>

            {/* Password */}
            <motion.div variants={item} className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.password}
                  className="h-11 px-9 transition-shadow duration-200 focus-visible:shadow-[0_0_0_4px] focus-visible:shadow-primary/10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? "eye-off" : "eye"}
                      initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
                      transition={{ duration: 0.18 }}
                      className="flex"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              <FieldError message={errors.password?.message} />
            </motion.div>

            {/* Forgot password */}
            <motion.div variants={item} className="-mt-1 flex justify-end">
              <a
                href="#"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Forgot password?
              </a>
            </motion.div>

            {/* Submit */}
            <motion.div variants={item}>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-lg text-sm font-semibold shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </motion.div>
            </motion.div>

            <motion.p
              variants={item}
              className="text-center text-sm text-muted-foreground"
            >
              {"Don't have an account? "}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Sign up
              </a>
            </motion.p>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key={message}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={cn("overflow-hidden text-xs font-medium text-destructive")}
          role="alert"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}
