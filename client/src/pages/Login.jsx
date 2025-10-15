import { useState } from 'react';
import axios from 'axios';

// ✨ SVG icons for a professional look ✨
const EyeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.423-4.423a1.012 1.012 0 0 1 1.428 0l4.028 4.028a1.012 1.012 0 0 1 0 1.428l-4.423 4.423a1.012 1.012 0 0 1-1.428 0l-4.028-4.028a1.012 1.012 0 0 1 0-1.428Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" />
  </svg>
);


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 1. State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // Save token
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      window.location.href = '/add';
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
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
        required
      />
      {/* 2. Wrapper to position the icon inside the input field */}
      <div className="relative w-full">
        <input 
          // 3. Conditionally set the input type based on state
          type={showPassword ? 'text' : 'password'} 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // Added padding-right to prevent text from overlapping with the icon
          className="w-full border p-2 rounded pr-10" 
          required
        />
        {/* 4. The toggle button with the SVG icon */}
        <button
          type="button" // Important: type="button" prevents form submission
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Login
      </button>
    </form>
  );
}

export default Login;