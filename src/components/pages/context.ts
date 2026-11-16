import { createContext, useContext } from 'react'
import { initialProgress, type Progress } from '../../hooks/useProgress'
import type { Mood } from '../mascot/Mascot'

export const ReadingContext = createContext({
  openContents: () => {},
  index: 0,
  companion: -1,
  reaction: undefined as Mood | undefined,
  reactionPage: 0,
  celebration: 0,
  revision: 0,
  progress: initialProgress,
  update: (_patch: Partial<Progress>) => { void _patch },
  go: (_index: number) => { void _index },
  react: (_mood?: Mood, _page?: number) => { void _mood; void _page },
})
export const useReading = () => useContext(ReadingContext)
