import Login from "./Login";
import Homepage from "./Homepage";
import useAuth from "./useAuth";

const code = new URLSearchParams(window.location.search).get("code");
// const accessToken = useAuth(code);
function App() {
  return code ? <Homepage code={code} /> : <Login />;
}

export default App;
