import React, { useEffect, useState } from "react";
import { useStateValue } from "../helpers/StateProvider";
import "../styles/Product.css";

function Product({ id, title, image, price, rating }) {
  const [{ basket, basketQty }, dispatch] = useStateValue();
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const quantity = basketQty.find((item) => item.id === id)?.quantity;
    //console.log(`quantity of ${id} --> ${quantity}`);
    if (quantity !== undefined) {
      setQty(quantity);
    }
    else setQty(0);
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
    <div className="product" key={id}>
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p key={i}>🌟</p>
            ))}
        </div>
      </div>

      <img src={image} alt="" />
      <div className="product__addremove">
        <button onClick={addToBasket}>+</button>
        <label id="quantity">{qty}</label>
        <button onClick={removeFromBasket}>-</button>
      </div>
    </div>
  );
}

export default Product;
