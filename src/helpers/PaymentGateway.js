import axios from "axios";
//import logo from "../assets/nav_bar_logo.png";
import { db } from "../config/firebase";
import { collection, addDoc, Timestamp, updateDoc } from "firebase/firestore";
import { plan_applicable } from "../constants/master";

export default async function displayRazorpay(values) {
  alert(`values in displayRazorpay: ${JSON.stringify(values)}`);
  const data = { amount: values.amount, currency: values.currency };
  const razor_key = process.env.REACT_APP_RAZORPAY_KEY;
  
  try {
    await axios
      .post(
        "https://asia-east2-tjikko-7572e.cloudfunctions.net/razorPayDisplay",
        data
      )
      .then((res) => {
        //console.log(res.status);
        if (res.status === 200) {
          const { amount, id: order_id, currency } = res.data;

          const options = {
            key: razor_key,
            currency: currency,
            amount: amount, //  = INR 1
            name: "Profit Share",
            description: "Test Transaction",
            order_id: order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: async function (response) {
              // alert(
              //   `razorpay_payment_id: ${response.razorpay_payment_id}`
              // );
              // alert(`razorpay_order_id: ${response.razorpay_order_id}`);
              // alert(`razorpay_signature: ${response.razorpay_signature}`);
              values = {
                ...values,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              };
              const status = await onSubmitPlan(values);
              console.log(status);
              //redirect to another page after successful payment
              window.location.href = "/plan-confirm";
            },
            prefill: {
              name: values.name,
              email: values.email,
              contact: values.phone_number,              
            },
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}

// Calculates compound interest
// Formula: A = P(1 + r/n)^(nt)
export const calculateCompoundInterest = (principal, rate, time) => {
  const A = principal * (1 + rate/100) ** time;
  const CI = A - principal;
  return CI;
};

//on form submit
export const onSubmitPlan = async (values) => {
  const plan_detail = values.plan_applicable;
  const str_plan = plan_detail.split(" - ")[0];

  const duration_years = plan_applicable.find(
    (plan) => plan.duration === str_plan
  ).id;
  const interest = plan_applicable.find(
    (plan) => plan.duration === str_plan
  ).interest;
  const current_amount = values.amount;

  const date_today = new Date();
  const date_started = Timestamp.fromDate(date_today);

  const date_maturity = new Date(
    date_today.setFullYear(date_today.getFullYear() + duration_years)
  );
  const maturity_date = Timestamp.fromDate(date_maturity);

  const email = values.email;
  const inforce = true;
  const interest_amt = calculateCompoundInterest(
    current_amount,
    interest,
    duration_years
  );
  
  const currency = values.currency;
  const plan_type = plan_applicable.find(
    (plan) => Number(duration_years) === plan.id
  ).rate;
  const payment_id = values.payment_id;
  const order_id = values.order_id;
  const signature = values.signature;
  const asset_allocated = false;
  const plan = {
    currency,
    current_amount,
    date_started,
    email,
    inforce,
    plan_detail,
    interest_amt,
    maturity_date,
    plan_type,
    payment_id,
    order_id,
    signature,
    asset_allocated,
  };
  // alert(`plan currency: ${plan.currency} plan current_amount: 
  // ${plan.current_amount} plan date_started: ${plan.date_started} 
  // plan email: ${plan.email} plan inforce: ${plan.inforce} 
  // plan plan_detail: ${plan.plan_detail} plan interest_amt: ${plan.interest_amt}
  //  plan maturity_date: ${plan.maturity_date} plan plan_type: ${plan.plan_type} 
  //  plan payment_id: ${plan.payment_id} plan order_id: ${plan.order_id} 
  //  plan signature: ${plan.signature} plan asset_allocated: ${plan.asset_allocated}`);
  let status = "";
  try {
    const docRef = await addDoc(collection(db, "plans"), plan);
    console.log("Document written with ID: ", docRef.id);
    const id = { id: docRef.id };
    status = await updateDoc(docRef, id);
    return status;
  } catch (e) {
    console.error("Error adding document: ", e);
    status = e;
    return status;
  }
};
