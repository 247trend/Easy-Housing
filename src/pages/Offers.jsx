import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Loader from "../components/Loader"
import ListingItem from "../components/ListingItem"

const Offers = () => {
  const [listings, setListings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListing = async () => {
      try {
        //get reference from listings collecetion
        const listingsRef = collection(db, "listings")
        //create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        )
        //execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)

        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setListings(listings)
        setIsLoading(false)
      } catch (error) {
        toast.error("Could not fetch listings")
      }
    }

    fetchListing()
  }, [])

  //fetch more
  const onFetchMore = async () => {
    try {
      //get reference from listings collecetion
      const listingsRef = collection(db, "listings")
      //create a query
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      )
      //execute query
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings((prevState) => [...prevState, ...listings])
      setIsLoading(false)
    } catch (error) {
      toast.error("Could not fetch listings")
    }
  }

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {isLoading ? (
        <Loader />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
              ))}
            </ul>
          </main>

          <br />

          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMore}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No offers now</p>
      )}
    </div>
  )
}

export default Offers
