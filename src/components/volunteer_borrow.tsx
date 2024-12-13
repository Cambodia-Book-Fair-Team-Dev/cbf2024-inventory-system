import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search, Filter, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TableData {
  item_code: string;
  volunteer_name: string;
  team: string;
  item_name: string;
  qty_borrowed: number;
  borrow_time: string;
  return_time: string | null;
  status: string;
}

const Table = ({ data }: { data: TableData[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof TableData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleSort = (column: keyof TableData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((item) => filterTeam === "" || item.team === filterTeam)
      .filter((item) => filterStatus === "" || item.status === filterStatus)
      .filter(
        (item) =>
          selectedDate === "" || item.borrow_time.startsWith(selectedDate)
      )
      .sort((a, b) => {
        if (sortColumn === null) {
          return 0;
        }
        if (a[sortColumn] == null || b[sortColumn] == null) {
          return 0;
        }
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    data,
    searchTerm,
    sortColumn,
    sortDirection,
    filterTeam,
    filterStatus,
    selectedDate,
  ]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-l font-kamtumruy">
      <div className="p-6 space-y-4">
        {/* <h2 className="text-2xl font-bold text-gray-800">
          Inventory Management
        </h2> */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative">
              <select
                className="appearance-none w-full md:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
              >
                <option value="">All Teams</option>
                <option value="Core Team">Core Team</option>
                <option value="Event Facilitator">Event Facilitator</option>
                <option value="Operation">Operation</option>
                <option value="Procurement">Procurement</option>
                <option value="Event Facilitator">Sale</option>
                <option value="Public Relations">Public Relations</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <select
                className="appearance-none w-full md:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
                <option value="lost">Lost</option>
                <option value="used up">Uesd up</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="date"
                className="appearance-none w-full md:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wider">
              {[
                "item_code",
                "volunteer_name",
                "team",
                "item_name",
                "qty_borrowed",
                "borrow_time",
                "return_time",
                "status",
              ].map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort(key as keyof TableData)}
                >
                  <div className="flex items-center">
                    {key.replace(/_/g, " ")}
                    {sortColumn === key && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.item_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.volunteer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.team}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.item_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.qty_borrowed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(item.borrow_time), "yyyy-MM-dd HH:mm:ss")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.return_time
                    ? format(new Date(item.return_time), "yyyy-MM-dd HH:mm:ss")
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-lg leading-5 rounded-full ${
                      item.status === "borrowed"
                        ? "bg-yellow-100 text-yellow-800"
                        : item.status === "lost"
                        ? "bg-red-100 text-red-800"
                        : item.status === "used up"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.status === "lost"
                      ? "បាត់"
                      : item.status === "used up"
                      ? "ប្រេីអស់"
                      : item.status === "returned"
                      ? "បានសង"
                      : item.status === "borrowed"
                      ? "កំពុងខ្ចី"
                      : item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
