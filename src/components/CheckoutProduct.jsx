import React, { useState, useEffect } from "react";
import "../styles/CheckoutProduct.css";
import { useStateValue } from "../helpers/StateProvider";

function CheckoutProduct({ id, image, title, price, rating, hideButton }) {
  const [{ basket, basketQty }, dispatch] = useStateValue();
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const quantity = basketQty.find((item) => item.id === id)?.quantity;
    //console.log(`quantity of ${id} --> ${quantity}`);
    if (quantity !== undefined) {
      setQty(quantity);
    } else setQty(0);
  }, [basketQty, id]);

  const addToBasket = () => {
    // dispatch the item into the data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
      },
    });
  };

  const removeFromBasket = () => {
    // remove the item from the basket
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };

  return (
    <div className="checkoutProduct">
      <img className="checkoutProduct__image" src={image} alt="Checkout" />

      <div className="checkoutProduct__info">
        <p className="checkoutProduct__title">{title}</p>
        <p className="checkoutProduct__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="checkoutProduct__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p key={i}>🌟</p>
            ))}
        </div>
        {!hideButton && (
          <div className="product__addremove">
            <button onClick={addToBasket}>+</button>
            <label id="quantity">{qty}</label>
            <button onClick={removeFromBasket}>-</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutProduct;
