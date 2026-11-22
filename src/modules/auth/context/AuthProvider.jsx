import { createContext, useState } from 'react';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = Boolean(token);

  const singout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const setAuthSession = (authData, sessionRole, extraUserData = {}) => {
    const receivedToken =
      typeof authData === 'string' ? authData : authData?.token;

    if (receivedToken) {
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
    }

    localStorage.setItem('role', sessionRole);
    setRole(sessionRole);

    if (extraUserData && Object.keys(extraUserData).length > 0) {
      localStorage.setItem('user', JSON.stringify(extraUserData));
      setUser(extraUserData);
    }
  };

  const singinAdmin = async (email, password) => {
    try {
      const { data, error } = await loginAdmin(email, password);

      if (error) return { error };

      setAuthSession(data, 'ADMINISTRADOR', { email });

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const singinPatient = async (email, dni) => {
    try {
      const { data, error } = await loginPatient(email, dni);

      if (error) return { error };

      setAuthSession(data, 'PACIENTE', { email, dni: Number(dni) });

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        role,
        user,
        singinAdmin,
        singinPatient,
        singout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };