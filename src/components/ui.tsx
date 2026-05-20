import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-terminal-border-subtle bg-terminal-bg-secondary shadow-panel ${className}`}>{children}</section>
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'danger' | 'accent' }) {
  const tones: Record<string, string> = {
    neutral: 'border-terminal-border-subtle bg-terminal-bg-elevated text-terminal-text-secondary',
    success: 'border-terminal-success/30 bg-terminal-success/10 text-terminal-success',
    danger: 'border-terminal-danger/30 bg-terminal-danger/10 text-terminal-danger',
    accent: 'border-terminal-accent-primary/30 bg-terminal-accent-primary/10 text-terminal-accent-primary',
  }
  return <span className={`rounded-xl border px-3 py-1 text-label-xs font-semibold uppercase tracking-[0.08em] ${tones[tone]}`}>{children}</span>
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="mb-3"><h3 className="text-section-title font-semibold text-terminal-text-primary">{title}</h3>{subtitle ? <p className="mt-1 text-secondary-sm text-terminal-text-secondary">{subtitle}</p> : null}</div>
}
