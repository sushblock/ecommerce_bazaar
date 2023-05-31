import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "../helpers/StateProvider";
import { auth } from "../config/firebase";


function Header() {
  const [{ basket, user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
      navigate("/")
    }
  };

  const [isMobileView, setIsMobileView] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 600);
    };

    handleResize(); // Check initial viewport width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="header">
      <Link to="/">
        <img
          className="header__logo"
          src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
          alt="Amazon Clone"
        />
      </Link>

      <div className="header__search">
        <input className="header__searchInput" type="text" />
        <SearchOutlinedIcon className="header__searchIcon" />
      </div>
      {isMobileView ? (
        isMenuOpen ? (
          <CloseIcon className="header__menuIcon" onClick={handleMenuToggle} />
        ) : (
          <MenuIcon className="header__menuIcon" onClick={handleMenuToggle} />
        )
      ) : (
        <></>
      )}

      {isMobileView ? (
        <>
          {isMenuOpen && (
            <div className="header__menuItems">
              <Link to={!user && "/login"}>
                <div onClick={handleAuthenticaton} className="header__option">
                  <span className="header__optionLineOne">
                    Hello {!user ? "Guest" : user.email}
                  </span>
                  <span className="header__optionLineTwo">
                    {user ? "Sign Out" : "Sign In"}
                  </span>
                </div>
              </Link>

              <div className="header__option">
                <span className="header__optionLineOne">Returns</span>
                <span className="header__optionLineTwo">& Orders</span>
              </div>

              <div className="header__option">
                <span className="header__optionLineOne">Your</span>
                <span className="header__optionLineTwo">Prime</span>
              </div>
              <Link to={!user ? "/login" : "/checkout"}>
                <div className="header__optionBasket">
                  <ShoppingBasketOutlinedIcon color="primary"/>
                  <span className="header__optionLineTwo header__basketCount">
                    {basket?.length}
                  </span>
                </div>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="header__nav">
          <Link to={!user && "/login"}>
            <div onClick={handleAuthenticaton} className="header__option">
              <span className="header__optionLineOne">
                Hello {!user ? "Guest" : user.email}
              </span>
              <span className="header__optionLineTwo">
                {user ? "Sign Out" : "Sign In"}
              </span>
            </div>
          </Link>

          <div className="header__option">
            <span className="header__optionLineOne">Returns</span>
            <span className="header__optionLineTwo">& Orders</span>
          </div>

          <div className="header__option">
            <span className="header__optionLineOne">Your</span>
            <span className="header__optionLineTwo">Prime</span>
          </div>

          <Link to={!user ? "/login" : "/checkout"}>
            <div className="header__optionBasket">
              <ShoppingBasketOutlinedIcon color="primary" />
              <span className="header__optionLineTwo header__basketCount">
                {basket?.length}
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
