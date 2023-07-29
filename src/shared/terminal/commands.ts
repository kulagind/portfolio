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
    return `
      There is list of commands you can use, to navigate:<br>
        help - show list of commands,<br>
        ls [dir] - list of files,<br>
        cd [dir] - change directory,<br>
        cat [dir] - show file content,<br>
        clear - clear workspace,<br>
        history - list of previous commands
    `;
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
};