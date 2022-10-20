import { useLocation, Navigate } from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const location = useLocation()
  const auth = localStorage.getItem('token')
  if (!auth) {
    return <Navigate to="/sign-in" state={{ from: location }} />
  }
  return children
}

export default RequireAuth
