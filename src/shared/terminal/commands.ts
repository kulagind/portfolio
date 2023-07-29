import { FileSystem } from '../../models/file-system';

export interface CommandsHistory {
  key: string;
  command: string;
  output: string;
}

export const COMMANDS: {
  [key: string]: (
    fs: FileSystem,
    args: string[],
  ) => string
} = {
  'help': (fs, args) => {
    return 'help text';
  },
  'ls': (fs, args) => {
    return fs.getList(args[0]).map(i => `${i.name}${i.isDir ? '/' : ''}`).join('<br>') || '<-- Empty directory -->';
  },
  'cd': (fs, args) => {
    fs.changeDir(args[0]);
    return '';
  },
  'cat': (fs, args) => {
    return '';
  },
  'history': (fs, args) => {
    return '';
  },
  'clear': (current, args) => {
    return '';
  },
};