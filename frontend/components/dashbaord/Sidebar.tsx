/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Mail,
  FileText,
  Settings,
  LogOut,
  X,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
  { name: "Skills", href: "/dashboard/skills", icon: Cpu },
  { name: "Profile", href: "/dashboard/profile", icon: Mail },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-900/30 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#FFFDF9] border-r border-orange-200/70 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top: Logo & Nav */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-900"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>
                RAFI<span className="text-orange-600">.</span>
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[10px] text-neutral-500 hover:bg-orange-50 hover:text-orange-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-sm font-medium transition-all ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 font-semibold"
                      : "text-neutral-600 hover:bg-orange-50/70 hover:text-orange-600"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-orange-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-[12px] text-xs font-medium text-neutral-600 hover:bg-orange-50/60 hover:text-orange-600 transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => {
              // Add logout logic here
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-sm font-medium text-red-600 hover:bg-red-50/80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}