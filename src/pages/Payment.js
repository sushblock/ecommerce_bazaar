import React from "react";
import "../styles/Payment.css";
import { useStateValue } from "../helpers/StateProvider";
import CheckoutProduct from "../components/CheckoutProduct";
import { Link, useNavigate } from "react-router-dom";

import { getBasketQuantity, getBasketTotal } from "../helpers/reducer";
import logo from "../assets/logo.png";
import axios from "../axios";
import { db} from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";

/**This code defines a React functional component named "Payment"
 * that renders a payment page for an e-commerce website. It uses
 * the useStateValue hook to retrieve the user's basket and user
 * information. It also uses the useNavigate hook to navigate to
 * different pages. The page displays the delivery address, the items
 * in the basket, and the payment method. The "Buy Now" button uses
 * Razorpay payment gateway to process the payment.
 * */
function Payment() {
  const [{ basketQty, user }, dispatch] = useStateValue();

  const navigate = useNavigate();

  let basketTotal = getBasketTotal(basketQty);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(basketTotal);

  /**This code defines a function named loadScript that loads an external script
   * file by creating a script element and adding it to the body of the HTML
   * document. The function returns a Promise that resolves when the script is
   * successfully loaded, or rejects with an error if it fails to load. */
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        reject(new Error(`Failed to load script ${src}`));
      };
      document.body.appendChild(script);
    });
  };

  /**This code is for displaying a Razorpay payment window. It loads
   * the Razorpay SDK using a script tag, posts payment data to a server,
   * and then uses the response to set up options for the payment window.
   * Once the user confirms the payment, it sends the payment data to
   * another server to complete the transaction. If there are any errors,
   * it displays an alert. */
  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = { amount: basketTotal, currency: "INR" };
    //console.log(`data --> ${data.amount} --> ${data.currency}`);
    const razor_key = process.env.REACT_APP_RAZORPAY_KEY;
    const result = await axios.post(
      "razorPayDisplay",
      data
    );

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    //console.log(`amount --> ${amount} --> ${currency} --> ${order_id}`);
    const options = {
      key: razor_key, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: user.name,
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        await axios
          .post(
            "razorPayStatus",
            data
          )
          .then(async (res) => {
            //console.log(`user Id --> ${user?.uid}`);
            const userUid = user?.uid; // Replace this with the authenticated user's UID

            // Create a reference to the "users" collection
            const usersCollectionRef = collection(db, "users");

            // Query the collection to find the document with matching UID
            const querySnapshot = await getDocs(
              query(usersCollectionRef, where("id", "==", userUid))
            );

            // Check if a matching document exists
            if (querySnapshot.size > 0) {

              //console.log(`querySnapshot.docs[0].ref --> ${querySnapshot.size}`);
              //console.log(`response data--> ${res.data}`)

              const userDocRef = querySnapshot.docs[0].ref;

              // Access the "orders" subcollection within the user's document
              const ordersRef = collection(userDocRef, "orders");

              //console.log(`ordersRef --> ${ordersRef}`);

              // Add a new document to the "orders" subcollection with the order details
              addDoc(ordersRef, {
                basketQty: basketQty,
                orderId: res.data.orderId,
                paymentId: res.data.paymentId,
                currency: "INR",
                amount: basketTotal,
                timestamp: Date.now(),
              });
            }

            if (res.data.msg === "success") {
              dispatch({
                type: "EMPTY_BASKET",
              });

              navigate("/orders", {
                state: {
                  orderId: res.data.orderId,
                },
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone,
      },
      notes: {
        address: "Vidhavani Enterprises Corporate Office",
      },
      theme: {
        color: "#f0c14b",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (
          <Link to="/checkout">{getBasketQuantity(basketQty)} items</Link>)
        </h1>
        {/* Payment section - delivery address*/}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>123, Dunken Paradise</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>
        {/* Payment section - reviewing the items*/}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review Items and Delivery</h3>
          </div>
          <div className="payment__items">
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
          </div>
        </div>
        {/* Payment section - Payment method containing Buy Now button */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/*Stripe payment method*/}

            <div className="payment__container">
              <h3>Order Total: {formattedTotal}</h3>
              <button id="rzp-button1" onClick={displayRazorpay}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
