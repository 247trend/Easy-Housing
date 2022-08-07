import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase.config"
import { Pagination, Scrollbar, A11y, Autoplay} from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import Loader from "./Loader"

const Slider = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchlistings = async () => {
      const listingsRef = collection(db, "listings")
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(10))
      const querySnap = await getDocs(q)

      let listings = []
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(listings)
      setIsLoading(false)
    }

    fetchlistings()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  //if no listing, <></>
  if(listings.length === 0 ) {
    return <></>
  }

  return (
    listings && (
      <>
        <p className="exploreHeading">Recommend</p>
        <Swiper
          modules={[Pagination, Scrollbar, A11y, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 2500 }}
          loop={true}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                  minHeight: "20rem",
                }}
              >
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  ${data.discountedPrice ?? data.regularPrice} {data.type === "rent" && "/ Week"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider
