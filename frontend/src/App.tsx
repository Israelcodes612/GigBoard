import { useEffect, useRef, useState } from 'react'
import { Bell, BriefcaseBusiness, Check, CirclePlus, Menu, X, LogOut } from 'lucide-react'
import { BrowsePage } from './pages/BrowsePage'
import { AuthPage } from './pages/AuthPage'
import { CreatePage, GigPage, OrderPage, OrdersPage, ProfilePage } from './pages/MarketplacePages'
import type { Gig, NewGig, View } from './types'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading, logout } = useAuth()
  const isAuthenticated = !!user

  const [view, setView] = useState<View>('browse')
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [authRedirect, setAuthRedirect] = useState<View>('browse')
  const [notice, setNotice] = useState('')
  const [orderTab, setOrderTab] = useState<'requester' | 'provider'>('requester')
  const [newGig, setNewGig] = useState<NewGig>({ title: '', category: 'Design', description: '', price: '', delivery: '' })

  const navigate = (nextView: View, gig: Gig | null = null) => {
    if (!isAuthenticated && ['create', 'orders', 'order'].includes(nextView)) {
      setAuthRedirect(nextView)
      nextView = 'auth'
    }
    setView(nextView)
    setSelectedGig(gig)
    setMobileNav(false)
    window.history.replaceState(null, '', nextView === 'browse' ? '#browse' : `#${nextView}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (loading) return // don't decide protected routes until we know if user is logged in

    const syncView = () => {
      const hash = window.location.hash.slice(1) as View
      if (!['browse', 'gig', 'profile', 'create', 'orders', 'order', 'auth'].includes(hash)) return
      if (!isAuthenticated && ['create', 'orders', 'order'].includes(hash)) {
        setAuthRedirect(hash)
        setView('auth')
        return
      }
      setView(hash)
    }
    syncView()
    window.addEventListener('popstate', syncView)
    return () => window.removeEventListener('popstate', syncView)
  }, [isAuthenticated, loading])

  const previousScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const root = document.documentElement

      if (currentScrollY <= 8 || currentScrollY < previousScrollY.current - 6) {
        root.classList.remove('mobile-header-hidden')
      } else if (currentScrollY > previousScrollY.current + 6) {
        root.classList.add('mobile-header-hidden')
        setMobileNav(false)
      }

      previousScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const completeAuth = () => {
    showNotice('Welcome to the board.')
    setView(authRedirect)
    setSelectedGig(null)
    window.history.replaceState(null, '', authRedirect === 'browse' ? '#browse' : `#${authRedirect}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    await logout()
    showNotice('Signed out.')
    navigate('browse')
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (loading) {
    return <div className="loading-screen board-texture flex min-h-screen items-center justify-center bg-board text-paper"><div className="loading-mark"><span className="h-3.5 w-3.5 rounded-full bg-coral" /><span className="font-display text-lg font-bold tracking-tight">GigBoard</span></div></div>
  }

  return <div className="board-texture min-h-screen bg-board text-paper">
    <header className="sticky top-0 z-30 border-b border-white/10 bg-board/95 backdrop-blur-md"><div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-8"><div className="flex items-center gap-3"><button className="menu-toggle relative h-10 w-10 rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden" onClick={() => setMobileNav((open) => !open)} aria-label={mobileNav ? 'Close menu' : 'Open menu'} aria-expanded={mobileNav}><Menu className={`absolute inset-2 transition-all duration-300 ${mobileNav ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} size={21} /><X className={`absolute inset-2 transition-all duration-300 ${mobileNav ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} size={21} /></button><div className="flex items-center gap-2.5"><span className="h-3.5 w-3.5 rounded-full bg-coral shadow-[0_2px_5px_rgba(0,0,0,.5)]" /><span className="font-display text-lg font-bold tracking-tight">GigBoard</span></div></div><nav className="hidden items-center gap-8 text-sm text-white/55 lg:flex"><button onClick={() => navigate('browse')} className={view === 'browse' ? 'font-semibold text-paper' : 'hover:text-paper'}>Browse gigs</button><button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-paper">How it works</button><button onClick={() => navigate('profile')} className="hover:text-paper">Community</button></nav><div className="flex items-center gap-2"><button onClick={() => navigate('orders')} className="hidden items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-paper transition hover:border-white/50 sm:flex"><BriefcaseBusiness size={15} /> My orders</button><button onClick={() => showNotice('You are all caught up.')} className="rounded-lg border border-white/15 p-2 text-white/70 hover:bg-white/10" aria-label="Notifications"><Bell size={17} /></button>
      {!isAuthenticated && <button onClick={() => navigate('auth')} className="hidden rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-white/40 sm:block">Sign in</button>}
      {isAuthenticated && <button onClick={handleLogout} className="hidden items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-white/40 sm:flex"><LogOut size={14} /> Sign out</button>}
      <button onClick={() => navigate('create')} className="hidden items-center gap-2 rounded-lg bg-coral px-4 py-2.5 text-sm font-semibold text-board transition hover:bg-[#e1493a] sm:flex"><CirclePlus size={16} /> Post a gig</button>
      <button onClick={() => navigate(isAuthenticated ? 'profile' : 'auth')} className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg bg-lav font-mono text-xs font-bold text-board" aria-label="Open profile">{isAuthenticated ? initials : '?'}</button>
    </div></div></header>
    <div className={`fixed inset-0 z-50 bg-board/80 transition-opacity duration-300 lg:hidden ${mobileNav ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setMobileNav(false)}><aside className={`h-full w-72 border-r border-white/10 bg-board-alt p-5 transition-transform duration-300 ease-out ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`} onClick={(event) => event.stopPropagation()}><div className="mb-10 flex items-center justify-between"><span className="font-display text-xl font-bold">GigBoard</span><button onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={20} /></button></div><nav className="grid gap-2 text-sm"><button onClick={() => navigate('browse')} className="rounded-lg bg-white/10 px-4 py-3 text-left font-semibold">Browse gigs</button><button onClick={() => navigate('orders')} className="rounded-lg px-4 py-3 text-left text-white/60">My orders</button><button onClick={() => navigate('create')} className="rounded-lg px-4 py-3 text-left text-white/60">Post a gig</button><button onClick={() => navigate('profile')} className="rounded-lg px-4 py-3 text-left text-white/60">Community</button>
      {!isAuthenticated && <button onClick={() => navigate('auth')} className="rounded-lg px-4 py-3 text-left text-white/60">Sign in</button>}
      {isAuthenticated && <button onClick={handleLogout} className="rounded-lg px-4 py-3 text-left text-white/60">Sign out</button>}
    </nav></aside></div>
    {notice && <div className="notice-enter fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-board shadow-2xl"><Check size={16} /> {notice}</div>}
    <div key={view} className="page-content-enter">
      {view === 'browse' && <BrowsePage onOpenGig={(gig) => navigate('gig', gig)} />}
      {view === 'gig' && selectedGig && <GigPage gig={selectedGig} onBack={() => navigate('browse')} onProfile={() => navigate('profile')} onRequest={() => { if (!isAuthenticated) { setAuthRedirect('orders'); navigate('auth'); return } showNotice('Request sent. Check My orders for updates.'); navigate('orders') }} />}
      {view === 'profile' && <ProfilePage onGig={(gig) => navigate('gig', gig)} />}
      {view === 'create' && <CreatePage newGig={newGig} setNewGig={setNewGig} onSubmit={() => { showNotice('Your gig is pinned to the board.'); navigate('browse') }} />}
      {view === 'orders' && <OrdersPage tab={orderTab} setTab={setOrderTab} onOpen={() => navigate('order')} />}
      {view === 'order' && <OrderPage onBack={() => navigate('orders')} onSend={() => showNotice('Message sent.')} />}
      {view === 'auth' && <AuthPage onSubmit={completeAuth} />}
    </div>
  </div>
}

export default App; 