import { Navigate, Outlet } from "react-router-dom"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Loader from "./Loader"

const PrivateRoute = () => {
  const { isLogin, isChecking } = useAuthStatus()

  if (isChecking) {
    return <Loader />
  }

  return isLogin ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute
