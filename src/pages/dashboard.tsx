import React, { useEffect, useState } from "react";
import DataTable from "../components/volunteer_borrow";
import { API_BASE_URL } from "../api/config";

const InventoryPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/borrowed-items`, {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(
          (error as any).message || "An error occurred while fetching data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-kamtumruy">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font text-gray-900 sm:text-3xl mb-6 mt-20">
            អីវ៉ាន់ដែលបានខ្ចី
          </h1>
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              <DataTable data={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
