import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '../../hooks/useLang'

export type Mood = 'happy' | 'sad' | 'thinking' | 'shield' | 'cheer' | 'wave'
export function Mascot({ mood = 'happy', size = 124, line, large = false, onTap }: { mood?: Mood; size?: number; line: string; large?: boolean; onTap?: () => void }) {
  const { copy } = useLang()
  const [tip, setTip] = useState(-1)
  const reduced = useReducedMotion()
  const [moves, setMoves] = useState(0)
  const expression = mood
  return <div className={large ? 'mascot mascot-large' : 'mascot'}>
    <motion.button type="button" className="bot-button" aria-label={copy.tipLabel} whileTap={{ scale: 0.9 }} onClick={() => {
      setTip(previous => {
        const jump = 1 + Math.floor(Math.random() * Math.max(1, copy.tips.length - 1))
        return (previous + jump) % copy.tips.length
      })
      setMoves(previous => previous + 1)
      onTap?.()
    }}>
      <motion.span className="bot-motion" key={moves} initial={moves && !reduced ? { y: 0, rotate: 0 } : false} animate={moves && !reduced ? { y: [0, -4, 0], rotate: [0, -2, 0] } : undefined} transition={{ duration: .65 }}>
      <svg className={'bot bot-' + expression} width={size} height={size} viewBox="0 0 220 220" aria-hidden="true">
        <ellipse cx="110" cy="196" rx="64" ry="13" fill="#12255c" opacity=".15"/>
        <g className="bot-body" stroke="#102858" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M110 55V35" fill="none"/><circle cx="110" cy="27" r="10" fill="#ffcd61"/>
          <path className="bot-arm" d="M60 119Q34 116 25 92Q17 80 13 97Q13 126 54 139" fill="#82adff"/><path className="bot-arm bot-arm-right" d="M158 121Q181 115 188 93Q197 81 204 95Q205 125 165 142" fill="#82adff"/>
          <path className="bot-leg" d="M88 161L84 180Q69 181 69 189Q74 196 96 192L103 166Z" fill="#82adff"/><path className="bot-leg bot-leg-right" d="M120 167L127 190Q142 198 153 191Q155 183 140 181L137 163Z" fill="#82adff"/>
          <path d="M110 48Q149 55 172 72L168 121Q162 164 110 185Q58 164 51 121L48 72Q76 55 110 48Z" fill="#6298ff"/>
          <path d="M110 62Q139 68 157 80L154 114Q149 147 110 166Q71 147 66 114L63 80Q81 68 110 62Z" fill="#9cc4ff" stroke="none"/>
          <rect x="68" y="83" width="84" height="56" rx="24" fill="#142c60"/>
          <g className="bot-eyes" stroke="#d4efff" strokeWidth="5">
            {expression === 'sad' ? <path d="M86 105l10 3m28 0l10-3"/> : <path d="M91 103v8m38-8v8"/>}
          </g>
          <path d={expression === 'sad' ? 'M104 125q6-8 12 0' : expression === 'thinking' ? 'M106 122h8' : 'M103 120q7 10 14 0'} stroke="#d4efff" strokeWidth="3" fill="none"/>
          <path d="M78 118h6m52 0h6" stroke="#f89eb0" strokeWidth="4"/>
          {expression === 'cheer' && <path d="M111 165c-16-9-19-23-8-24 4 0 7 3 8 5 2-2 5-5 9-5 11 1 7 15-9 24z" fill="#ff8eaa" strokeWidth="3"/>}
        </g>
      </svg>
      </motion.span>
    </motion.button>
    <span className="speech" aria-live="polite">{tip < 0 ? line : copy.tips[tip]}</span>
  </div>
}
