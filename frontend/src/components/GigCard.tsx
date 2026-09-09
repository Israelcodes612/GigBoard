import { ChevronRight, Clock3, Star } from 'lucide-react'
import type { Gig } from '../types'

type GigCardProps = {
  gig: Gig
  index: number
  onOpen: () => void
}

export function GigCard({ gig, index, onOpen }: GigCardProps) {
  return <button onClick={onOpen} className="animate-rise block w-full text-left" style={{ animationDelay: `${index * 60}ms` }}><article className="note-tilt paper-grain relative min-h-[245px] rounded bg-paper p-5 text-board shadow-note" style={{ '--rotation': gig.rotation } as React.CSSProperties}><span className={`absolute left-1/2 top-[-7px] h-3.5 w-3.5 -translate-x-1/2 rounded-full ${gig.pin} shadow-[0_3px_5px_rgba(0,0,0,.45)]`} /><div className="flex items-center justify-between"><span className={`rounded px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${gig.tag}`}>{gig.category}</span><span className="flex items-center gap-1 font-mono text-[11px] text-[#6b6980]"><Star size={12} className="fill-sun text-sun-deep" /> {gig.rating} ({gig.reviews})</span></div><h2 className="mt-5 font-display text-xl font-bold leading-tight">{gig.title}</h2><p className="mt-2 text-xs text-[#6b6980]">by {gig.person} · {gig.department}</p><div className="mt-6 flex items-end justify-between"><div><p className="font-mono text-lg font-medium">{gig.price}</p><p className="mt-1 flex items-center gap-1 text-[11px] text-[#6b6980]"><Clock3 size={12} /> Delivery: {gig.delivery}</p></div><span className="flex h-8 w-8 items-center justify-center rounded-full border border-board/15 text-board/50"><ChevronRight size={16} /></span></div></article></button>
}
