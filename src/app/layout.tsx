import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  metadataBase: new URL("https://watanabegenki.com"),
  title: "Genki Watanabe",
  description: "Personal website of Genki Watanabe",
  openGraph: {
    title: "Genki Watanabe",
    description: "Personal website of Genki Watanabe",
    url: "https://watanabegenki.com",
    siteName: "Genki Watanabe",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genki Watanabe",
    description: "Personal website of Genki Watanabe",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
