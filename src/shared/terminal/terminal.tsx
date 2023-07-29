'use client';

import React, { useState } from 'react';
import { v4 } from 'uuid';
import { FileSystem } from '../../models/file-system';
import { FsError } from '../utils/fs-error';
import { COMMANDS, CommandsHistory } from './commands';
import { History } from './history';
import { Input } from './input';
import './terminal.css';

export function Terminal(props: { fs: FileSystem }) {
  const [path, setPath] = useState(props.fs.getCurrentPath());
  const [history, setHistory] = useState<CommandsHistory[]>([]);
  const [autocompletedCommand, setAutocompletedCommand] = useState<string[]>([]);

  function handleCommand(command: string, executable: string) {
    let output = '';
    try {
      const [utilName, ...args] = executable.split(' ');
      const util = COMMANDS[utilName];
      if (util) {
        output = util(
          props.fs, args,
        );
        setPath(props.fs.getCurrentPath());
      } else {
        output = `Command doesn't exist<br>Type 'help' to know more`;
      }
    } catch (e) {
      if (e instanceof FsError) {
        output = e.message;
      } else {
        output = 'Unexpected error';
      }
    }

    setHistory((prev) => [...prev, {command, output, key: v4()}]);
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
      />
    </div>
  );
}
