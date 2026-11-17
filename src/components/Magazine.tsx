import { forwardRef, useEffect, useRef, useState } from 'react'
import { BookOpen, Minimize, Sparkles, X } from 'lucide-react'
import { MotionConfig, useReducedMotion } from 'framer-motion'
import schoolLogo from '../assets/ej-school-shebin-el-kom.jpg'
import HTMLFlipBook from 'react-pageflip'
import { useLang } from '../hooks/useLang'
import { useProgress } from '../hooks/useProgress'
import { useSound } from '../hooks/useSound'
import { Cover } from './pages/Cover'
import { Interior } from './pages/Interior'
import { ReadingContext, useReading } from './pages/context'
import { Toolbar } from './ui/Toolbar'
import { PageDots } from './ui/PageDots'
import type { Mood } from './mascot/Mascot'

type Reader = { pageFlip: () => { flip: (page: number) => void; turnToPage: (page: number) => void; flipNext: () => void; flipPrev: () => void; getCurrentPageIndex: () => number; getState: () => string } }
const Sheet = forwardRef<HTMLDivElement, { page: number; rtl: boolean }>(function Sheet({ page, rtl }, ref) {
  const reading = useReading()
  const { index, companion, reaction, reactionPage, revision } = reading
  const body = useRef<HTMLDivElement>(null)
  const visible = page === index || page === companion
  useEffect(() => {
    const element = body.current
    // StPageFlip listens above the sheet and only exempts direct button targets.
    function protectControls(event: Event) {
      if (event.target instanceof Element && event.target.closest('button,input,label,form,[draggable],.prompt')) event.stopPropagation()
    }
    element?.addEventListener('mousedown', protectControls)
    element?.addEventListener('touchstart', protectControls)
    return () => {
      element?.removeEventListener('mousedown', protectControls)
      element?.removeEventListener('touchstart', protectControls)
    }
  }, [])
  return <div ref={ref} className="sheet" dir={rtl ? 'rtl' : 'ltr'}><div ref={body} className="sheet-body" inert={!visible}>
    <ReadingContext.Provider value={{ ...reading, react: mood => reading.react(mood, page) }}>
      {page === 0 ? <Cover key={revision}/> : <Interior key={revision} index={page} active={visible} mood={page === reactionPage ? reaction : undefined}/>}
    </ReadingContext.Provider>
  </div></div>
})

