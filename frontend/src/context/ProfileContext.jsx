import React, { createContext, useState } from 'react';

// Create a context with default value
const ProfileContext = createContext({
  profile: {},
  setProfile: () => {}
});

// Create a provider component
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({});

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
