import { useState } from 'react'
import { CircleHelp, MessageCircle, PauseCircle, Send } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useReading } from '../pages/context'

export function ThinkMeter() {
  const { copy } = useLang()
  const { react } = useReading()
  const [value, setValue] = useState('')
  const [checks, setChecks] = useState<number[]>([])
  function needsPause(message: string) {
    const clean = message.trim()
    return copy.flags.some(word => clean.toLowerCase().includes(word)) ||
      (clean.length > 6 && clean === clean.toUpperCase() && clean !== clean.toLowerCase())
  }
  const normalized = value.trim()
  const flag = needsPause(value)
  function change(next: string) {
    setValue(next)
    setChecks([])
    const nextFlag = needsPause(next)
    if (nextFlag !== flag || Boolean(next.trim()) !== Boolean(normalized)) react(!next.trim() ? undefined : nextFlag ? 'thinking' : 'happy')
  }
  return <section className="activity meter">
    <h3><MessageCircle size={18}/>{copy.activity[5]}</h3>
    <label className="chat-input"><input aria-label={copy.tryMessage} placeholder={copy.tryMessage} value={value} maxLength={180} onChange={event => change(event.target.value)}/><Send size={18}/></label>
    <div className="chips">{copy.examples.map(example => <button key={example} onClick={() => change(example)}>{example}</button>)}</div>
    <div className={'meter-result' + (flag ? ' flagged' : '')} role="status">{flag ? <PauseCircle size={16}/> : <CircleHelp size={16}/>} {flag ? copy.meterPause : normalized ? copy.meterSafe : copy.meterEmpty}</div>
    <div className="checklist">{copy.checks.map((check, i) => <label key={check} className={checks.includes(i) ? 'checked' : ''}><input type="checkbox" disabled={!normalized} checked={checks.includes(i)} onChange={() => {
      setChecks(checks.includes(i) ? checks.filter(index => index !== i) : [...checks, i])
      if (checks.length === 3 && !checks.includes(i)) react('cheer')
    }}/>{check}</label>)}</div>
  </section>
}
