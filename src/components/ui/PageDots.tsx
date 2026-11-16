import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLang } from '../../hooks/useLang'

export function PageDots({ index, go, step, atStart, atEnd }: { index: number; go: (index: number) => void; step: (direction: number) => void; atStart: boolean; atEnd: boolean }) {
  const { copy, lang } = useLang()
  const Previous = lang === 'en' ? ArrowLeft : ArrowRight
  const Next = lang === 'en' ? ArrowRight : ArrowLeft
  const position = copy.page.replace('{x}', (index + 1).toLocaleString(lang)).replace('{n}', copy.titles.length.toLocaleString(lang))
  return <div className="navigation">
    <button className="nav-arrow" onClick={() => step(-1)} disabled={atStart} aria-label={copy.prev}><Previous size={20}/></button>
    <div className="reading-status">
      <div className="dots">{copy.titles.map((title, i) => <button key={title} title={title} aria-label={title} aria-current={i === index ? 'page' : undefined} onClick={() => go(i)}/>)}</div>
      <div className="progress-track" role="progressbar" aria-label={position} aria-valuemin={1} aria-valuemax={copy.titles.length} aria-valuenow={index + 1}><span style={{ width: (index + 1) / copy.titles.length * 100 + '%' }}/></div>
      <span aria-live="polite">{position}</span>
    </div>
    <button className="nav-arrow" onClick={() => step(1)} disabled={atEnd} aria-label={copy.next}><Next size={20}/></button>
  </div>
}
