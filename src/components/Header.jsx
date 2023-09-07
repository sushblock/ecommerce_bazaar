import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "../helpers/StateProvider";
import { auth } from "../config/firebase";
import { getBasketQuantity } from "../helpers/reducer";
import logo from "../assets/logo.png";

function Header() {
  const [{ basketQty, user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
      navigate("/");
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
          src={logo}
          alt="Vidhavani Farming Solutions and Services. Serving all your Soliless farming needs!"
        />
      </Link>

      
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
              <Link to={"/products-home"}>
                <div className="header__option">
                  <span className="header__optionLineOne">Products</span>
                  <span className="header__optionLineTwo">To Buy</span>
                </div>
              </Link>
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
              <Link to={!user ? "/login" : "/calculator"}>
                <div className="header__option">
                  <span className="header__optionLineOne">Farm Cost</span>
                  <span className="header__optionLineTwo">Calculator</span>
                </div>
              </Link>
              <Link to={!user ? "/login" : "/contact"}>
                <div className="header__option">
                  <span className="header__optionLineOne">Contact Us</span>
                  <span className="header__optionLineTwo">Today</span>
                </div>
              </Link>
              <Link to={!user ? "/login" : "/pastorders"}>
                <div className="header__option">
                  <span className="header__optionLineOne">Returns</span>
                  <span className="header__optionLineTwo">& Orders</span>
                </div>
              </Link>
              <Link to={!user ? "/login" : "/checkout"}>
                <div className="header__optionBasket">
                  <ShoppingBasketOutlinedIcon color="primary" />
                  <span className="header__optionLineTwo header__basketCount">
                    {getBasketQuantity(basketQty)}
                  </span>
                </div>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="header__nav">
          <Link to={"/products-home"}>
            <div className="header__option">
              <span className="header__optionLineOne">Products</span>
              <span className="header__optionLineTwo">To Buy</span>
            </div>
          </Link>
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
          <Link to={!user ? "/login" : "/calculator"}>
            <div className="header__option">
              <span className="header__optionLineOne">Farm Cost</span>
              <span className="header__optionLineTwo">Calculator</span>
            </div>
          </Link>
          <Link to={!user ? "/login" : "/contact"}>
                <div className="header__option">
                  <span className="header__optionLineOne">Contact Us</span>
                  <span className="header__optionLineTwo">Today</span>
                </div>
              </Link>
          <Link to={!user ? "/login" : "/pastorders"}>
            <div className="header__option">
              <span className="header__optionLineOne">Returns</span>
              <span className="header__optionLineTwo">& Orders</span>
            </div>
          </Link>

          <Link to={!user ? "/login" : "/checkout"}>
            <div className="header__optionBasket">
              <ShoppingBasketOutlinedIcon color="primary" />
              <span className="header__optionLineTwo header__basketCount">
                {getBasketQuantity(basketQty)}
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
