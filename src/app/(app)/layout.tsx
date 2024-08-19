import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppProvider from "@/context/sessionProvider";

import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feedback Application",
  description: "Freelancing Project Provided",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <AppProvider>
      <body 
        className={inter.className}
      >
        {children}
        <Toaster />
      </body>

      </AppProvider>
      
    </html>
  );
}
