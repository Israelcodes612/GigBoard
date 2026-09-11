export type Category = 'Design' | 'Repairs' | 'Writing' | 'Dev' | 'Tutoring'

export type Gig = {
  id: number
  category: Category
  title: string
  person: string
  department: string
  price: string
  rating: string
  reviews: number
  delivery: string
  description: string
  pin: string
  tag: string
  rotation: string
}

export type View = 'browse' | 'gig' | 'profile' | 'create' | 'orders' | 'order' | 'auth'

export type NewGig = {
  title: string
  category: Category
  description: string
  price: string
  delivery: string
}
