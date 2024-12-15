import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { API_BASE_URL } from "../api/config";
import PopupScanner from "../components/barcode_popup";
import ReturnPopup from "../components/return_popup";
import VolunteerInfo from "../components/volunteer_info";
import toast from "react-hot-toast";

const QRCodeScanner: React.FC = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [volunteerInfo, setVolunteerInfo] = useState<any | null>(null);
  const [borrowedItems, setBorrowedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"borrow" | "return" | null>(null);
  const [scanningMode, setScanningMode] = useState<"volunteer" | "item" | null>(
    "volunteer"
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReturnPopupOpen, setIsReturnPopupOpen] = useState(false);
  const [itemInfo, setItemInfo] = useState<any | null>(null);

  const handleScan = async (detectedCodes: Array<{ rawValue: string }>) => {
    if (detectedCodes.length > 0) {
      const rawValue = detectedCodes[0].rawValue;

      if (scanningMode === "volunteer") {
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
            setScanningMode(null);
          } catch (error) {
            console.error("Error fetching volunteer information:", error);
            setError("Error fetching volunteer information.");
          }
        } catch (parseError) {
          console.error("Error parsing QR code data:", parseError);
          setError("Invalid QR code data.");
        }
      } else if (scanningMode === "item") {
        setIsPopupOpen(true);
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
    setIsPopupOpen(true);
  };

  const handleReturn = async () => {
    setMode("return");
    setScanningMode(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/volunteer/${scannedResult}/borrowed-items`
      );
      setBorrowedItems(response.data.borrowed_items);
      setIsReturnPopupOpen(true);
    } catch (error) {
      console.error("Error fetching borrowed items:", error);
      setError("Error fetching borrowed items.");
    }
  };

  const handleReturnItem = async (
    transactionId: string,
    status: string,
    qtyReturned: number
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/volunteer/${scannedResult}/return`,
        {
          items: [
            {
              transaction_id: transactionId,
              status: status,
              qty_returned: qtyReturned,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(`Item ${status} successfully!`);
      console.log("Return response:", response.data);
      handleReturn();
    } catch (error) {
      console.error(`Error ${status} item:`, error);
      setError(`Error ${status} item.`);
    }
  };

  const handleBorrowItem = async (itemCode: string, quantity: number) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/volunteer/${scannedResult}/borrow`,
        {
          item_code: itemCode,
          qty: quantity,
        }
      );
      toast.success("Item borrowed successfully!");
      console.log("Borrow response:", response.data);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error borrowing item:", error);
      setError("Error borrowing item.");
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const closeReturnPopup = () => {
    setIsReturnPopupOpen(false);
  };

  const handleItemInfoFetched = (itemInfo: any) => {
    setItemInfo(itemInfo);
  };

  const resetToScan = () => {
    setVolunteerInfo(null);
    setScannedResult(null);
    setError(null);
    setMode(null);
    setScanningMode("volunteer");
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 font-kamtumruy">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-center mb-6">
            ស្គែនកាតអ្នកស្ម័គ្រចិត្ត
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              <strong>Error:</strong> {error}
            </div>
          )}

          {volunteerInfo ? (
            <div>
              <VolunteerInfo
                volunteerInfo={volunteerInfo}
                onBorrow={handleBorrow}
                onReturn={handleReturn}
              />
              <button
                onClick={resetToScan}
                className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded"
              >
                Back to Scan
              </button>
            </div>
          ) : (
            <div className="aspect-square max-w-md mx-auto">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: "environment",
                }}
                formats={["qr_code", "code_128"]}
              />
            </div>
          )}

          {isPopupOpen && (
            <PopupScanner
              onScan={handleScan}
              onError={handleError}
              onClose={closePopup}
              onItemInfoFetched={handleItemInfoFetched}
              onBorrow={handleBorrowItem}
            />
          )}

          {isReturnPopupOpen && (
            <ReturnPopup
              borrowedItems={borrowedItems}
              onClose={closeReturnPopup}
              onReturnItem={handleReturnItem}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
