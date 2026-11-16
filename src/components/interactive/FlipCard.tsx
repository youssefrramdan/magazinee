import { useState } from 'react'
import { EyeOff, Fingerprint, KeyRound, Lock, MessageCircle, MessagesSquare, Radio, ScanFace, UserMinus } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useReading } from '../pages/context'

const icons = [MessageCircle, MessagesSquare, Lock, Radio, UserMinus, Fingerprint, ScanFace, EyeOff, KeyRound]

export function FlipCards() {
  const { copy } = useLang()
  const { progress, update, react } = useReading()
  const [open, setOpen] = useState<number | null>(null)
  return <>
    <div className="type-grid">{copy.types.map(([name], i) => {
      const Icon = icons[i]
      return <button className="type-card" key={name} aria-expanded={open === i} onClick={() => {
        setOpen(open === i ? null : i)
        if (!progress.discovered.includes(i)) {
          const discovered = [...progress.discovered, i]
          update({ discovered })
          react(discovered.length === copy.types.length ? 'cheer' : 'happy')
        }
      }}><Icon size={19}/><b>{name}</b><small>{progress.discovered.includes(i) ? '✓' : copy.tap}</small></button>
    })}</div>
    {open !== null && <div className="card-detail" role="status"><b>{copy.types[open][0]}</b><span>{copy.types[open][1]}</span><em>{copy.types[open][2]}</em></div>}
    <p className="counter">{copy.discovered.replace('{x}', String(progress.discovered.length)).replace('{n}', String(copy.types.length))}</p>
  </>
}
