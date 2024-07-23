'use client';
import React from 'react';

export const defaultUserValues: any = undefined;

const UserContext = React.createContext<any>(defaultUserValues);

export const UserProvider = ({ children, data }: { children?: React.ReactNode; data: typeof defaultUserValues }) => (
  <UserContext.Provider value={data}>{children}</UserContext.Provider>
);

export default UserContext;
