'use client';

import { signal } from '@preact/signals-core';

export type Theme = 'dark' | 'light';
export const THEME_ATTR = 'data-theme';
export const themeSignal = signal<Theme>(
  'dark',
  // validityTheme(typeof window === 'undefined'
  //   ? 'dark'
  //   : (
  //     localStorage.getItem(THEME_ATTR) as Theme ?? ''
  //   ),
  // ) ?? 'dark',
);
export const themeChanged = signal(false);

export function validityTheme(v: string): Theme | null {
  if (v && (
    v === 'light' || v === 'dark'
  )) {
    return v;
  }
  return null;
}