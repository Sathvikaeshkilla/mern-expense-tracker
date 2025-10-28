import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 1. ✨ Added state for the confirm password field
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // 2. ✨ Check if the passwords match before sending the request
    if (password !== confirmPassword) {
      alert("Passwords do not match! Please try again. 😉");
      return; // Stop the function if they don't match
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/auth/register`, {
          email,
          password,
        });

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      alert("Registration successful! Welcome aboard! 🚀");
      navigate('/add');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto mt-10 space-y-4"
    >
      <h2 className="text-xl font-bold">Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      {/* 3. ✨ Added the new input field for confirming the password */}
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
}

export default Register;