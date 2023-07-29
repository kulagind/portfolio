'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './terminal.css';

export function Input(props: {
  path: string,
  executeCommand: (command: string, executable: string) => void,
  autocomplete: (executable: string) => void,
  autocompletedCommand: string[],
  usedCommands: string[],
}) {
  const [command, setCommand] = useState('');
  const [autocompleteIndex, setAutocompleteIndex] = useState(-1);
  const [usedCommandIndex, setUsedCommandsIndex] = useState(-1);
  const input = useRef();

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
    const listener = () => {
      // @ts-ignore
      input.current.focus();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  });

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
        let idxDown = usedCommandIndex - 1;
        if (idxDown < 0) {
          idxDown = props.usedCommands.length - 1;
        }
        setUsedCommandsIndex(idxDown);
        setCommand(props.usedCommands[idxDown]);
        setAutocompleteIndex(-1);
        break;
      case e.code === 'ArrowDown':
        e.preventDefault();
        let idxUp = usedCommandIndex + 1;
        if (idxUp >= props.usedCommands.length) {
          idxUp = 0;
        }
        setUsedCommandsIndex(idxUp);
        setCommand(props.usedCommands[idxUp]);
        setAutocompleteIndex(-1);
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
        <input ref={input} onKeyDown={handleKeyDown} onChange={handleChange} value={command} />
      </div>
    </div>
  );
}
