import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import QRCodeScanner from "./pages/scan";
import ItemTable from "./pages/item";


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<QRCodeScanner />} />
        <Route path="/scan" element={<QRCodeScanner />} />
        <Route path="/item" element={<ItemTable />} />
        <Route path="/contact" element={<QRCodeScanner />} />
        <Route path="/about" element={<QRCodeScanner />} />
      </Routes>
    </div>
  );
}

export default App;
