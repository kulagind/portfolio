'use client';

import axios from 'axios';
import { FileSystem } from '../../models/file-system';
import { themeSignal, validityTheme } from '../utils/theme';

export interface CommandsHistory {
  key: string;
  command: string;
  output: string;
}

export const COMMANDS: {
  [key: string]: (
    fs: FileSystem,
    args: string[],
  ) => string | Promise<string>
} = {
  'help': (fs, args) => {
    return `
      There is list of commands you can use, to navigate:<br>
        help - show list of commands,<br>
        ls [dir] - list of files,<br>
        cd [dir] - change directory,<br>
        cat [dir] - show file content,<br>
        clear - clear workspace,<br>
        history - list of previous commands,<br>
        switch [dark | light] - switch styling
    `;
  },
  'ls': (fs, args) => {
    return fs.getList(args[0]).map(i => `${i.name}${i.isDir ? '/' : ''}`).join('<br>') || '<-- Empty directory -->';
  },
  'cd': (fs, args) => {
    fs.changeDir(args[0]);
    return '';
  },
  'cat': async (fs, args) => {
    const path = fs.getContentRealPath(args[0]);
    const {data} = await axios.get(path);
    return data;
  },
  'theme': (_, args) => {
    const theme = validityTheme(args[0]);
    if (!theme) {
      return `Value must be either 'light' or 'dark'`;
    }
    themeSignal.value = theme;
    return `Switched to ${theme}`;
  },
};