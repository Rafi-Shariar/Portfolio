"use client";

import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import Sidebar from "@/components/dashbaord/Sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-neutral-900 flex">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#FFFDF9]/85 backdrop-blur-md border-b border-orange-200/60 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-[10px] text-neutral-700 hover:bg-orange-50 hover:text-orange-600 lg:hidden transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-neutral-800 tracking-tight">
              Dashboard Control Panel
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 rounded-[12px] text-neutral-600 hover:bg-orange-50 hover:text-orange-600 border border-orange-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-[10px] bg-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              RS
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}