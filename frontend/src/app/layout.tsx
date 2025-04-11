import "./globals.css";
import Providers from "./providers";
import { ReactNode } from "react";

export const metadata = {
  title: "Land Registry",
  description: "Decentralized Land Registry on Blockchain",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
