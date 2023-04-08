import React from "react";
import useAuth from "./useAuth";
import Login from "./Components/Login";
import Homepage from "./Components/Homepage";
import ProfilePage from "./Components/ProfilePage";
import Feedpage from "./Components/Feedpage";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header";

const App = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const accessToken = useAuth(code);

  return (
    <>
      <Header />
      {accessToken ? (
        <Routes>
          <Route path="/" element={<Homepage code={code} />} />
          <Route path="/profile" element={<ProfilePage code={code} />} />
          <Route path="/feed" element={<Feedpage code={code} />} />
        </Routes>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;
