import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Field, PageShell } from '../components/PageShell'

type AuthPageProps = { onSubmit: () => void }

export function AuthPage({ onSubmit }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)

  return <PageShell eyebrow="07 · Welcome back" title={mode === 'login' ? 'Good work starts here.' : 'Make your mark on the board.'} description={mode === 'login' ? 'Sign in to pick up where you left off.' : 'Post gigs, request one, and build a reputation around useful work.'}>
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-board-alt shadow-2xl md:grid-cols-[.85fr_1.15fr]">
      <div className="relative hidden overflow-hidden bg-coral p-8 text-board md:flex md:flex-col md:justify-between"><span className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[22px] border-board/10" /><span className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full border-[24px] border-board/10" /><div className="relative"><div className="mb-12 flex items-center gap-2.5"><span className="h-3.5 w-3.5 rounded-full bg-board" /><span className="font-display text-lg font-bold tracking-tight">GigBoard</span></div><p className="font-mono text-[11px] uppercase tracking-[.18em]">A useful community</p><h2 className="mt-4 max-w-xs font-display text-3xl font-bold leading-tight">Small skills. Real momentum.</h2></div><p className="relative max-w-xs text-sm leading-6 text-board/70">Find the person who can help, or become the person someone else is looking for.</p></div>
      <form onSubmit={(event) => { event.preventDefault(); onSubmit() }} className="p-6 sm:p-9">
        <div className="mb-8 flex rounded-lg bg-board p-1 text-xs font-semibold"><button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-md px-3 py-2.5 transition ${mode === 'login' ? 'bg-paper text-board' : 'text-white/50 hover:text-paper'}`}>Sign in</button><button type="button" onClick={() => setMode('signup')} className={`flex-1 rounded-md px-3 py-2.5 transition ${mode === 'signup' ? 'bg-paper text-board' : 'text-white/50 hover:text-paper'}`}>Create account</button></div>
        {mode === 'signup' && <Field label="Name"><input required placeholder="Your full name" /></Field>}
        <Field label="School / community email"><input required type="email" placeholder="you@atiba.edu.ng" /></Field>
        <label className="mb-4 block text-xs font-semibold text-paper"><span className="mb-2 block">Password</span><span className="flex items-center rounded-lg border border-white/10 bg-board px-3 focus-within:border-coral/70"><input required minLength={6} type={showPassword ? 'text' : 'password'} placeholder={mode === 'login' ? 'Enter your password' : 'At least 6 characters'} className="w-full bg-transparent py-3 text-sm text-paper outline-none placeholder:text-white/30" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="p-1 text-white/45 hover:text-paper" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
        <div className="mb-6 flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-white/55"><input type="checkbox" className="accent-coral" /> Remember me</label>{mode === 'login' && <button type="button" className="font-semibold text-coral">Forgot password?</button>}</div>
        <button className="flex w-full items-center justify-center rounded-lg bg-coral px-4 py-3 text-sm font-semibold text-board transition hover:bg-[#e1493a]">{mode === 'login' ? 'Sign in to GigBoard' : 'Create my account'}</button>
        <p className="mt-6 text-center text-xs text-white/40">{mode === 'login' ? 'New to the board?' : 'Already have an account?'} <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-semibold text-coral">{mode === 'login' ? 'Create an account' : 'Sign in instead'}</button></p>
      </form>
    </div>
  </PageShell>
}
