import { getAuth, updateProfile } from "firebase/auth"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../firebase.config"
import { updateDoc, doc } from "firebase/firestore"
import { toast } from "react-toastify"

const Profile = () => {
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const navigate = useNavigate()

  const onLogout = () => {
    auth.signOut()
    toast.info("Logged out")
    navigate("/")
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
      }

      const userRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(userRef, {
        name,
      })
      toast.success("Successfully updated")
    } catch (error) {
      toast.error("Could not update profile")
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  return (
    <>
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button className="logOut" onClick={onLogout}>
            Log out
          </button>
        </header>

        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailText">Personal Details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit()
                setChangeDetails((prevState) => !prevState)
              }}
            >
              {changeDetails ? "done" : "change"}
            </p>
          </div>

          <div className="profileCard">
            <form>
              <input type="text" id="name" className={!changeDetails ? "profileName" : "profileNameActive"} disabled={!changeDetails} value={name} onChange={onChange} />
              <input type="email" id="email" className="profileName" disabled={!changeDetails} value={email} />
            </form>
          </div>
        </main>
      </div>
    </>
  )
}

export default Profile
