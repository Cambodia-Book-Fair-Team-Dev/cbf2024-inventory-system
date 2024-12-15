import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import QRCodeScanner from "./pages/scan";
import ItemTable from "./pages/item";
import InventoryPage from "./pages/dashboard";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <div>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<InventoryPage />} />
        <Route path="/scan" element={<QRCodeScanner />} />
        <Route path="/item" element={<ItemTable />} />
        <Route path="/contact" element={<QRCodeScanner />} />
        <Route path="/about" element={<QRCodeScanner />} />
      </Routes>
    </div>
  );
}

export default App;
