import React from "react";
import "../styles/Subtotal.css";
import { useStateValue } from "../helpers/StateProvider";
import { getBasketQuantity, getBasketTotal } from "../helpers/reducer";
import { useNavigate } from "react-router-dom";

function Subtotal() {
  const navigate = useNavigate();
  const [{ basketQty, user }, dispatch] = useStateValue();

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(getBasketTotal(basketQty));

  const navigateToPayment = () => {
    console.log(`in navigate to payment from Subtotal - >`)
    navigate("/payment")
  }

  return (
    <div className="subtotal">
      <p>
        {/* Part of the homework */}
        Subtotal ({getBasketQuantity(basketQty)} items): <strong>{formattedTotal}</strong>
      </p>
      <small className="subtotal__gift">
        <input type="checkbox" /> This order contains a gift
      </small>

      <button onClick={navigateToPayment}>Proceed to Checkout</button>
    </div>
  );
}

export default Subtotal;
