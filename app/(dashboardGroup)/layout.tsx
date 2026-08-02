import { CustomerSidebar } from "@/fearture/customer/components/customer-sidebar";
import DashboardSidebar from "@/fearture/dashboard/components/DashboardSidebar";
import { SiteFooter } from "@/components/site-footer";
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
      <main className="flex min-h-screen flex-col pt-20 lg:ml-80">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </main>
    </div>
  );
}