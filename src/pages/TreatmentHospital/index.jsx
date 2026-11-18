import React from 'react'
import Header from '../../components/Layout/Header'
import TreatmentInfo from './components/TreatmentIfo'
import Overview from './components/Overview'
import MedicalCardCenter from './components/MedicalCardCenter'
import Footer from '../../components/Layout/Footer'
import Layout from '@/components/Layout/Layout'


const  TreatmentHospital = () => {
  return (
    <div>
        <Layout>
        <div className='mt-28'>

        </div>
        <TreatmentInfo/>

        <MedicalCardCenter />
        </Layout>
    </div>
  )
}

export default TreatmentHospital