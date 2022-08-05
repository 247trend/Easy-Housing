import { useNavigate, useLocation } from "react-router-dom"
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg"
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg"
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const whichPath = (route) => {
    return route === location.pathname
  }

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li onClick={() => navigate("/")} className="navbarListItem">
            <ExploreIcon fill={whichPath("/") ? "#89ABE3ff " : "#8f8f8f"} width="36px" height="36px" />
            <p className={whichPath("/") ? "navbarListItemNameActive" : "navbarListItemName"}>Explore</p>
          </li>
          <li onClick={() => navigate("/offers")} className="navbarListItem">
            <OfferIcon fill={whichPath("/offers") ? "#89ABE3ff " : "#8f8f8f"} width="36px" height="36px" />
            <p className={whichPath("/offers") ? "navbarListItemNameActive" : "navbarListItemName"}>Offers</p>
          </li>
          <li onClick={() => navigate("/profile")} className="navbarListItem">
            <PersonOutlineIcon fill={whichPath("/profile") ? "#89ABE3ff " : "#8f8f8f"} width="36px" height="36px" />
            <p className={whichPath("/profile") ? "navbarListItemNameActive" : "navbarListItemName"}>Profile</p>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Navbar
