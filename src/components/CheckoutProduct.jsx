import React, { useState, useEffect } from "react";
import "../styles/CheckoutProduct.css";
import { useStateValue } from "../helpers/StateProvider";

function CheckoutProduct({
  id,
  image,
  title,
  price,
  rating,
  hideButton,
  fromPayment,
}) {
  const [{ basketQty }, dispatch] = useStateValue();
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
        price: price * 80,
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

  const renderRatingStars = () => {
    const roundedRating = Math.round(rating);
    const starIcons = [];

    for (let i = 0; i < roundedRating; i++) {
      starIcons.push(<p key={i}>⭐</p>);
    }

    return starIcons;
  };

  return (
    <div className="checkoutProduct">
      <img className="checkoutProduct__image" src={image} alt="Checkout" />

      <div className="checkoutProduct__info">
        <p className="checkoutProduct__title">{title}</p>
        <p className="checkoutProduct__price">
          <strong>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
            }).format(price)}
          </strong>
        </p>
        <div className="checkoutProduct__rating">{renderRatingStars()}</div>
        {!hideButton && (
          <div className="product__addremove">
            {!fromPayment && <button onClick={addToBasket}>+</button>}
            <label id="quantity">{qty}</label>
            {!fromPayment && <button onClick={removeFromBasket}>-</button>}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutProduct;
