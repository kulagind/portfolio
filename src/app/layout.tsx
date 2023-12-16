'use client';

import { effect } from '@preact/signals-core';
import html2canvas from 'html2canvas';
import { JetBrains_Mono } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import './globals.css';
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
              const container = document.createElement('div');
              container.style.position = 'fixed';
              container.style.width = '100vw';
              container.style.height = '100vh';
              container.style.left = '0';
              container.style.top = '0';
              container.style.overflow = 'hidden';

              canvas.style.position = 'fixed';
              canvas.style.width = '100vw';
              canvas.style.height = '100vh';
              canvas.style.left = '0';
              canvas.style.top = '0';

              container.append(canvas);

              requestAnimationFrame(() => {
                document.body.appendChild(container);
              });
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
