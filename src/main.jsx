import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ParticlesBg from 'particles-bg'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <>
        <div>...</div>
        <ParticlesBg num={50} type="square" bg={true} />
      </>
  </StrictMode>,
)
