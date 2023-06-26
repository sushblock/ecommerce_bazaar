import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../config/firebase";
import { useStateValue } from "../helpers/StateProvider";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../styles/OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [{ basketQty, user }, dispatch] = useStateValue();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (user?.uid && orderId) {
          const usersCollectionRef = collection(db, "users");
          const q = query(usersCollectionRef, where("id", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
            const orderCollectionRef = collection(userDocRef, "orders");
            const orderQuery = query(
              orderCollectionRef,
              where("orderId", "==", orderId)
            );
            const orderSnapshot = await getDocs(orderQuery);

            if (!orderSnapshot.empty) {
              const orderData = orderSnapshot.docs[0].data();
              setOrder(orderData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId, user.uid]);

  return (
    <div className="order">
      {order ? (
        <div className="order__container">
          <h2>Order Details</h2>
          <div className="order__section">
            <h3>Order ID</h3>
            <p>{orderId}</p>
          </div>
          <div className="order__section">
            <h3>Payment ID</h3>
            <p>{order.paymentId}</p>
          </div>
          <div className="order__section">
            <h3>Total Amount</h3>
            <p className="order__total">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: order.currency,
              }).format(order.amount)}
              <span className="order__currency">{order.currency}</span>
            </p>
          </div>          
          <div className="order__section">
            <h3>Date</h3>
            <p>{(new Date(order.timestamp)).toUTCString()}</p>
          </div>
          {Object.keys(order.basketQty).map((key) => (
            <div key={key} className="order__section">
              <h3>{order.basketQty[key].item.title}</h3>
              
              <div className="order__details">
                <img
                  className="order__item-image"
                  src={order.basketQty[key].item.image}
                  alt="Product"
                />
                <div>
                <p>ID: {order.basketQty[key].id}</p>
              <p>Quantity: {order.basketQty[key].quantity}</p>
                  <p>
                    Price:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: order.currency,
                    }).format(order.basketQty[key].item.price)}
                  </p>
                  <div className="order__rating">
                    <p>Rating:</p>
                    {Array(Math.round(order.basketQty[key].item.rating))
                      .fill()
                      .map((_, i) => (
                        <p key={i}>⭐</p>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="order__loading">Loading order details...</p>
      )}
    </div>
  );
};

export default OrderConfirmation;

