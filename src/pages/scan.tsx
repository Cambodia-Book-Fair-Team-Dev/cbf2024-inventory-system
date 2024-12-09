import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";

const QRCodeScanner = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = (detectedCodes: Array<{ rawValue: string }>) => {
    if (detectedCodes.length > 0) {
      setScannedResult(detectedCodes[0].rawValue); // Use the first detected code
      setError(null);
    }
  };

  const handleError = (scanError: any) => {
    console.error("Scanning error:", scanError);
    setError("Error scanning QR code.");
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
              setScannedResult(code.data);
              setError(null);
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

      {scannedResult && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          <strong>Scanned Result:</strong> {scannedResult}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-6">
        {/* <h2 className="text-lg font-medium mb-2">Scan QR Code via Camera</h2> */}
        <div>
          <Scanner
            onScan={handleScan} // Updated to accept an array of detected codes
            onError={handleError}
            constraints={{
              facingMode: "environment", // Use rear camera
            }}
          />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Scan QR Code from Image</h2>
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
    </div>
  );
};

export default QRCodeScanner;
