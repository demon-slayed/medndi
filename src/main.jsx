import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TreatmentProvider } from './context/TreatmentInfo'
import { HospitalInfoProvider } from './context/HospitalInfo'
import { AuthInfoProvider } from './context/AuthInfo'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Toaster />
  <AuthInfoProvider>
      <App />
    </AuthInfoProvider>
  </StrictMode>

)
