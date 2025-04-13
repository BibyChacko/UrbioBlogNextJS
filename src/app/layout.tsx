import { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '@/components/providers/ThemeRegistry';
import { StoreProvider } from '@/components/providers/StoreProvider';

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urbio LED",
  description: "Smart lighting solutions for modern spaces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <StoreProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
