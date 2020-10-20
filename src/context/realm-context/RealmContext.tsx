import React, { useState, useContext } from "react";
import { WhoAmIContext } from "../../context/whoami/WhoAmI";

export const RealmContext = React.createContext({
  realm: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRealm: (realm: string) => {}
});

type RealmContextProviderProps = { children: React.ReactNode };

export const RealmContextProvider = ({
  children
}: RealmContextProviderProps) => {
  const homeRealm = useContext(WhoAmIContext).getHomeRealm();
  const [realm, setRealm] = useState(homeRealm);

  return (
    <RealmContext.Provider value={{ realm, setRealm }}>
      {children}
    </RealmContext.Provider>
  );
};
