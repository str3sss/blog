import { Navigate } from 'react-router-dom'

import { getToken } from '../utils/StorageHandler'

const Guard = ({ children }) => {
  const auth = getToken()
  if (!auth) {
    return <Navigate to="/sign-in" />
  }
  return children
}

export default Guard
