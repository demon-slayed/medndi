import React from 'react'
import Header from '../../components/Layout/Header'
import SearchBar from './Components/SearchBar'
import TreatmentCards from './Components/TreatmentCards'
import Footer from '../../components/Layout/Footer'
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