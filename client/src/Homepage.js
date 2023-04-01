import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const Homepage = ({ code }) => {
  const accessToken = useAuth(code);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUserName(res.data.display_name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  return (
    <div>
      <h1>Welcome, {userName}</h1>
    </div>
  );
};

export default Homepage;
