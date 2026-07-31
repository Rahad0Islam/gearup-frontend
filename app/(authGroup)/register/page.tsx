import React, { Suspense } from 'react'
import RegisterForm from '../_components/registerForm'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}