import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";
import { API_BASE_URL } from "../api/config";
import { XIcon } from "lucide-react";

interface PopupScannerProps {
  onScan: (detectedCodes: Array<{ rawValue: string }>) => void;
  onError: (error: any) => void;
  onClose: () => void;
  onItemInfoFetched: (itemInfo: any) => void;
  onBorrow: (itemCode: string, quantity: number) => void;
}

const PopupScanner: React.FC<PopupScannerProps> = ({
  onScan,
  onError,
  onClose,
  onItemInfoFetched,
  onBorrow,
}) => {
  const [itemInfo, setItemInfo] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);

  const handleScan = async (detectedCodes: Array<{ rawValue: string }>) => {
    if (detectedCodes.length > 0) {
      const rawValue = detectedCodes[0].rawValue;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/scan/item/${rawValue}`
        );
        setItemInfo(response.data);
        onItemInfoFetched(response.data);
      } catch (error) {
        console.error("Error fetching item information:", error);
        onError("Error fetching item information.");
      }
    }
  };

  const handleBorrowClick = () => {
    if (itemInfo && quantity && quantity > 0) {
      onBorrow(itemInfo.code, quantity);
    } else {
      onError("Please enter a valid quantity before borrowing.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 p-4">
          <h2 className="text-2xl font-bold">ស្គែន​ Code អីវ៉ាន់</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {!itemInfo ? (
            <div className="aspect-square">
              <Scanner
                onScan={handleScan}
                onError={onError}
                constraints={{
                  facingMode: "environment",
                }}
                formats={["qr_code", "code_128"]}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Item Information:</h3>
              <div className="grid grid-cols-2 gap-2 text-lg">
                <p className="font-semibold">Name:</p>
                <p>{itemInfo.item_name}</p>
                <p className="font-semibold">Category:</p>
                <p>{itemInfo.category_id}</p>
                <p className="font-semibold">Available Quantity:</p>
                <p>
                  {itemInfo.qty} {itemInfo.unit}
                </p>
                <p className="font-semibold">Code:</p>
                <p>{itemInfo.code}</p>
              </div>
              <div className="mt-4">
                <label htmlFor="quantity" className="block font-medium mb-2">
                  Enter Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={itemInfo.qty}
                  value={quantity || ""}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleBorrowClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Borrow Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupScanner;
