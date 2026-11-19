import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react'

const TreatmentInfoContext = createContext();

const TreatmentProvider = ({children}) => {

  const [treatment, setTreatment] = useState([]);
    
  return (
    <TreatmentInfoContext.Provider value={{treatment, setTreatment}}>
            {children}
    </TreatmentInfoContext.Provider>
  )
}

export  {TreatmentProvider, TreatmentInfoContext}