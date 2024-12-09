import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

const QRCodeScanner = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [volunteerInfo, setVolunteerInfo] = useState<any | null>(null);
  const [borrowedItems, setBorrowedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"borrow" | "return" | null>(null);

  const handleScan = async (detectedCodes: Array<{ rawValue: string }>) => {
    if (detectedCodes.length > 0) {
      try {
        const scannedData = JSON.parse(detectedCodes[0].rawValue);
        const volunteerId = scannedData.id;
        setScannedResult(volunteerId);
        setError(null);

        try {
          const response = await axios.get(
            `${API_BASE_URL}/scan/volunteer/${volunteerId}`
          );
          setVolunteerInfo(response.data);
        } catch (error) {
          console.error("Error fetching volunteer information:", error);
          setError("Error fetching volunteer information.");
        }
      } catch (parseError) {
        console.error("Error parsing QR code data:", parseError);
        setError("Invalid QR code data.");
      }
    }
  };

  const handleError = (scanError: any) => {
    console.error("Scanning error:", scanError);
    setError("Error scanning QR code.");
  };

  const handleBorrow = async () => {
    setMode("borrow");
    try {
      const itemCode = prompt("Enter the barcode of the item:");
      const qtyInput = prompt("Enter the quantity to borrow:");
      const qty = qtyInput ? parseInt(qtyInput, 10) : NaN;

      if (!itemCode || isNaN(qty) || qty <= 0) {
        setError("Invalid item code or quantity.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/volunteer/${scannedResult}/borrow`,
        {
          item_code: itemCode,
          qty: qty,
        }
      );

      alert("Item borrowed successfully!");
      console.log("Borrow response:", response.data);
    } catch (error) {
      console.error("Error borrowing item:", error);
      setError("Error borrowing item.");
    }
  };

  const handleReturn = async () => {
    setMode("return");
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
              handleScan([{ rawValue: code.data }]);
            } else {
              setError("Unable to decode QR code from the image.");
            }
          }
        };
        img.src = event.target?.result as string;
      };

      reader.readAsDataURL(file);
    },
  });

  return (
    <div className="relative bg-white border-2 border-gray-300 p-7 w-11/12 sm:w-11/12 md:w-10/12 lg:w-3/4 xl:w-1/3 flex flex-col items-center justify-center rounded-lg shadow-lg mt-20 mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Volunteer Scanner</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {volunteerInfo ? (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          <strong>Volunteer Information:</strong>
          <p>Name: {volunteerInfo.name}</p>
          <p>Khmer Name: {volunteerInfo.kh_name}</p>
          <p>Team: {volunteerInfo.team}</p>
          <p>Khmer Team: {volunteerInfo.kh_team}</p>
          <p>ID: {volunteerInfo.id}</p>
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
        <>
          <div className="mb-6">
            <div>
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: "environment",
                }}
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">
              Scan QR Code from Image
            </h2>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-blue-500 rounded p-4 text-center bg-blue-50 cursor-pointer hover:bg-blue-100"
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                Drag & drop an image with a QR code here, or{" "}
                <span className="underline">click to select a file</span>.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QRCodeScanner;
