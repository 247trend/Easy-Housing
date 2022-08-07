import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../firebase.config"
import Loader from "../components/Loader"
import { toast } from "react-toastify"
import shareIcon from "../assets/svg/shareIcon.svg"


const Listing = () => {
  const [listing, setListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(()=>{
    const fetchListing = async () => {
      const docRef = doc(db,"listings", params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log(docSnap.data())
        setListing(docSnap.data())
        setIsLoading(false)
      }

    }

    fetchListing()
  },[params.listingId])

  return (
    <div>Lisitng</div>
  )
}

export default Listing