import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../useAuth";

const ProfilePage = ({ code }) => {
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
      <img src="https://i.scdn.co/image/ab6775700000ee85aea295ca3db5dda78f4b986c" />
    </div>
  );
};

export default ProfilePage;
