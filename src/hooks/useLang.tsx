import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import en from '../content/magazine.en.json'
import ar from '../content/magazine.ar.json'

export type Content = typeof en
const editions = { en, ar } satisfies Record<string, Content>
type Language = keyof typeof editions
const LangContext = createContext({ lang: 'en' as Language, toggle: () => {}, copy: en })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => localStorage.getItem('bts-language') === 'ar' ? 'ar' : 'en')
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = editions[lang].brand
    localStorage.setItem('bts-language', lang)
  }, [lang])
  return <LangContext.Provider value={{ lang, copy: editions[lang], toggle: () => setLang(lang === 'en' ? 'ar' : 'en') }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
