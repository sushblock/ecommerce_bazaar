import React from "react";
import "../styles/Checkout.css";
import Subtotal from "../components/Subtotal";
import { useStateValue } from "../helpers/StateProvider";
import sale from "../assets/big-sale.jpg"
import CheckoutProduct from "../components/CheckoutProduct";

function Checkout() {
  const [{ basketQty, user }, dispatch] = useStateValue();

  return (
    <div className="checkout">
      <div className="checkout__left">
        <img
          className="checkout__ad"
          src={sale}
          alt="biggest blac friday sale"
        />

        <div>
          <h3>Hello, {user?.email}</h3>

          {basketQty.length === 0 ? (
            <h2 className="checkout__title">Your shopping Basket is empty!</h2>
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
                  fromPayment={false}
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
  );
}

export default Checkout;
