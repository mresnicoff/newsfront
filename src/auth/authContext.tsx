import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import axios from 'axios';
const MY_AUTH_APP = 'MY_AUTH_APP';
// Definimos la interfaz para el valor del contexto
interface AuthContextValue {
  loggedUser: any;
  login: (email: string) => Promise<void>;
  logout: () => void;
  filtersActive: boolean;
  setFiltersActive: (active: boolean) => void;
}


// Proporcionamos un valor por defecto al contexto
export const AuthContext = createContext({
  loggedUser: {},
  login: (email: string) => {},
  logout: () => {},
  filtersActive: false,
  setFiltersActive: () => {},
  
});

export default function AuthContextProvider({ children }: { children: ReactNode }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loggedUser, setLoggedUser] = useState({});
  const [filtersActive, setFiltersActive] = useState<boolean>(false);

  const login =  useCallback(async function(email: string) {
      const response = await axios.get(apiUrl+`usuarios?email=${email}` )
console.log(response.data)
        setLoggedUser(response.data)
     ;


  }, []);

  const logout = useCallback(function() {
    window.localStorage.removeItem(MY_AUTH_APP);
    setLoggedUser({});
  }, []);
  // Función para alternar el estado de los filtros
const setFiltersActiveHandler = useCallback(() => {
  setFiltersActive(prevState => !prevState);
}, []);

  const value = useMemo(() => ({
    login,
    logout,
    loggedUser,
    filtersActive,
    setFiltersActive: setFiltersActiveHandler,
  }), [loggedUser, login, logout, filtersActive]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}