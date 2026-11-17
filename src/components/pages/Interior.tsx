import { BookOpen, GraduationCap, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import portrait from '../../assets/dr-thanaa.jpg'
import schoolLogo from '../../assets/ej-school-shebin-el-kom.jpg'
import { useLang } from '../../hooks/useLang'
import { Mascot, type Mood } from '../mascot/Mascot'
import { useReading } from './context'

const moods: Mood[] = ['thinking', 'thinking', 'sad', 'shield', 'thinking', 'happy', 'shield', 'cheer', 'wave']

function Credits() {
  const { copy } = useLang()
  const { go } = useReading()
  return <div className="closing-credits">
    <section className="closing-team">
      <h3><BookOpen size={17}/>{copy.credits[0]?.role}</h3>
      <ul>{copy.credits.map(({ name }) => <li key={name}>{name}</li>)}</ul>
    </section>
    <section className="closing-supervision">
      <h3><GraduationCap size={19}/>{copy.supervisor.label}</h3>
      <ul>{copy.supervisor.names.map(name => <li key={name}>{name}</li>)}</ul>
    </section>
    <div className="credits-actions"><p className="credit-meta">{copy.school}</p><button className="primary" onClick={() => go(0)}><RotateCcw size={16}/>{copy.readAgain}</button></div>
  </div>
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
  const isBackCover = index === copy.titles.length - 1
  return <article className={'interior editorial-page interior-' + index + (isBackCover ? ' back-cover' : index === 9 || index === 10 ? ' featured-spread' : '') + (active ? ' active' : '')}>
    <div className="editorial-frame" ref={frameRef}><div className="editorial-content" ref={contentRef}>
      {isBackCover && <img className="school-watermark" src={schoolLogo} alt="" aria-hidden="true" width={469} height={332}/>}
      <div className="page-kicker"><Sparkles size={15}/>{copy.issue}{isBackCover && <img className="school-logo" src={schoolLogo} alt={copy.school} width={469} height={332}/>}<span>{number}</span></div>
      {isBackCover ? <header className="closing-hero">
        <span className="closing-seal"><ShieldCheck size={28}/></span>
        <div><h2>{copy.tagline}</h2><p>{copy.intros[index]}</p></div>
      </header> : <>
        <h2>{copy.titles[index]}</h2>
        {copy.intros[index] && <p className="intro">{copy.intros[index]}</p>}
      </>}
      {index === 9 && <figure className="featured-person"><img src={portrait} alt="" width={768} height={1344}/><figcaption>{copy.featuredPerson}</figcaption></figure>}
      {index === 1 && <ContentsPage/>}
      {section.blocks.length > 0 && <div className="editorial-blocks">{section.blocks.map(({ heading, body }, i) => <section key={heading}>
        <h3>{heading}</h3><p>{body}</p>
        {index === 10 && copy.featuredSources[i] && <a className="profile-source" href={copy.featuredSources[i].url} target="_blank" rel="noreferrer">{copy.featuredSources[i].label}</a>}
      </section>)}</div>}
      {isBackCover && <Credits/>}
    </div></div>
    <Mascot size={88} mood={mood ?? (index === copy.titles.length - 1 ? 'wave' : moods[index - 1])} line={copy.moods[index]} onTap={() => react()}/>
    <div className="interior-footer"><b>{copy.tagline}</b><span>{number}</span></div>
  </article>
}
