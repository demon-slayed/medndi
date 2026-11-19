import React, { createContext, useState } from 'react';

const HospitalInfoContext = createContext();

const HospitalInfoProvider = ({ children }) => {
  const [hospital, setHospital] = useState([]); // Store an array of hospitals

  return (
    <HospitalInfoContext.Provider value={{ hospital, setHospital }}>
      {children}
    </HospitalInfoContext.Provider>
  );
};

export { HospitalInfoProvider, HospitalInfoContext };
