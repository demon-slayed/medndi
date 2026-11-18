import React, { createContext, useState } from 'react';

const AuthInfoContext = createContext();

const AuthInfoProvider = ({ children }) => {
  const [auth, setAuth] = useState([]); // Store an array of hospitals

  return (
    <AuthInfoContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthInfoContext.Provider>
  );
};

export { AuthInfoProvider, AuthInfoContext };
