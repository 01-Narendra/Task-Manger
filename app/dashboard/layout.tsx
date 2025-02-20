"use client";

import Sidebar from "./_components/sidebar";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-row gap-10 py-4 w-full px-4">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}