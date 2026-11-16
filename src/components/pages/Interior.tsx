import { BookOpen, GraduationCap, RotateCcw, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../hooks/useLang'
import { Mascot, type Mood } from '../mascot/Mascot'
import { useReading } from './context'

const moods: Mood[] = ['thinking', 'thinking', 'sad', 'shield', 'thinking', 'happy', 'shield', 'cheer', 'wave']

function Credits() {
  const { copy } = useLang()
  const { go } = useReading()
  return <>
    <div className="credits">{copy.credits.map(({ name, role, avatar }, i) => <motion.div key={name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
      {avatar ? <img src={avatar} alt=""/> : <span><Star size={18}/></span>}<div><b>{name}</b><small>{role}</small></div>
    </motion.div>)}</div>
    <div className="supervisor-card">
      {copy.supervisor.avatar ? <img src={copy.supervisor.avatar} alt=""/> : <span className="supervisor-icon"><GraduationCap size={24}/></span>}
      <div><small>{copy.supervisor.label}</small><strong>{copy.supervisor.name}</strong></div>
    </div>
    <div className="credits-actions"><p className="credit-meta">{copy.school}</p><button className="primary" onClick={() => go(0)}><RotateCcw size={16}/>{copy.readAgain}</button></div>
  </>
}

function ContentsPage() {
  const { copy, lang } = useLang()
  const { go } = useReading()
  return <ol className="printed-contents">
    {copy.titles.map((title, page) => page === 1 ? null : <li key={title}>
      <button onClick={() => go(page)}><BookOpen size={16}/><span>{title}</span><b>{(page + 1).toLocaleString(lang)}</b></button>
    </li>)}
  </ol>
}

export function Interior({ index, active, mood }: { index: number; active: boolean; mood?: Mood }) {
  const { copy, lang } = useLang()
  const { react } = useReading()
  const section = copy.editorial[index - 1]
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!active) return
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return
    let disposed = false
    const fit = () => {
      if (disposed || !frame.clientHeight || !frame.clientWidth) return
      content.style.zoom = '1'
      const available = frame.clientHeight - 2
      if (content.offsetHeight > available) content.style.zoom = String(Math.min(1, Math.max(1, available) / content.offsetHeight))
    }
    const resize = new ResizeObserver(fit)
    resize.observe(frame)
    fit()
    void document.fonts.ready.then(fit)
    return () => { disposed = true; resize.disconnect() }
  }, [active, index, lang])

  const number = (index + 1).toLocaleString(lang).padStart(2, lang === 'ar' ? '٠' : '0')
  return <article className={'interior editorial-page interior-' + index + (index === 9 ? ' back-cover' : '') + (active ? ' active' : '')}>
    <div className="editorial-frame" ref={frameRef}><div className="editorial-content" ref={contentRef}>
      <div className="page-kicker"><Sparkles size={15}/>{copy.issue}<span>{number}</span></div>
      <h2>{copy.titles[index]}</h2>
      <p className="intro">{copy.intros[index]}</p>
      {index === 1 && <ContentsPage/>}
      {section.blocks.length > 0 && <div className="editorial-blocks">{section.blocks.map(({ heading, body }) => <section key={heading}>
        <h3>{heading}</h3><p>{body}</p>
      </section>)}</div>}
      {index === 9 && <><ShieldCheck className="back-cover-seal" size={42}/><Credits/></>}
    </div></div>
    <Mascot size={index === 7 ? 126 : 88} mood={mood ?? moods[index - 1]} line={copy.moods[index]} onTap={() => react()}/>
    <div className="interior-footer"><b>{copy.tagline}</b><span>{number}</span></div>
  </article>
}
