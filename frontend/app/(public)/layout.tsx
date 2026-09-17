import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import React, { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer/>
    </div>
  );
};

export default PublicLayout;
