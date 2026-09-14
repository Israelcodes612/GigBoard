import api from './axios'
import type { Category, Gig, NewGig } from '../types'

export interface ApiGig {
  id: string
  provider_id: string
  title: string
  category: Category
  description: string
  price_ngn: number
  delivery_days: string
  provider_name: string
  provider_domain: string | null
  created_at: string
}

const PIN_BY_CATEGORY: Record<Category, string> = {
  Design: 'bg-coral',
  Repairs: 'bg-mint',
  Writing: 'bg-sun',
  Dev: 'bg-lav',
  Tutoring: 'bg-coral',
}

const TAG_BY_CATEGORY: Record<Category, string> = {
  Design: 'bg-[#fff0ed] text-[#e1493a]',
  Repairs: 'bg-[#e9fbf5] text-[#22a87e]',
  Writing: 'bg-[#fff7df] text-[#c08311]',
  Dev: 'bg-[#f0eeff] text-[#7160d5]',
  Tutoring: 'bg-[#fff0ed] text-[#e1493a]',
}

const ROTATIONS = ['-.6deg', '.4deg', '-1.2deg', '1deg', '.8deg', '-1deg']

export function apiGigToGig(apiGig: ApiGig, index = 0): Gig {
  return {
    id: apiGig.id,
    category: apiGig.category,
    title: apiGig.title,
    description: apiGig.description,
    person: apiGig.provider_name,
    department: apiGig.provider_domain ? `${apiGig.provider_domain}` : '—',
    price: `₦${apiGig.price_ngn.toLocaleString('en-NG')}`,
    delivery: apiGig.delivery_days,
    rating: '5.0',
    reviews: 0,
    pin: PIN_BY_CATEGORY[apiGig.category],
    tag: TAG_BY_CATEGORY[apiGig.category],
    rotation: ROTATIONS[index % ROTATIONS.length],
  }
}

export async function fetchGigs(): Promise<Gig[]> {
  const { data } = await api.get<ApiGig[]>('/gigs')
  return data.map(apiGigToGig)
}

export async function createGig(input: NewGig): Promise<Gig> {
  const { data } = await api.post<ApiGig>('/gigs', {
    title: input.title,
    category: input.category,
    description: input.description,
    price: Number(input.price),
    delivery: input.delivery,
  })
  return apiGigToGig(data)
}