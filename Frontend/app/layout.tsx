
import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/components/providers/starknet-provider";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "Devote",
  description: "Decentralized voting system on Starknet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StarknetProvider>
        <body>
          <ToastProvider >
            {children}
          </ToastProvider>
          {/* <Toaster /> */}
        </body>
      </StarknetProvider>
    </html>
  );
}
