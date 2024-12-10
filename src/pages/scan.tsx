import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

const QRCodeScanner = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [volunteerInfo, setVolunteerInfo] = useState<any | null>(null);
  const [borrowedItems, setBorrowedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"borrow" | "return" | null>(null);
  const [scanningMode, setScanningMode] = useState<"volunteer" | "item" | null>(
    "volunteer"
  );
  const [, setCurrentItem] = useState<{
    code: string;
    qty: number;
  } | null>(null);

  const handleScan = async (detectedCodes: Array<{ rawValue: string }>) => {
    if (detectedCodes.length > 0) {
      const rawValue = detectedCodes[0].rawValue;

      if (scanningMode === "volunteer") {
        // Handle Volunteer QR Code
        try {
          const scannedData = JSON.parse(rawValue);
          const volunteerId = scannedData.id;
          setScannedResult(volunteerId);
          setError(null);

          try {
            const response = await axios.get(
              `${API_BASE_URL}/scan/volunteer/${volunteerId}`
            );
            setVolunteerInfo(response.data);
            setScanningMode(null); // Stop scanning
          } catch (error) {
            console.error("Error fetching volunteer information:", error);
            setError("Error fetching volunteer information.");
          }
        } catch (parseError) {
          console.error("Error parsing QR code data:", parseError);
          setError("Invalid QR code data.");
        }
      } else if (scanningMode === "item") {
        // Handle Item Barcode
        try {
          setCurrentItem({ code: rawValue, qty: 0 }); // Assume qty is set later
          const qtyInput = prompt(`Enter quantity for item ${rawValue}:`);
          const qty = qtyInput ? parseInt(qtyInput, 10) : NaN;

          if (isNaN(qty) || qty <= 0) {
            setError("Invalid quantity.");
            return;
          }

          // Make Borrow Request
          const response = await axios.post(
            `${API_BASE_URL}/volunteer/${scannedResult}/borrow`,
            {
              item_code: rawValue,
              qty: qty,
            }
          );

          alert("Item borrowed successfully!");
          console.log("Borrow response:", response.data);
          setScanningMode(null); // Stop scanning after borrow
        } catch (error) {
          console.error("Error borrowing item:", error);
          setError("Error borrowing item.");
        }
      }
    }
  };

  const handleError = (scanError: any) => {
    console.error("Scanning error:", scanError);
    setError("Error scanning QR code.");
  };

  const handleBorrow = () => {
    setMode("borrow");
    setScanningMode("item");
  };

  const handleReturn = async () => {
    setMode("return");
    setScanningMode(null); // Stop scanning
    try {
      const response = await axios.get(
        `${API_BASE_URL}/volunteer/${scannedResult}/borrowed-items`
      );
      setBorrowedItems(response.data.borrowed_items);
    } catch (error) {
      console.error("Error fetching borrowed items:", error);
      setError("Error fetching borrowed items.");
    }
  };

  const handleReturnItem = async (transactionId: string, qty: number) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/volunteer/${scannedResult}/return`,
        {
          items: [
            {
              transaction_id: transactionId,
              qty_returned: qty,
            },
          ],
        }
      );

      alert("Item returned successfully!");
      console.log("Return response:", response.data);
      handleReturn(); // Refresh the borrowed items list
    } catch (error) {
      console.error("Error returning item:", error);
      setError("Error returning item.");
    }
  };

  return (
    <div className="relative bg-white border-2 border-gray-300 p-7 w-11/12 sm:w-11/12 md:w-10/12 lg:w-3/4 xl:w-1/3 flex flex-col items-center justify-center rounded-lg shadow-lg mt-20 mx-auto font-kamtumruy">
      <h1 className="text-2xl text-center mb-4">
        ស្គែនកាតអ្នកស្ម័គ្រចិត្ត
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {volunteerInfo ? (
        <div className="mb-4 p-3 text-xl bg-blue-100 text-blue-700 rounded">
          <strong>Volunteer Information:</strong>
          <p>ID: {volunteerInfo.id}</p>
          <p>Khmer Name: {volunteerInfo.kh_name}</p>
          <p>Khmer Team: {volunteerInfo.kh_team}</p>
          <p>Name: {volunteerInfo.name}</p>
          <p>Team: {volunteerInfo.team}</p>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleBorrow}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Borrow
            </button>
            <button
              onClick={handleReturn}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Return
            </button>
          </div>
          {mode === "return" && borrowedItems.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Borrowed Items:</h3>
              <ul>
                {borrowedItems.map((item) => (
                  <li key={item.transaction_id} className="mb-2">
                    <strong>{item.item_name}</strong> (Qty: {item.qty_borrowed}){" "}
                    <button
                      onClick={() =>
                        handleReturnItem(item.transaction_id, item.qty_borrowed)
                      }
                      className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Return
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* <h2 className="text-lg font-medium mb-4">Scan Volunteer QR Code</h2> */}
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{
              facingMode: "environment",
            }}
            formats={["qr_code", "code_128"]} // Specify the formats to scan
          />
        </div>
      )}

      {scanningMode === "item" && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Scan Item Barcode</h2>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{
              facingMode: "environment",
            }}
            formats={["qr_code", "code_128"]} // Specify the formats to scan
          />
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
