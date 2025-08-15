// src/components/layout/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo3.png";

interface SidebarProps {
  activeMenu: string;
}

export function Sidebar({ activeMenu }: SidebarProps) {
  const menuItems = [
    { id: "users", label: "User Aktif", href: "/dashboard" },
    { id: "menu2", label: "Menu 2", href: "#" },
    { id: "menu3", label: "Menu 3", href: "#" },
    { id: "menu4", label: "Menu 4", href: "#" },
    { id: "menu5", label: "Menu 5", href: "#" },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <div className="flex items-center p-4 border-b">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
        <div className="mx-22">
          <svg
            className="w-5 h-5 mr-2 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={`block px-4 py-2 rounded ${
                activeMenu === item.id
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
