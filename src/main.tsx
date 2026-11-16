import { createRoot } from 'react-dom/client'
import { LangProvider } from './hooks/useLang'
import { Magazine } from './components/Magazine'
import './styles/magazine.css'

createRoot(document.getElementById('root')!).render(<LangProvider><Magazine /></LangProvider>)
