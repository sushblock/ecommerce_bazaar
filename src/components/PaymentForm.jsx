import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useHttpsCallable } from "../config/useHttpsCallable";


const PaymentForm = ({paymentIntent}) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      navigate("/thank-you");
    }
  };

  const cancelPaymentIntent = useHttpsCallable("cancelPaymentIntent");

  const handleCancel = async (e) => {
    try {
      const response = await cancelPaymentIntent.call({
        id: paymentIntent?.id,
      });
      navigate("/products-home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      {error ? <p>{error.message}</p> : ""}
      <PaymentElement />
      <button disabled={!stripe || loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
      <Link to="/products-home" onClick={handleCancel}>
        Cancel
      </Link>
    </form>
  );
};

export default PaymentForm;