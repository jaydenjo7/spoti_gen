import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../useAuth";
import axios from "axios";
import styled from "styled-components";
const DetailedStatus = ({ code }) => {
  const accessToken = useAuth(code);
  let { statusId } = useParams();
  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [statusData, setStatusData] = useState();

  //fetch user's profile pic and display name
  useEffect(() => {
    if (!accessToken) return;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setDisplayName(res.data.display_name);
        setProfilePic(res.data.images[0].url);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  // axios get status by id
  useEffect(() => {
    if (!accessToken) return;
    const getStatusById = async () => {
      try {
        const response = await axios.get(`/feed/${displayName}/${statusId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data;
        console.log(data);
        // setStatusData(data)
      } catch (error) {
        console.log(error);
      }
    };
    getStatusById();
  }, [accessToken]);

  return <div>{displayName}</div>;
};

export default DetailedStatus;
