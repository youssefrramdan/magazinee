import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../hooks/useLang'
import { useReading } from '../pages/context'

export function Quiz() {
  const { copy, lang } = useLang()
  const { progress, update, react } = useReading()
  const [index, setIndex] = useState(0)
  const [prompt, correct, reason, choices] = copy.quiz[index]
  const answer = progress.quiz[index]
  return <section className="activity quiz">
    <h3>{copy.activity[1]}</h3>
    <motion.div className="prompt" key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => {
      if (Math.abs(info.offset.x) > 35) setIndex((index + ((info.offset.x > 0) === (lang === 'en') ? -1 : 1) + copy.quiz.length) % copy.quiz.length)
    }}>{prompt}</motion.div>
    <div className="choices">{(choices as string[]).map((label, i) => <button aria-pressed={answer === i} key={label} onClick={() => {
      update({ quiz: { ...progress.quiz, [index]: i } })
      react(i === correct ? 'happy' : 'thinking')
    }}>{label}</button>)}</div>
    {answer !== undefined && <p className="feedback" role="status"><b>{answer === correct ? copy.correct : copy.incorrect}</b> {reason}</p>}
    <div className="mini-nav">{copy.quiz.map((_, i) => <button key={i} aria-current={i === index ? 'step' : undefined} onClick={() => setIndex(i)}>{(i + 1).toLocaleString(lang)}</button>)}</div>
  </section>
}
