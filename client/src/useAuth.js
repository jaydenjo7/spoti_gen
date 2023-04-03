import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    if (!code) return;
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);

        localStorage.setItem("accessToken", res.data.accessToken); // store access token in local storage
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        console.log("Error from server:", err.response); // added console log
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000); // get current time in seconds
      if (expiresIn - currentTime <= 300) {
        axios
          .post("http://localhost:3001/refresh", {
            refreshToken,
          })
          .then((res) => {
            setAccessToken(res.data.accessToken);
            setExpiresIn(res.data.expiresIn);

            localStorage.setItem("accessToken", res.data.accessToken); // update access token in local storage
          })
          .catch((err) => {
            console.log("Error from server:", err.response);
            window.location = "/";
          });
      }
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
};

export default useAuth;
