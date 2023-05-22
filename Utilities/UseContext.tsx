import React from 'react';

type AuthContextType = {
  toggleTheme: () => void;
};

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);
