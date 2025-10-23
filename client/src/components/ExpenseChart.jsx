import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import stringSimilarity from "string-similarity";

const KNOWN_CATEGORIES = [
  "food",
  "clothes",
  "transport",
  "entertainment",
  "health",
  "education",
  "bills",
  "others",
];

const CATEGORY_SYNONYMS = {
  food: ["meal", "meals", "snack", "snacks", "lunch", "dinner", "breakfast"],
  clothes: ["cloth", "cloths", "clothing", "apparel", "outfit"],
  transport: ["travel", "bus", "train", "cab", "taxi", "ride"],
  entertainment: ["movie", "movies", "cinema", "netflix", "spotify"],
};

function normalizedCategory(category) {
  if (!category) return "others";

  const clean = category.trim().toLowerCase();

  // Check direct synonym mapping first
  for (const [key, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (key === clean || synonyms.includes(clean)) {
      return key;
    }
  }

  // Otherwise use fuzzy matching
  const match = stringSimilarity.findBestMatch(clean, KNOWN_CATEGORIES);

  if (match.bestMatch.rating > 0.6) {
    return match.bestMatch.target;
  }

  return clean;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00C49F",
  "#FF8042",
];

export default function ExpenseChart({ expenses, darkMode }) {
  // Group by category
  const data = Object.values(
    expenses.reduce((acc, curr) => {
      const normalized = normalizedCategory(curr.category);
      if (!acc[normalized]) {
        acc[normalized] = {
          name: normalized,
          value: 0,
        };
      }
      acc[normalized].value += Number(curr.amount);
      return acc;
    }, {})
  ).map((item) => ({
    ...item,
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
  }));

  if (data.length === 0) return null;

  return (
    <div className={`mt-6 p-4 ${darkMode ? "bg-blue-100": "bg-white"} shadow rounded`}>
      <h2 className="text-lg font-semibold mb-4">📊 Expense Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
