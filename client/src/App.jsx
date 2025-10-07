import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import ExpenseChart from "./components/ExpenseChart";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeLink, setActiveLink] = useState("");

  const fetchExpenses = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setExpenses([]);
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className={`max-w-4xl mx-auto  ${darkMode ? "bg-slate-700" : "bg-slate-200"} rounded-xl shadow p-4 sm:p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-violet-800" : "text-green-600"  }`}>
            💰 Expense Tracker
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`text-sm px-3 py-1 ${darkMode ?"bg-gray-700" : "bg-gray-200"} ${darkMode ? "text-white" : "text-balck"} rounded ${darkMode ? "hover:bg-gray-600": "hover:bg-gray-300"} transition`}
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex flex-wrap justify-center gap-4 sm:gap-6 text-lg font-medium mb-8 ${ darkMode ? "text-blue-300" : "text-blue-500"}`}>
          {token ? (
            <>
              <Link to="/add" className="text-stone-800 transition">
                Add
              </Link>
              <Link to="/history" className="text-stone-800 transition">
                History
              </Link>
              <Link to="/summary" className="text-stone-800 transition">
                Summary
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setActiveLink("register")}
                className={`px-3 py-1 rounded transition ${
                  activeLink === "register"
                    ? "bg-blue-500 text-white"
                    : "hover:text-green-500 text-blue-1000 dark:text-blue-400 "
                }`}
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setActiveLink("login")}
                className={`px-3 py-1 rounded transition ${
                  activeLink === "login"
                    ? "bg-blue-500 text-white"
                    : "hover:text-green-500 text-blue-900 dark:text-blue-400"
                }`}
              >
                Login
              </Link>
            </>
          )}
        </nav>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <p className={`text-center text-lg font-semibold ${ darkMode ? "text-white" : "text-black-900"  }`}>
                Welcome! Choose an option above.
              </p>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add" element={<ExpenseForm onAdd={fetchExpenses} darkMode={darkMode}/>} />
          <Route
            path="/history"
            element={<ExpenseList expenses={expenses} darkMode={darkMode} />}
          />
          <Route
            path="/summary"
            element={
              <>
                <Summary expenses={expenses} darkMode={darkMode}/>
                <ExpenseChart expenses={expenses} darkMode={darkMode} />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
