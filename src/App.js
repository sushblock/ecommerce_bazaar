import { ThemeProvider } from "styled-components";
import SplashScreen from "../src/components/SplashScreen";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { auth } from "./config/firebase";
import { useStateValue } from "../src/helpers/StateProvider";
import HomePage from "./pages/HomePage";
import PlanningGuideDetails from "./components/PlanningGuideDetails";
import PlanningGuides from "./components/PlanningGuides";
import CustomerScenarios from "./components/CustomerScenarios";
import GeneralConsiderations from "./components/GeneralConsiderations";
import DecidedScenarios from "./components/DecidedScenarios";
import CostCalculator from "./pages/CostCalculator";
const Header = lazy(() => import("./components/Header"));
const Login = lazy(() => import("./pages/Login"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const PastOrders = lazy(() => import("./pages/PastOrders"));


function App() {


  const theme = {
    colors: {
      heading: "rgb(24 24 29)",
      text: "rgb(24 24 29)",
      white: "#fff",
      black: " #212529",
      helper: "#8490ff",
      bg: "rgb(249 249 255)",
      footer_bg: "#0a1435",
      btn: "rgb(98 84 243)",
      border: "rgba(98, 84, 243, 0.5)",
      hr: "#ffffff",
      gradient:
        "linear-gradient(0deg, rgb(132 144 255) 0%, rgb(98 189 252) 100%)",
      shadow:
        "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;",
      shadowSupport: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
    },
    media: { mobile: "768px", tab: "998px" },
  };

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
        <ThemeProvider theme={theme}>
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
              <Route path="/" element={<HomePage />} />
              <Route path="/products-home" element={<Home />} />
              <Route path="/farminghome" element={<HomePage />} />
              <Route path="/guides" element={<PlanningGuides />} />
              <Route path="/customer-scenarios" element={<CustomerScenarios />} />
              <Route path="/general-considerations" element={<GeneralConsiderations />} />
              <Route path="/decided-scenarios" element={<DecidedScenarios />} />
              <Route path="/planning-guide/:title" element={<PlanningGuideDetails />} />
              <Route path="/calculator" element={<CostCalculator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/orders" element={<OrderConfirmation />} />
              <Route path="/pastorders" element={<PastOrders />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </Router>
        </ThemeProvider>
      )}
    </div>
  );
}

export default App;
