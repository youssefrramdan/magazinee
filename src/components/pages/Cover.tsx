import { ArrowRight, Heart, Laptop, List, ShieldCheck, Smartphone, Sparkles, Star, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import { Mascot } from '../mascot/Mascot'
import { useLang } from '../../hooks/useLang'
import { useReading } from './context'

export function Cover() {
  const { copy } = useLang()
  const { go, react } = useReading()
  return <div className="cover">
    <div className="cover-meta"><span>{copy.coverLabel}</span><button className="cover-contents" onClick={() => go(1)}><List size={16}/>{copy.index}</button></div>
    <div className="cover-copy">
      <motion.h1 initial={{ opacity: 0, y: 13 }} animate={{ opacity: 1, y: 0 }}><span>{copy.coverTitle[0]}</span><strong>{copy.coverTitle[1]}</strong></motion.h1>
      <div className="cover-subtitle">{copy.brand}</div>
      <p>{copy.intros[0]}</p>
      <button className="primary cover-start" onClick={() => go(1)}>{copy.open}<ArrowRight size={17}/></button>
    </div>
    <div className="cover-art" aria-hidden="true">
      <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/>
      <div className="sticker phone"><Smartphone /></div><div className="sticker laptop"><Laptop /></div>
      <div className="sticker heart"><Heart fill="currentColor"/></div><div className="sticker shield"><ShieldCheck /></div>
      <Sparkles className="spark spark-one"/><Star className="spark spark-two"/><Wifi className="spark spark-three"/>
    </div>
    <Mascot key={copy.brand} large size={300} line={copy.moods[0]} onTap={() => react()}/>
    <div className="cover-foot"><b>{copy.tagline}</b><span>{copy.coverStart}</span></div>
  </div>
}

