import { List, Maximize, Volume2, VolumeX } from 'lucide-react'
import schoolLogo from '../../assets/ej-school-shebin-el-kom.jpg'
import { useLang } from '../../hooks/useLang'

export function Toolbar({ muted, toggleSound, contents, fullscreen }: { muted: boolean; toggleSound: () => void; contents: () => void; fullscreen: () => void }) {
  const { lang, toggle, copy } = useLang()
  const Sound = muted ? VolumeX : Volume2
  return <header className="toolbar">
    <div className="brand"><div className="brand-mark"><img src={schoolLogo} alt="" width={469} height={332}/></div><div><strong>{copy.brand}</strong><small>{copy.edition}</small></div></div>
    <nav className="tools">
      <button className="contents-button" onClick={contents} aria-label={copy.index}><List size={18}/><span>{copy.index}</span></button>
      <button className="language" onClick={toggle} lang={lang === 'en' ? 'ar' : 'en'}>{lang === 'en' ? 'العربية' : 'English'}</button>
      <button className="icon-button" onClick={toggleSound} aria-label={muted ? copy.soundOff : copy.soundOn} title={muted ? copy.soundOff : copy.soundOn}><Sound size={18}/></button>
      <button className="icon-button fullscreen" onClick={fullscreen} aria-label={copy.fullscreen} title={copy.fullscreen}><Maximize size={17}/></button>
    </nav>
  </header>
}
