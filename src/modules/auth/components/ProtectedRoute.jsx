import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, allowedRoles, redirectTo = '/login' }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
