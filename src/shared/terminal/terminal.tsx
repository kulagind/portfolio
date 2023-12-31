'use client';

import React, { useState } from 'react';
import { v4 } from 'uuid';
import { FileSystem } from '../../models/file-system';
import { FsError } from '../utils/fs-error';
import { COMMANDS, CommandsHistory } from './commands';
import { History } from './history';
import { Input } from './input';
import './terminal.css';

export function Terminal(props: { fs: FileSystem, selftypingMessages: string[] }) {
  const [path, setPath] = useState(props.fs.getCurrentPath());
  const [history, setHistory] = useState<CommandsHistory[]>([]);
  const [autocompletedCommand, setAutocompletedCommand] = useState<string[]>([]);
  const [usedCommands, setUsedCommands] = useState<string[]>([]);

  function handleCommand(command: string, executable: string = '') {
    let output = '';
    try {
      const [utilName, ...args] = executable?.split(' ');
      const util = COMMANDS[utilName];
      switch (true) {
        case utilName === 'history':
          setHistory((prev) => [...prev, {command, output: usedCommands.join('<br>'), key: v4()}]);
          break;
        case utilName === 'clear':
          setHistory([]);
          break;
        case !!util:
          const result = util(
            props.fs, args,
          );
          if (typeof result === 'string') {
            output = result;
            setPath(props.fs.getCurrentPath());
            setHistory((prev) => [...prev, {command, output, key: v4()}]);
          } else {
            result.then((v) => {
              output = v;
              setPath(props.fs.getCurrentPath());
              setHistory((prev) => [...prev, {command, output, key: v4()}]);
            });
          }
          break;
        default:
          if (executable) {
            output = `Command "${utilName}" doesn't exist<br>Type 'help' to know more`;
          }
          setHistory((prev) => [...prev, {command, output, key: v4()}]);
          break;
      }
    } catch (e) {
      if (e instanceof FsError) {
        output = e.message;
      } else {
        output = 'Unexpected error';
      }
      setHistory((prev) => [...prev, {command, output, key: v4()}]);
    } finally {
      requestAnimationFrame(() => {
        window.scroll(0, document.body.scrollHeight);
      });
    }
    if (executable) {
      setUsedCommands((prev) => [...prev, executable]);
    }
  }

  function handleAutocomplete(executable: string): void {
    const [_, ...args] = executable.split(' ');
    setAutocompletedCommand(props.fs.getAutocompleteOptions(args?.[0]));
  }

  return (
    <div className="terminal">
      <History history={history} />
      <Input
        path={path}
        executeCommand={handleCommand}
        autocomplete={handleAutocomplete}
        autocompletedCommand={autocompletedCommand}
        usedCommands={usedCommands}
        selftypingMessages={props.selftypingMessages}
      />
    </div>
  );
}