export function Magazine() {
  const { copy, lang } = useLang()
  const { progress, setProgress } = useProgress()
  const { muted, toggle, play } = useSound()
  const book = useRef<Reader | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const revision = 0
  const [reactionPage, setReactionPage] = useState(0)
  const [reaction, setReaction] = useState<Mood>()
  const [celebration, setCelebration] = useState(0)
  const [narrow, setNarrow] = useState(() => window.innerWidth < 860)
  const reduced = useReducedMotion()
  const rtl = lang === 'ar'
  const total = copy.titles.length
  const physical = (page: number) => rtl ? total - 1 - page : page
  const spread = !narrow && index > 0 && index < total - 1
  const companion = spread ? (index % 2 === 1 ? index + 1 : index - 1) : -1
  const pages = Array.from({ length: total }, (_, i) => physical(i))
  function go(target: number) {
    const engine = book.current?.pageFlip()
    if (!engine || engine.getState() === 'flipping' || engine.getState() === 'user_fold') return
    if (reduced) engine.turnToPage(physical(target))
    else engine.flip(physical(target))
    setIndex(target)
  }
  function step(direction: number) {
    const edge = direction < 0 ? Math.min(index, companion < 0 ? index : companion) : Math.max(index, companion)
    const target = Math.min(total - 1, Math.max(0, edge + direction))
    if (target === index) return
    const engine = book.current?.pageFlip()
    if (!engine || engine.getState() === 'flipping' || engine.getState() === 'user_fold') return
    if (reduced) engine.turnToPage(physical(target))
    else if (rtl ? direction < 0 : direction > 0) engine.flipNext()
    else engine.flipPrev()
    setIndex(target)
  }
  useEffect(() => {
    const media = window.matchMedia('(max-width: 859px)')
    const resize = () => setNarrow(media.matches)
    media.addEventListener('change', resize)
    return () => media.removeEventListener('change', resize)
  }, [])
  useEffect(() => {
    function keys(event: KeyboardEvent) {
      if (dialog.current?.open || event.altKey || event.ctrlKey || (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable]'))) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        step((event.key === 'ArrowRight') !== rtl ? 1 : -1)
      }
    }
    window.addEventListener('keydown', keys)
    return () => window.removeEventListener('keydown', keys)
  })
  function openContents() {
    if (!dialog.current || dialog.current.open) return
    const bounds = stage.current?.getBoundingClientRect()
    if (bounds) {
      const top = Math.max(12, bounds.top + 14)
      const height = Math.min(bounds.bottom - top - 14, window.innerHeight - top - 12)
      if (height > 250) {
        dialog.current.style.setProperty('--contents-top', top + 'px')
        dialog.current.style.setProperty('--contents-height', height + 'px')
      } else {
        dialog.current.style.removeProperty('--contents-top')
        dialog.current.style.removeProperty('--contents-height')
      }
    }
    dialog.current.showModal()
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { /* Fullscreen can be unavailable in embedded and mobile browsers. */ }
  }
  return <MotionConfig reducedMotion="user"><ReadingContext.Provider value={{
    index, companion, reaction, reactionPage, celebration, revision, openContents,
    progress, update: patch => setProgress(previous => ({ ...previous, ...patch })), go,
    react: (mood, page = index) => {
      setReactionPage(page)
      setReaction(mood)
      play(mood === 'cheer' ? 'success' : 'pop')
      if (mood === 'cheer') setCelebration(previous => previous + 1)
      else setCelebration(0)
    },
  }}>
    <Toolbar muted={muted} toggleSound={toggle} contents={openContents} fullscreen={fullscreen}/>
    <main className="reading-room">
      <div className="room-kicker"><Sparkles size={16}/><span>{copy.shelf}</span><Sparkles size={16}/></div>
      <div ref={stage} className="book-stage" dir="ltr"> 
        {!narrow && index === 0 && <div aria-hidden="true" className={'cover-halo' + (rtl ? ' cover-halo-rtl' : '')}><Sparkles/><img src={schoolLogo} alt="" width={469} height={332}/><Sparkles/></div>}
        <div className="stage-deco stage-left"><BookOpen size={35}/></div><div className="stage-deco stage-right"><Sparkles size={42}/></div>
        <HTMLFlipBook key={lang + String(narrow)} ref={book} className={'book ' + (narrow ? 'book-mobile' : '')} style={{}}
          width={narrow ? 470 : 630} height={745} size="stretch" minWidth={narrow ? 400 : 1} maxWidth={narrow ? 500 : 780} minHeight={1} maxHeight={930}
          startPage={physical(index)} showCover usePortrait={narrow} drawShadow={!reduced} flippingTime={reduced ? 1 : 540} maxShadowOpacity={0.36}
          autoSize renderOnlyPageLengthChange showPageCorners={!reduced} mobileScrollSupport clickEventForward useMouseEvents swipeDistance={25} disableFlipByClick={false} startZIndex={0}
          onFlip={event => {
            const next = physical(Number(event.data))
            setIndex(current => {
              if (!narrow && current > 0 && current < total - 1 && next > 0 && next < total - 1 && Math.ceil(current / 2) === Math.ceil(next / 2)) return current
              return next
            })
            setReaction(undefined)
            setCelebration(0)
            play('flip')
          }}>
          {pages.map(page => <Sheet key={page} rtl={rtl} page={page}/>)}
        </HTMLFlipBook>
    <dialog ref={dialog} dir={rtl ? 'rtl' : 'ltr'} className="contents-dialog" aria-labelledby="contents-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <div className="contents-body"><span className="contents-issue">{copy.issue}</span><header><h2 id="contents-title">{copy.index}</h2><button className="icon-button" aria-label={copy.close} onClick={() => dialog.current?.close()}><X size={20}/></button></header>
      <ol>{copy.titles.map((title, i) => <li key={title}><button onClick={() => { go(i); dialog.current?.close() }} aria-current={i === index ? 'page' : undefined}><span>{(i + 1).toLocaleString(lang)}</span>{title}</button></li>)}</ol>
      </div>
    </dialog>
      </div>
      <button className="fullscreen-exit icon-button" aria-label={copy.exitFullscreen} title={copy.exitFullscreen} onClick={fullscreen}><Minimize size={18}/></button>
      <PageDots index={index} go={go} step={step} atStart={index === 0} atEnd={index === total - 1}/>
      <footer className="room-footer">{copy.footer}</footer>
    </main>

  </ReadingContext.Provider></MotionConfig>
}

