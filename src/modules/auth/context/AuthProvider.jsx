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

  const setAuthSession = (authData, extraUserData = {}) => {
    const receivedToken =
      typeof authData === 'string' ? authData : authData?.token;
    const receivedRole = typeof authData === 'object' ? authData?.role : null;

    if (receivedToken) {
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
    }

    if (receivedRole) {
      localStorage.setItem('role', receivedRole);
      setRole(receivedRole);
    }

    if (extraUserData && Object.keys(extraUserData).length > 0) {
      localStorage.setItem('user', JSON.stringify(extraUserData));
      setUser(extraUserData);
    }
  };

  const singinAdmin = async (email, password) => {
    try {
      const { data, error } = await loginAdmin(email, password);

      if (error) return { error };

      setAuthSession(data, { email });

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const singinPatient = async (email, dni) => {
    try {
      const { data, error } = await loginPatient(email, dni);

      if (error) return { error };

      setAuthSession(data, { email, dni: Number(dni) });

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
