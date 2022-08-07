import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../firebase.config"
import Loader from "../components/Loader"
import { toast } from "react-toastify"
import shareIcon from "../assets/svg/shareIcon.svg"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { Navigation, Pagination, Scrollbar, A11y } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"

const Listing = () => {
  const [listing, setListing] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [params.listingId])

  if (isLoading) {
    return <Loader />
  }
  return (
    <main>
      <Swiper
        modules={[Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 2500 }}
        loop={true}
      >
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="swiperSlideDiv"
              style={{
                background: `url(${listing.imageUrls[index]}) center`,
                backgroundSize: "cover",
                minHeight: "20rem",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          //copy url
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)

          setTimeout(() => {
            setShareLinkCopied(false)
          }, 1500)
        }}
      >
        <img src={shareIcon} alt="share" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">{listing.name}</p>
        <p className="categoryListingPrice">
          $
          {listing.offer
            ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          {listing.type === "rent" && " / Week "}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type === "rent" ? "Rent" : "Sale"}</p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount{" "}
            {listing.type === "rent" && " / week "}
          </p>
        )}

        <ul className="listingDetailsList">
          <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : "1 Bedroom"}</li>
          <li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : "1 Bathroom"}</li>
          <li>
            {listing.parking === "1" || listing.parking === "0"
              ? `${listing.parking} Parking Spot`
              : `${listing.parking} Parking Spots`}
          </li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
            className="primaryButton"
          >
            Contact Owner
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing
