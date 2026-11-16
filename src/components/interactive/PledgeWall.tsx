import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useReading } from '../pages/context'

export function KindnessWall() {
  const { copy } = useLang()
  const { progress, update, react } = useReading()
  const [message, setMessage] = useState('')
  function post(value: string) {
    const clean = value.trim()
    if (!clean) return
    update({ wall: [clean, ...progress.wall].slice(0, 12) })
    setMessage('')
    react('happy')
  }
  return <section className="activity kindness">
    <h3><Heart size={18}/>{copy.activity[6]}</h3>
    <div className="heart-wall" aria-live="polite">{[...progress.wall, ...copy.wall].map((entry, i) => <motion.span key={i + entry} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Heart size={13} fill="currentColor"/><b>{entry}</b></motion.span>)}</div>
    <div className="chips">{copy.wall.map(entry => <button key={entry} onClick={() => post(entry)}>{entry}</button>)}</div>
    <form onSubmit={event => { event.preventDefault(); post(message) }}><input aria-label={copy.placeholder} placeholder={copy.placeholder} value={message} maxLength={100} onChange={event => setMessage(event.target.value)}/><button className="primary" disabled={!message.trim()}>{copy.add}</button></form>
  </section>
}

export function Pledge() {
  const { copy } = useLang()
  const { progress, update, react } = useReading()
  const [checks, setChecks] = useState<number[]>([])
  return <section className="activity pledge">
    <h3><Heart size={18}/>{copy.activity[8]}</h3>
    <div className="checklist">{copy.pledges.map((text, i) => <label className={progress.pledge || checks.includes(i) ? 'checked' : ''} key={text}>
      <input type="checkbox" checked={progress.pledge || checks.includes(i)} disabled={progress.pledge} onChange={() => setChecks(checks.includes(i) ? checks.filter(check => check !== i) : [...checks, i])}/>{text}
    </label>)}</div>
    <button className="primary" disabled={progress.pledge || checks.length !== copy.pledges.length} onClick={() => { update({ pledge: true }); react('cheer') }}>{progress.pledge ? copy.signed : copy.sign}</button>
  </section>
}
