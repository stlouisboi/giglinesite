import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GigLine Compliance — Safety Walkthroughs & Gap Checks",
  description:
    "Safety walkthroughs, documentation reviews, and incident response for small shops, warehouses, fleets, and contractors. Serving the Triad and surrounding region.",
  keywords:
    "OSHA compliance, safety walkthrough, gap check, small business safety, warehouse safety, fleet compliance",
  openGraph: {
    title: "GigLine Compliance",
    description:
      "Safety Walkthroughs & Gap Checks for Small Operations. Find your gaps before OSHA does.",
    url: "https://www.giglinecompliance.com",
    siteName: "GigLine Compliance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-primary text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
