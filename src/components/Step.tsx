import type { ReactNode } from 'react'

type StepProps = { icon: ReactNode; number: string; title: string; text: string }

export function Step({ icon, number, title, text }: StepProps) {
  return <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-board-alt text-mint">{icon}</span><div><p className="font-mono text-[10px] text-sun">{number}</p><h3 className="mt-1 font-display text-base font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/45">{text}</p></div></div>
}
