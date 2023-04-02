import React from "react";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=acef137a01a44960b92c90df6bf914d5&response_type=code&redirect_uri=http://localhost:3000&scope=user-read-private%20user-read-email%20playlist-modify-public%20playlist-modify-private%20playlist-read-collaborative";

const Login = () => {
  return (
    <button>
      <a href={AUTH_URL}>Login</a>
    </button>
  );
};

export default Login;
