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

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="hidden sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 bg-gray-100">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="h-6 bg-gray-300 rounded"></div>
        ))}
      </div>
      {[...Array(5)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 border-b border-gray-200"
        >
          {[...Array(8)].map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-kamtumruy mt-5">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 mt-10 sm:mt-20">
            Inventory
          </h1>
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            {loading ? (
              <div className="overflow-x-auto">
                <SkeletonLoader />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable data={data} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
