'use client';

import { effect } from '@preact/signals-core';
import html2canvas from 'html2canvas';
import { JetBrains_Mono } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import './globals.css';
import { animateTheme } from '../shared/utils/animate-theme';
import { Theme, THEME_ATTR, themeChanged, themeSignal } from '../shared/utils/theme';

const font = JetBrains_Mono({subsets: ['latin']});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<Theme>(themeSignal.value);

  useEffect(() => {
    themeSignal.value = theme;

    effect(() => {
      console.log(`theme changed: ${themeSignal.value}`);
      if (themeChanged.peek()) {
        setTimeout(() => {
          html2canvas(document.body)
            .then((canvas) => {
              animateTheme(canvas);
            })
            .then(() => {
              setTheme(themeSignal.value ?? 'dark');
              localStorage.setItem(THEME_ATTR, themeSignal.value ?? 'dark');
            });
        });
      }

      themeChanged.value = true;
    });
  }, []);

  return (
    <html lang="en">
      <body className={`${font.className}`} data-theme={theme}>
        {children}
      </body>
    </html>
  );
}
