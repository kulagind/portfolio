'use client';

import { useState } from 'react';
import { FileSystem } from '../models/file-system';
import { Terminal } from '../shared/terminal/terminal';
import { initFileItems } from '../shared/utils/init-file-items';

export default function Home() {
  const [fs] = useState<FileSystem>(new FileSystem(initFileItems()));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Terminal fs={fs} selftypingMessages={['Wake up, Neo!', 'Time to code!']} />
    </main>
  );
}
