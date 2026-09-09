import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export const AppShell: React.FC = () => {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <TopNav />
        <main className="relative pt-16 flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
