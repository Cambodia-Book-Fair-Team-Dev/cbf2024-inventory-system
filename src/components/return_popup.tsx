import { XIcon } from "lucide-react";
import React from "react";

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <span>Return Items</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 w-1/6">
                  Item Code
                </th>
                <th className="border border-gray-200 px-4 py-2">Item Name</th>
                <th className="border border-gray-200 px-4 py-2 text-right w-1/6">
                  Quantity
                </th>
                <th className="border border-gray-200 px-4 py-2 hidden md:table-cell">
                  Borrow Time
                </th>
                <th className="border border-gray-200 px-4 py-2 text-right w-1/6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {borrowedItems.map((item) => (
                <tr key={item.transaction_id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">
                    {item.item_code}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {item.item_name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                    {item.qty_borrowed}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 hidden md:table-cell">
                    {new Date(item.borrow_time).toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right space-y-2">
                    <button
                      onClick={() =>
                        onReturnItem(
                          item.transaction_id,
                          "returned",
                          item.qty_borrowed
                        )
                      }
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded"
                    >
                      Return
                    </button>
                    <button
                      onClick={() =>
                        onReturnItem(item.transaction_id, "used up", 0)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded"
                    >
                      Used Up
                    </button>
                    <button
                      onClick={() =>
                        onReturnItem(item.transaction_id, "lost", 0)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded"
                    >
                      Lost
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReturnPopup;
