import React from 'react'
import TreatmentCards from './Components/TreatmentCards'
import Layout from '@/components/Layout/Layout'

const SearchResults = () => {
  return (
    <div>
        <Layout>
        <div className='mt-28'></div>
        
        <TreatmentCards />
        
        </Layout>
    </div>
  )
}

export default SearchResults