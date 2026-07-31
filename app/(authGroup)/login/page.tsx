import React, { Suspense } from 'react'
import LoginForm from '../_components/loginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}