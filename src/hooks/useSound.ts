import { useRef, useState } from 'react'
import { Howl } from 'howler'
type Cue = 'flip' | 'pop' | 'success'

// Generate brief, quiet tones locally so the magazine needs no audio downloads.
function tone(cue: Cue) {
  const rate = 8000
  const length = cue === 'success' ? 2400 : 840
  const data = new Uint8Array(44 + length)
  const view = new DataView(data.buffer)
  const word = (offset: number, value: string) => [...value].forEach((char, i) => data[offset + i] = char.charCodeAt(0))
  word(0, 'RIFF'); view.setUint32(4, 36 + length, true); word(8, 'WAVE')
  word(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true)
  view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate, true)
  view.setUint16(32, 1, true); view.setUint16(34, 8, true)
  word(36, 'data'); view.setUint32(40, length, true)
  for (let i = 0; i < length; i++) {
    const frequency = cue === 'flip' ? 180 : cue === 'pop' ? 480 : i < 1100 ? 520 : 660
    data[44 + i] = 128 + Math.sin(i * frequency * 2 * Math.PI / rate) * 32 * Math.sin(Math.PI * i / length)
  }
  return new Howl({ src: ['data:audio/wav;base64,' + btoa(String.fromCharCode(...data))], format: ['wav'], volume: 0.25 })
}

export function useSound() {
  const [muted, setMuted] = useState(true)
  const isMuted = useRef(true)
  const sounds = useRef<Partial<Record<Cue, Howl>>>({})
  return {
    muted,
    toggle: () => { isMuted.current = !isMuted.current; setMuted(isMuted.current) },
    play(cue: Cue) {
      if (!isMuted.current) (sounds.current[cue] ??= tone(cue)).play()
    },
  }
}
