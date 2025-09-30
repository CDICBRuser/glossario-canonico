import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glossário Canônico",
  description: "Um glossário de termos e definições do direito canônico.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}