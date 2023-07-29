import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import React from 'react';
import './globals.css';

const font = JetBrains_Mono({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
      </body>
    </html>
  );
}
