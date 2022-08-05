import { useState } from "react"
import { Link } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { toast } from "react-toastify"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth,email)
      toast.success("Email sent")
    } catch (error) {
      toast.error("Could not send reset email")
    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input type="email" placeholder="Email" id="email" value={email} onChange={onChange} className="emailInput" />
          <Link to="/sign-in" className="forgotPasswordLink">
            Sign In
          </Link>
          <div className="signInBar">
            <p className="signInText">Send Reset Link</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="36px" height="36px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword
