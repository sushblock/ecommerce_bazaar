import SplashScreen from "../src/components/SplashScreen";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { auth } from "./config/firebase";
import { useStateValue } from "../src/helpers/StateProvider";
const Header = lazy(() => import("./components/Header"));
const Login = lazy(() => import("./pages/Login"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const PastOrders = lazy(() => import("./pages/PastOrders"));

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(true);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
    };
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      //console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // The user just logged in / the user was logged in

        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // The user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      {!isOnline && (
        <div>
          You are offline. <br />
          Please connect to Internet to access your app.
        </div>
      )}

      {isOnline && (
        <Router>
          <Suspense
            fallback={
              <div>
                <SplashScreen />
              </div>
            }
          >
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/orders" element={<OrderConfirmation />} />
              <Route path="/pastorders" element={<PastOrders />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </div>
  );
}

export default App;
