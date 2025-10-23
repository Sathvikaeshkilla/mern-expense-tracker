import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  if (token) {
    localStorage.setItem('token', token);
    navigate('/add');
  }
}, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // setLoginSuccess(true);
      alert("Login successful!");
      navigate("/add");
    } catch (err) {
      alert(err.response.data.message || "Login failed");
    }
  };


  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>

      <a
    href="http://localhost:5000/api/auth/google"
    className="bg-red-500 text-white px-4 py-2 rounded inline-block mt-4"
  >
    Login with Google
  </a>

    </form>
  );
}

export default Login;
