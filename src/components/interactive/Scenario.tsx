import { useState } from 'react'
import { useLang } from '../../hooks/useLang'
import { useReading } from '../pages/context'

export function Scenario() {
  const { copy } = useLang()
  const { progress, update, react } = useReading()
  const [index, setIndex] = useState(0)
  const item = copy.scenarios[index]
  const choice = progress.scenarios[index]
  const score = copy.scenarios.filter((scenario, i) => progress.scenarios[i] === scenario.good).length
  return <section className="activity scenario">
    <h3>{copy.activity[7]}</h3>
    <p className="prompt">{item.prompt}</p>
    <div className="choices">{item.options.map(([label], i) => <button key={label} aria-pressed={choice === i} onClick={() => {
      update({ scenarios: { ...progress.scenarios, [index]: i } })
      react(i === item.good ? 'happy' : 'thinking')
    }}>{label}</button>)}</div>
    {choice !== undefined && <p className="feedback" role="status">{item.options[choice][1]}</p>}
    <div className="mini-nav">{copy.scenarios.map((_, i) => <button key={i} aria-current={i === index ? 'step' : undefined} onClick={() => setIndex(i)}>{(i + 1).toLocaleString()}</button>)}</div>
    <p className="counter">{copy.score.replace('{x}', String(score)).replace('{n}', String(copy.scenarios.length))}</p>
  </section>
}
