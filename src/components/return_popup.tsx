"use client";

import { XIcon } from "lucide-react";
import React, { useState } from "react";

interface ReturnPopupProps {
  borrowedItems: Array<{
    transaction_id: string;
    item_code: string;
    item_name: string;
    qty_borrowed: number;
    borrow_time: string;
  }>;
  onClose: () => void;
  onReturnItem: (
    transactionId: string,
    status: string,
    qtyReturned: number
  ) => void;
}

const ReturnPopup: React.FC<ReturnPopupProps> = ({
  borrowedItems,
  onClose,
  onReturnItem,
}) => {
  const [selectedItem, setSelectedItem] = useState<{
    transaction_id: string;
    status: string;
    qty_borrowed: number;
  } | null>(null);
  const [qtyToReturn, setQtyToReturn] = useState<number>(0);

  const handleActionClick = (
    transaction_id: string,
    status: string,
    qty_borrowed: number
  ) => {
    setSelectedItem({ transaction_id, status, qty_borrowed });
    setQtyToReturn(status === "returned" ? qty_borrowed : 0);
  };

  const handleConfirmAction = () => {
    if (selectedItem) {
      onReturnItem(
        selectedItem.transaction_id,
        selectedItem.status,
        qtyToReturn
      );
      setSelectedItem(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Return Items</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Item Code</th>
                <th className="border px-4 py-2 text-left">Item Name</th>
                <th className="border px-4 py-2 text-right">Quantity</th>
                <th className="border px-4 py-2 text-left hidden md:table-cell">
                  Borrow Time
                </th>
                <th className="border px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowedItems.map((item) => (
                <tr key={item.transaction_id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.item_code}</td>
                  <td className="border px-4 py-2">{item.item_name}</td>
                  <td className="border px-4 py-2 text-right">
                    {item.qty_borrowed}
                  </td>
                  <td className="border px-4 py-2 hidden md:table-cell">
                    {new Date(item.borrow_time).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    <div className="space-x-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded text-sm"
                        onClick={() =>
                          handleActionClick(
                            item.transaction_id,
                            "returned",
                            item.qty_borrowed
                          )
                        }
                      >
                        Return
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded text-sm"
                        onClick={() =>
                          handleActionClick(
                            item.transaction_id,
                            "used up",
                            item.qty_borrowed
                          )
                        }
                      >
                        Used Up
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded text-sm"
                        onClick={() =>
                          handleActionClick(
                            item.transaction_id,
                            "lost",
                            item.qty_borrowed
                          )
                        }
                      >
                        Lost
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedItem.status === "returned"
                ? "Return Items"
                : selectedItem.status === "used up"
                ? "Mark as Used Up"
                : "Mark as Lost"}
            </h3>
            <div className="mb-4">
              <label
                htmlFor="qtyToReturn"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {selectedItem.status === "returned"
                  ? "Quantity to Return:"
                  : selectedItem.status === "used up"
                  ? "Quantity Used Up:"
                  : "Quantity Lost:"}
              </label>
              <input
                id="qtyToReturn"
                type="number"
                min={0}
                max={selectedItem.qty_borrowed}
                value={qtyToReturn}
                onChange={(e) => setQtyToReturn(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnPopup;
