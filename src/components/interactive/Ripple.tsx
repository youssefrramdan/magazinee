import { MessageCircle } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useReading } from '../pages/context'

export function Ripple() {
  const { copy } = useLang()
  const { progress, update, react } = useReading()
  const done = progress.ripple >= copy.effects.length
  return <section className="activity ripple">
    <div className="ripple-graphic">
      {copy.effects.slice(0, progress.ripple).map(([name], i) => <span key={name} className="ripple-ring" style={{ width: 63 + i * 24, height: 63 + i * 24 }}/>)}
      <button aria-label={copy.rippleButton} disabled={done} onClick={() => { update({ ripple: progress.ripple + 1 }); react('shield') }}><MessageCircle size={24}/></button>
    </div>
    <p className="counter">{copy.activity[3]} · {done ? copy.rippleDone : copy.rippleButton}</p>
    <dl aria-live="polite">{copy.effects.slice(0, progress.ripple).map(([name, effect]) => <div key={name}><dt>{name}</dt><dd>{effect}</dd></div>)}</dl>
    <aside>{copy.adult} <small>{copy.helpline}</small></aside>
  </section>
}
