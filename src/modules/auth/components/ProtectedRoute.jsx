import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

// Protege por sesión y, si se pasa allowedRoles, también por rol.
// Sin sesión o con un rol no permitido redirige al login de esa sección.
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