import React from "react";
import "../styles/Subtotal.css";
import { useStateValue } from "../helpers/StateProvider";
import { getBasketTotal } from "../helpers/reducer";
import { useNavigate } from "react-router-dom";

function Subtotal() {
  const navigate = useNavigate();
  const [{ basket }, dispatch] = useStateValue();

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(getBasketTotal(basket));

  return (
    <div className="subtotal">
      <p>
        {/* Part of the homework */}
        Subtotal ({basket.length} items): <strong>{formattedTotal}</strong>
      </p>
      <small className="subtotal__gift">
        <input type="checkbox" /> This order contains a gift
      </small>

      <button>Proceed to Checkout</button>
    </div>
  );
}

export default Subtotal;
