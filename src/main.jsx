import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { getCalm } from './components/fx'

document.documentElement.classList.toggle('calm', getCalm())
createRoot(document.getElementById('root')).render(<App />)
