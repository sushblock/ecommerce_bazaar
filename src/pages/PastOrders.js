import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../config/firebase";
import { useStateValue } from "../helpers/StateProvider";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import "../styles/PastOrders.css";

const PastOrders = () => {
  const [{ basketQty, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


 const navigate = useNavigate();

  useEffect(() => {
    if(!user){
      navigate("/");
    }
  })

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        if (user?.uid) {
          const usersCollectionRef = collection(db, "users");
          const q = query(usersCollectionRef, where("id", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
            const orderCollectionRef = collection(userDocRef, "orders");
            const orderQuery = query(orderCollectionRef, orderBy("timestamp", "desc"));
            const orderSnapshot = await getDocs(orderQuery);

            if (!orderSnapshot.empty) {
              const pastOrders = orderSnapshot.docs.map((doc) => doc.data());
              setOrders(pastOrders);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching past orders:", error);
      }
    };

    fetchPastOrders();
  }, [user]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Calculate pagination boundaries
  const itemsPerPage = 5;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const toggleOrderDetails = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? { ...order, expanded: !order.expanded }
          : order
      )
    );
  };

  return (
    
      <div className="past-orders__container">
        <h2>Your Past Orders</h2>
        <div className="past-orders__pagination">
          <button onClick={previousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <label>{currentPage}</label>
          <button
            onClick={nextPage}
            disabled={indexOfLastOrder >= orders.length}
          >
            Next
          </button>
        </div>
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <div className="order__container" key={order.orderId}>
              <div
                className={`order__header ${order.expanded ? "expanded" : ""}`}
                onClick={() => toggleOrderDetails(order.orderId)}
              >
                <div className="order__summary">
                  <h3>{order.orderId}</h3>
                  <p>Date: {(new Date(order.timestamp)).toUTCString()}</p>
                  <p>
                    Total Amount:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: order.currency,
                    }).format(order.amount)}
                  </p>
                </div>
                <div className="order__toggle">
                  <span className={`arrow ${order.expanded ? "expanded" : ""}`}>
                    &#9660;
                  </span>
                </div>
              </div>
              {order.expanded && (
                <div className="order__details">
                  <div className="order__section order__products">
                    {Object.keys(order.basketQty).map((key) => (
                      <div key={key} className="order__product">
                        <h3>{order.basketQty[key].item.title}</h3>
                        <div className="order__item-details">
                          <img
                            className="order__item-image"
                            src={order.basketQty[key].item.image}
                            alt="Product"
                          />
                          <div className="order__item-info">
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
                              {Array(order.basketQty[key].item.rating)
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
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="past-orders__loading">No past orders found.</p>
        )}
        <div className="past-orders__pagination">
          <button onClick={previousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <label>{currentPage}</label>
          <button
            onClick={nextPage}
            disabled={indexOfLastOrder >= orders.length}
          >
            Next
          </button>
        </div>
      </div>
    
  );
};

export default PastOrders;
