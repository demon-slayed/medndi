import React from 'react'
import Hero from './components/Hero'
import Treatment from './components/Treatment'
import PopularHospitals from './components/PopularHospitals'
import OurPartners from './components/OurPartners'
import ChooseUs from './components/ChooseUs'
import ClientsReview from './components/ClientsReview'
import Layout from '@/components/Layout/Layout'

const LandingPage = () => {
  return (
    <div>
       <Layout>
        <div className='mt-28'></div>
        <Hero />
        <Treatment />
        <PopularHospitals />
        <OurPartners />
        <ChooseUs />
        <ClientsReview />
      </Layout>

    </div>
  )
}

export default LandingPage