import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Live-Docs",
  description: "Collaborative Docs",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#3371FF", fontSize: "16px" },
        layout: {
          logoImageUrl: "/assets/images/logo.png",
          logoPlacement: "inside",
        },
      }}
    >
      <html lang="en">
        <body className="antialiased">
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
