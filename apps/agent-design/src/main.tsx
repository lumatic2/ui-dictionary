import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { appModeFromSearch } from './benchmark'
import './editorTokens.css'
import './styles.css'

const mode = appModeFromSearch(window.location.search)

createRoot(document.getElementById('root')!).render(<StrictMode><App mode={mode} /></StrictMode>)
