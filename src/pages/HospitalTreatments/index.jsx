import React from 'react'
import Layout from '@/components/Layout/Layout'
import TreatmentCards from './components/TreatmentCards'

const HospitalTreatments = () => {
  return (
    <div>
        <Layout>
        <div className='mt-28'></div>
        
        <TreatmentCards />
        
        </Layout>
    </div>
  )
}

export default HospitalTreatments