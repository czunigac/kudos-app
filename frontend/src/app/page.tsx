"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Award, Check, Star, Trophy, Zap } from "lucide-react";
import Link from "next/link";

const bg = "#0F0F12";
const surface = "#18181C";
const accent = "#7B6EF6";

const fadeContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const fadeItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: bg }}>
      <header
        className="sticky top-0 z-50 border-b border-white/[0.07] backdrop-blur-md"
        style={{ backgroundColor: `${bg}e6` }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: accent }}
            >
              <Star className="h-4 w-4 text-white" fill="currentColor" aria-hidden />
            </span>
            <span className="text-sm font-semibold tracking-tight">KudosApp</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white/80" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              className="font-medium text-white"
              style={{ backgroundColor: accent }}
              asChild
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full blur-[100px]"
          style={{ backgroundColor: accent, opacity: 0.06 }}
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full blur-[90px]"
          style={{ backgroundColor: "#2DD4A4", opacity: 0.06 }}
        />
        <div
          className="pointer-events-none absolute left-1/3 top-10 h-64 w-64 rounded-full blur-[80px]"
          style={{ backgroundColor: accent, opacity: 0.05 }}
        />

        <motion.div
          className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
          variants={fadeContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeItem}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium"
            style={{ color: accent, backgroundColor: `${accent}14` }}
          >
            <span aria-hidden>✦</span>
            <span>AI-powered recognition</span>
          </motion.span>
          <motion.h1
            variants={fadeItem}
            className="text-5xl font-semibold leading-[1.08] tracking-tight md:text-7xl"
          >
            Recognize the people
            <br />
            <span style={{ color: accent }}>who make it happen</span>
          </motion.h1>
          <motion.p
            variants={fadeItem}
            className="mt-6 max-w-[480px] text-lg text-white/55"
          >
            Give meaningful kudos, earn points, and build a culture where great work
            never goes unnoticed.
          </motion.p>
          <motion.div
            variants={fadeItem}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 gap-2 px-8 text-base font-medium text-white"
              style={{ backgroundColor: accent }}
              asChild
            >
              <Link href="/register">
                Start for free
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-12 text-base text-white/70 hover:bg-white/5 hover:text-white"
              asChild
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-y border-white/[0.07] py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/[0.07] md:px-6">
          {[
            ["2,400+", "Kudos sent this month"],
            ["98%", "Team engagement rate"],
            ["47", "Companies using KudosApp"],
            ["4.9★", "Average team rating"],
          ].map(([n, l]) => (
            <div key={l} className="text-center md:px-6">
              <p className="text-2xl font-medium md:text-3xl">{n}</p>
              <p className="mt-1 text-xs text-white/45 md:text-sm">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 px-4 py-24 md:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Recognition in three steps
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                Icon: Award,
                t: "Give Kudos",
                d: "Select a teammate, pick a category, write your message",
              },
              {
                n: "02",
                Icon: Zap,
                t: "AI Coach helps",
                d: "Our Kudos Coach refines your message for maximum impact",
              },
              {
                n: "03",
                Icon: Trophy,
                t: "Earn & Celebrate",
                d: "Points, badges, and a public feed celebrate great work",
              },
            ].map(({ n, Icon, t, d }) => (
              <div
                key={n}
                className="rounded-xl border border-white/[0.07] p-6 text-left transition-colors hover:border-white/[0.15]"
                style={{ backgroundColor: surface }}
              >
                <p className="text-xs text-white/40">{n}</p>
                <Icon className="mt-4 h-8 w-8" style={{ color: accent }} aria-hidden />
                <h3 className="mt-3 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-white/50">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 md:flex-row md:items-start md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <span
              className="inline-block rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/70"
              style={{ backgroundColor: surface }}
            >
              Powered by AI
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Write kudos that actually mean something
            </h2>
            <p className="mt-4 text-base text-white/55">
              Kudos Coach analyzes your draft in real time and suggests improvements,
              the right category, and even who on your team deserves recognition most.
            </p>
            <ul className="mt-8 space-y-3 text-left text-sm text-white/70">
              {[
                "Real-time suggestions",
                "Smart recipient matching",
                "Category auto-detection",
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" style={{ color: accent }} aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <motion.div
            className="w-full max-w-md flex-1 rounded-xl p-5"
            style={{
              backgroundColor: surface,
              boxShadow: `0 0 0 1px ${accent}, 0 0 48px -12px ${accent}55`,
            }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-xs font-medium text-white/60">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: accent }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: accent }}
                />
              </span>
              Kudos Coach
            </div>
            <p className="mt-4 text-sm italic text-white/50">
              &ldquo;Sarah shipped the redesign ahead of schedule and unblocked the whole
              squad…&rdquo;
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Innovation · 50pts", "Recipient confirmed", "High impact"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-24 text-center md:px-6">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to build a culture of recognition?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-white/55">
          Join teams that celebrate the people behind great work.
        </p>
        <Button
          size="lg"
          className="mt-10 h-12 gap-2 px-10 text-base font-medium text-white"
          style={{ backgroundColor: accent }}
          asChild
        >
          <Link href="/register">
            Get started for free
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </section>

      <footer className="border-t border-white/[0.07] px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/45 sm:flex-row">
          <p>
            <span className="font-semibold text-white/80">KudosApp</span> · © 2026
          </p>
          <p>Built with AI · Applaudo Assessment</p>
        </div>
      </footer>
    </div>
  );
}
