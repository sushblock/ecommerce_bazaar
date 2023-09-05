import React, { useEffect } from "react";
import { useStateValue } from "../helpers/StateProvider";
import "../styles/Product.css";

function Product({ id, title, image, price, rating }) {
  const [{ basketQty }, dispatch] = useStateValue();

  useEffect(() => {
    const quantity = basketQty.find((item) => item.id === id)?.quantity;
    if (quantity !== undefined) {
      dispatch({
        type: "UPDATE_QUANTITY",
        id: id,
        quantity: quantity,
      });
    }
  }, [basketQty, dispatch, id]);

  const addToBasket = () => {
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
    <div className="product" key={id}>
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <strong>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
            }).format(price)}
          </strong>
        </p>
        <div className="product__rating">{renderRatingStars()}</div>
      </div>

      <img src={image} alt="" />
      <div className="product__addremove">
        <button onClick={addToBasket}>+</button>
        <label id="quantity">
          {basketQty.find((item) => item.id === id)?.quantity || 0}
        </label>
        <button onClick={removeFromBasket}>-</button>
      </div>
    </div>
  );
}

export default Product;
