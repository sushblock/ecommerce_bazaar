import SplashScreen from "../src/components/SplashScreen";
import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { auth } from "./config/firebase";
import { useStateValue } from "../src/helpers/StateProvider";
import Checkout from "./pages/Checkout";

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
  }, []);

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
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </div>
  );
}

export default App;
