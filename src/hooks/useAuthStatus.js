import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const useAuthStatus = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true)
      }
      setIsChecking(false)
    })
  },[])

  return { isLogin, isChecking }
}
