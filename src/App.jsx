import './App.css'
import LandingPage from './pages/LandingPage'
import Register from './pages/register'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResults from './pages/SearchResults'
import Login from './pages/login';
import TreatmentHospital from './pages/TreatmentHospital';
import HospitalDetails from './pages/HospitalDetails';
import MedicalBooking from './pages/MedicalBooking/MedicalBooking';
import Hospitals from './pages/Hospitals';
import AboutUs from './pages/AboutUs';
import ContactPage from './pages/Contact';
import PatientDashboard from './pages/Patients';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import HospitalTreatments from './pages/HospitalTreatments';
import PdfAnalyzer from './pages/Patients/components/PdfAnalyser';


function App() {


  return (
    <>
      <Router>
      <ScrollToTop />
          <Routes>
          <Route path='/' element={<LandingPage />}/>
              <Route path='/treatments' element={<SearchResults />} />  {/*done */}
              <Route path='/register' element={<Register />} />      {/*done */}
              <Route path='/login' element={<Login />} />             {/*done */}
              <Route path='/treatment-details/:treatment_id' element={<TreatmentHospital />} />  {/*done */}
              <Route path='/hospitals' element={<Hospitals />} />        {/*done */}
              <Route path='/hospital-details/:hospital_id' element={<HospitalDetails />} />
              <Route path='/hospital/:hospital_id/treatments' element={<HospitalTreatments />} />
              <Route path='/admin-dashboard' element={<AdminDashboard />} />
              <Route path='/patient' element={<PatientDashboard />} />
              <Route path='/patient/query' element={<PdfAnalyzer />} />
              <Route path='/booking' element={<MedicalBooking />} />
              <Route path='/about' element={<AboutUs />} />
              <Route path='/contact' element={<ContactPage />} />
          </Routes>
      </Router>             
    </>
  )
}

export default App
