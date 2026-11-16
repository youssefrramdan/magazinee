import { useEffect, useState } from 'react'

export const initialProgress = {
  discovered: [] as number[],
  quiz: {} as Record<number, number>,
  ripple: 0,
  sorted: false,
  wall: [] as string[],
  scenarios: {} as Record<number, number>,
  pledge: false,
}
export type Progress = typeof initialProgress

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bts-progress') ?? '{}')
      return { ...initialProgress, ...saved, quiz: saved.quizVersion === 2 ? saved.quiz : initialProgress.quiz }
    }
    catch { return initialProgress }
  })
  useEffect(() => { localStorage.setItem('bts-progress', JSON.stringify({ ...progress, quizVersion: 2 })) }, [progress])
  return { progress, setProgress }
}
