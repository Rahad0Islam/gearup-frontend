import { CustomerSidebar } from "@/fearture/customer/components/customer-sidebar";
import DashboardSidebar from "@/fearture/dashboard/components/DashboardSidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="pt-20 lg:ml-80">
        {children}
      </main>
    </div>
  );
}