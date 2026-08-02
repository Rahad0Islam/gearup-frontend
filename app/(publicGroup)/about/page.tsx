import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import {
  Mail,
  Globe,
  Sparkles,
  Code2,
  Atom,
  Boxes,
  Briefcase,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About · GearUp",
  description:
    "Meet the developer behind GearUp — a peer-to-peer rental marketplace for outdoor and adventure gear.",
}

const CONTACTS = [
  {
    label: "GitHub",
    handle: "Rahad0Islam",
    href: "https://github.com/Rahad0Islam",
    description: "Open source projects, side quests, and code reviews.",
    Icon: Code2,
  },
  {
    label: "Portfolio",
    handle: "rahad-islam.vercel.app",
    href: "https://rahad-islam.vercel.app/",
    description: "Full-stack work, case studies, and what I'm building next.",
    Icon: Boxes,
  },
  {
    label: "Email",
    handle: "vairahad99@gmail.com",
    href: "mailto:vairahad99@gmail.com",
    description: "Reach out for collaboration, feedback, or a quick hello.",
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    handle: "md-rahad-islam",
    href: "https://www.linkedin.com/in/md-rahad-islam/",
    description: "Professional background, endorsements, and experience.",
    Icon: Briefcase,
  },
] as const

const HIGHLIGHTS = [
  {
    Icon: Atom,
    title: "Full-stack craft",
    body: "TypeScript, Next.js, Node.js, and Postgres — production systems from DB to UI.",
  },
  {
    Icon: Sparkles,
    title: "Built GearUp",
    body: "Designed and shipped the rental marketplace end-to-end as a passion project.",
  },
  {
    Icon: Globe,
    title: "Remote-first",
    body: "Working from Bangladesh, serving explorers and lenders across the region.",
  },
] as const

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="grid gap-10 md:grid-cols-[auto,1fr] md:items-center">
        <div className="relative mx-auto md:mx-0">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-full bg-gradient-to-br from-emerald-400/40 via-teal-400/30 to-cyan-400/40 blur-2xl"
          />
          <div className="relative size-44 overflow-hidden rounded-full border-4 border-white shadow-xl ring-1 ring-emerald-500/20 sm:size-56">
            <Image
              src="/rahad.png"
              alt="Portrait of Rahad Islam"
              width={320}
              height={320}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-5 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <Sparkles className="size-3.5" /> About the maker
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Rahad Islam
            </span>
            .
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
            I&apos;m the solo developer behind{" "}
            <Link
              href="/"
              className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              GearUp
            </Link>{" "}
            — a peer-to-peer rental marketplace for outdoor and adventure gear. I
            love building thoughtful, fast products that help people spend less
            and explore more. GearUp is a passion project I designed,
            engineered, and shipped from scratch.
          </p>

          <div className="flex flex-wrap justify-center gap-2 pt-2 md:justify-start">
            {CONTACTS.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-emerald-500/60 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500/60 dark:hover:text-emerald-400"
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-12 dark:bg-slate-800" />

      {/* Highlights */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            What I bring to GearUp
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A short snapshot of how this project came together.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ Icon, title, body }) => (
            <Card
              key={title}
              className="border-slate-200/70 bg-white/70 backdrop-blur transition-colors hover:border-emerald-500/40 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <CardContent className="space-y-3 p-5">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12 dark:bg-slate-800" />

      {/* Contact cards */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Let&apos;s connect
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Pick a channel that suits you — feedback, ideas, or a friendly hello
            are all welcome.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CONTACTS.map(({ label, handle, href, description, Icon }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="group"
            >
              <Card className="h-full border-slate-200/70 bg-white/70 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 text-emerald-600 ring-1 ring-emerald-500/20 transition-colors group-hover:from-emerald-500/25 group-hover:to-teal-500/25 dark:text-emerald-400">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {label}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {handle}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
