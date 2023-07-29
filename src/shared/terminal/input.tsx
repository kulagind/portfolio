'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import './terminal.css';

export function Input(props: {
  path: string,
  executeCommand: (command: string, executable: string) => void,
  autocomplete: (executable: string) => void,
  autocompletedCommand: string[],
}) {
  const [command, setCommand] = useState('');
  const [autocompleteIndex, setAutocompleteIndex] = useState(-1);

  const MACHINE_NAME = 'user@localhost';

  function updatePath(prev: string, index = 0): string {
    const tmpUtil = prev.split(' ');
    const tmpArg = (
      tmpUtil.pop() || ''
    ).split('/');
    tmpArg.pop();
    tmpArg.push(props.autocompletedCommand[index]);
    return `${tmpUtil.join(' ')}${tmpUtil.length ? ' ' : ''}${tmpArg.join('/')}`;
  }

  useEffect(() => {
    if (props.autocompletedCommand.length) {
      setCommand(updatePath);
      setAutocompleteIndex(0);
    }
  }, [props.autocompletedCommand]);

  function handleKeyDown(e: KeyboardEvent) {
    switch (true) {
      case e.code === 'ArrowUp':
        e.preventDefault();
        setAutocompleteIndex(-1);
        break;
      case e.code === 'ArrowDown':
        e.preventDefault();
        console.log(e);
        break;
      case e.code === 'Enter':
        e.preventDefault();
        props.executeCommand(`${MACHINE_NAME}:${props.path}$ ${command}`, command);
        setCommand('');
        setAutocompleteIndex(-1);
        break;
      case e.code === 'Tab':
        e.preventDefault();
        if (command.split(' ').length > 1) {
          if (autocompleteIndex >= 0) {
            if (props.autocompletedCommand.length) {
              let idx = autocompleteIndex + 1;
              if (idx >= props.autocompletedCommand.length) {
                idx = 0;
              }
              setAutocompleteIndex(idx);
              setCommand((prev) => {
                return updatePath(prev, idx);
              });
            }
          } else {
            props.autocomplete(command);
          }
        }
        break;
      case e.code === 'KeyC' && e.ctrlKey:
        e.preventDefault();
        setCommand('');
        setAutocompleteIndex(-1);
        break;
      default:
        break;
    }
  }

  function handleChange(e: ChangeEvent) {
    setCommand((
      e.target as HTMLInputElement
    ).value);
    setAutocompleteIndex(-1);
  }

  return (
    <div className="terminal__active-row active-row">
      <div className="active-row__path">
        {MACHINE_NAME}:{props.path}$&nbsp;
      </div>
      <div className="active-row__input">
        <input onKeyDown={handleKeyDown} onChange={handleChange} value={command} />
      </div>
    </div>
  );
}
