import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../useAuth";

const ProfilePage = ({ code }) => {
  const accessToken = useAuth(code);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");

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
        setProfilePic(res.data.images[0].url);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  return (
    <div>
      <h1>Welcome, {userName}</h1>
      <img src={profilePic} />
    </div>
  );
};

export default ProfilePage;
