import { useState } from 'react'
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useReading } from '../pages/context'

export function SortSteps() {
  const { copy } = useLang()
  const { progress, update, react } = useReading()
  const [order, setOrder] = useState(progress.sorted ? [0, 1, 2, 3] : [2, 0, 3, 1])
  const [tried, setTried] = useState(false)
  const [drag, setDrag] = useState<number | null>(null)
  function move(from: number, to: number) {
    const next = [...order]
    next.splice(to, 0, next.splice(from, 1)[0])
    setOrder(next)
    setTried(false)
  }
  const correct = order.every((step, i) => step === i)
  return <section className="activity sort">
    <h3>{copy.activity[4]}</h3>
    <ol>{order.map((id, i) => <li key={id} draggable onDragStart={event => { event.dataTransfer.setData('text/plain', String(i)); setDrag(i) }} onDragEnd={() => setDrag(null)} onDragOver={event => { if (drag !== null) event.preventDefault() }} onDrop={event => {
      event.preventDefault()
      if (drag !== null) move(drag, i)
      setDrag(null)
    }}>
      <GripVertical size={16}/><span>{copy.steps[id]}</span>
      <button aria-label={copy.moveUp + ' · ' + copy.steps[id]} disabled={i === 0} onClick={() => move(i, i - 1)}><ChevronUp size={16}/></button>
      <button aria-label={copy.moveDown + ' · ' + copy.steps[id]} disabled={i === order.length - 1} onClick={() => move(i, i + 1)}><ChevronDown size={16}/></button>
    </li>)}</ol>
    <button className="primary" onClick={() => { setTried(true); if (correct) update({ sorted: true }); react(correct ? 'cheer' : 'thinking') }}>{copy.check}</button>
    {tried && <p role="status">{correct ? copy.sorted : copy.again}</p>}
  </section>
}
