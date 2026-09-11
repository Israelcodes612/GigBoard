import type { ReactNode } from 'react'

export function PageShell({ eyebrow, title, description, className = '', children }: { eyebrow: string; title: string; description: string; className?: string; children: ReactNode }) {
  return <main className={`page-shell-enter mx-auto max-w-[1100px] px-5 pb-24 pt-10 lg:px-8 lg:pt-14 ${eyebrow === '02 · Gig detail' ? 'gig-detail-page' : ''} ${className}`}><div className="page-shell-header mb-8 max-w-2xl"><p className="mb-3 font-mono text-[11px] uppercase tracking-[.18em] text-sun">{eyebrow}</p><h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1><p className="mt-4 text-sm leading-6 text-white/55">{description}</p></div>{children}</main>
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="mb-4 block text-xs font-semibold text-paper"><span className="mb-2 block">{label}</span>{children}</label>
}

export function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-board-alt p-5"><p className="font-mono text-[10px] uppercase tracking-wide text-white/45">{label}</p><p className="mt-2 font-display text-2xl font-bold" dangerouslySetInnerHTML={{ __html: value }} /></div>
}
