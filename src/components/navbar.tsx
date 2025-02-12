import { useState } from "react";
import { Home, Info, Scan, Menu } from "lucide-react";
import { Drawer } from "../components/drawer.jsx";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-primary-foreground p-4 fixed top-0 w-full z-10 font-kamtumruy ">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl flex items-center space-x-1 font-medium"
        >
          <img src="cbflogo_full.png" alt="Logo" className="h-12 w-12" />
          <span>បញ្ជីអីវ៉ាន់</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <NavLink
            to="/"
            icon={<span className="material-icons">dashboard</span>}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/scan"
            icon={<span className="material-icons">qr_code_scanner</span>}
          >
            Scan
          </NavLink>
          <NavLink
            to="/item"
            icon={<span className="material-symbols-outlined">category</span>}
          >
            Item
          </NavLink>
          {/* <NavLink
            to="/contact"
            icon={<span className="material-symbols-outlined">category</span>}
          >
            Contact
          </NavLink> */}
        </div>
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col space-y-4">
          <MobileNavLink
            to="/"
            icon={<Home className="h-4 w-4" />}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </MobileNavLink>
          <MobileNavLink
            to="/scan"
            icon={<Scan className="h-4 w-4" />}
            onClick={() => setIsOpen(false)}
          >
            Scan
          </MobileNavLink>
          <MobileNavLink
            to="/item"
            icon={<Info className="h-4 w-4" />}
            onClick={() => setIsOpen(false)}
          >
            Item
          </MobileNavLink>
        </div>
      </Drawer>
    </nav>
  );
}

function NavLink({
  to,
  children,
  icon,
}: {
  to: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-1 hover:text-secondary transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({
  to,
  children,
  icon,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-md transition-colors"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
