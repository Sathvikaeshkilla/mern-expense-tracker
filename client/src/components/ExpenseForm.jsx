import { useState } from "react";
import axios from "axios";

export default function ExpenseForm({ onAdd, darkMode}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10)); // default to today

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;

    try {
      const token = localStorage.getItem("token"); // 🔐 Get token

      await axios.post(
        "http://localhost:5000/api/expenses",
        { title, amount, category, date }, // ✅ Send date too
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setTitle("");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().substr(0, 10));
      if (onAdd) onAdd();
    } catch (err) {
      console.error("Error adding expense:", err.response?.data || err.message);
      alert("❌ Error adding expense");
    }
  };

  return (
    <div className={` mx-auto mt-6 p-6 rounded-2xl shadow-lg transition-colors duration-300 ${darkMode ?"bg-blue-100" : "bg-white"}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
