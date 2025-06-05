import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChromaDB Viewer | Beautiful Vector Database Explorer",
  description: "A modern, user-friendly interface for exploring and visualizing your ChromaDB vector database collections with beautiful UI, sorting, and filtering capabilities.",
  keywords: ["ChromaDB", "vector database", "embeddings", "AI", "data visualization", "database explorer", "vector search"],
  authors: [{ name: "Huzaifa Saleem" }],
  openGraph: {
    title: "ChromaDB Viewer | Beautiful Vector Database Explorer",
    description: "Explore your ChromaDB collections with a beautiful, interactive UI",
    url: "https://chroma-viewer.vercel.app",
    siteName: "ChromaDB Viewer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChromaDB Viewer Interface"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChromaDB Viewer | Beautiful Vector Database Explorer",
    description: "Explore your ChromaDB collections with a beautiful, interactive UI",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
