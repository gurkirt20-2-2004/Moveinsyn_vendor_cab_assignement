import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Ensure path matches your folder structure

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MoveInSync Assignment",
  description: "Vehicle Management Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-slate-50">
          {/* Sidebar: Fixed width */}
          <Sidebar />
          
          {/* Main Content Area: Pushed right by sidebar width */}
          <main className="flex-1 ml-64 flex flex-col">
            {/* Content gets injected here */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}