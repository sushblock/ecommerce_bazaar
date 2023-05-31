import React from "react";
import "../styles/Checkout.css";
import Subtotal from "../components/Subtotal";
import { useStateValue } from "../helpers/StateProvider";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header";

function Checkout() {
  const [{ basketQty, user }, dispatch] = useStateValue();

  return (
    <>
      <Header />
      <div className="checkout">
        <div className="checkout__left">
          <img
            className="checkout__ad"
            src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
            alt=""
          />

          <div>
            <h3>Hello, {user?.email}</h3>

            {basketQty.length === 0 ? (
              <h2 className="checkout__title">
                Your shopping Basket is empty!
              </h2>
            ) : (
              <>
                <h2 className="checkout__title">Your shopping Basket</h2>
                {basketQty.map((item, index) => (
                  <CheckoutProduct
                    id={item.id}
                    title={item.item.title}
                    image={item.item.image}
                    price={item.item.price}
                    rating={item.item.rating}
                    key={`${item.id}-${index}`}
                  />
                ))}
                <div className="checkout__right">
                  <Subtotal />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
