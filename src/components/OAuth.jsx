import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from "../assets/svg/googleIcon.svg"

const OAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogle = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      //check if user doesnt exist in db
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate("/")
      toast.success("Successfully logged in")
    } catch (error) {
      toast.error("Could not authorize with Google")
    }
  }
  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-in" ? "in" : "up"} with</p>
      <button className="socialIconDiv" onClick={onGoogle}>
        <img className="socialIconImg" src={googleIcon} alt="google" />
      </button>
    </div>
  )
}

export default OAuth
