import { Navbar } from "@/components/navbar"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center">
        <p className="rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          Navbar ready
        </p>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Rent premium gear, <span className="text-primary">on demand</span>
        </h1>
        <p className="mt-4 max-w-md text-pretty text-muted-foreground leading-relaxed">
          The navbar is in place with glassmorphism on scroll, light/dark mode, and
          a responsive mobile menu. Sections coming next.
        </p>
      </main>
    </div>
  )
}
