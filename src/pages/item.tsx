import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";

interface Item {
  category_id: string;
  item_name: string;
  qty: number;
  unit: string;
  code: string;
}

export default function ItemTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Item | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetch(`${API_BASE_URL}/items`)
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleSort = (column: keyof Item) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredItems = sortedItems.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-4 mt-16 font-kamtumruy">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Inventory Items</h1>
      <input
        type="text"
        placeholder="Search by item name or code..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      />
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left table-auto border-collapse text-lg">
          <thead>
            <tr className="bg-gray-200">
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("code")}
              >
                Code{" "}
                {sortColumn === "code" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 w-[40%] cursor-pointer"
                onClick={() => handleSort("item_name")}
              >
                Item Name{" "}
                {sortColumn === "item_name" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("qty")}
              >
                Quantity{" "}
                {sortColumn === "qty" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSort("unit")}
              >
                Unit{" "}
                {sortColumn === "unit" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.code}
                className="transition-colors hover:bg-gray-50 border-b"
              >
                <td className="px-4 py-2 text-left">{item.code}</td>
                <td className="px-4 py-2">{item.item_name}</td>
                <td className="px-4 py-2 text-left">{item.qty}</td>
                <td className="px-4 py-2 text-left">{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredItems.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No items found.</p>
      )}
    </div>
  );
}
