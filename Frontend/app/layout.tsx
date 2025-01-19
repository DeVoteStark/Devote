import type { Metadata } from "next";
import "./globals.css";
import { StarknetProvider } from "@/components/providers/starknet-provider";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StarknetProvider>
        <body>{children}</body>
      </StarknetProvider>
    </html>
  );
}
