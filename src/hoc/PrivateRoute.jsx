import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {
  const { isLogged } = useSelector((store) => store.User)
  return isLogged ? <>{children}</> : <Navigate to={'/sign-in'} />
}

export default PrivateRoute
