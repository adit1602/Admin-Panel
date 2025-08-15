// src/components/layout/DashboardLayout.tsx
import React from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
}

export function DashboardLayout({
  children,
  activeMenu,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar activeMenu={activeMenu} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
