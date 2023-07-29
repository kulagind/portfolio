import dompurify from 'dompurify';
import { CommandsHistory } from './commands';

export function History(props: { history: CommandsHistory[] }) {
  return (
    <div className="history">
      {props.history.map((i) => (
        <div className="history-item" key={i.key}>
          <div
            className="history-item__command"
          >
            {i.command}
          </div>
          <div
            className="history-item__output" dangerouslySetInnerHTML={{__html: dompurify.sanitize(i.output)}}
          >
          </div>
        </div>
      ))}
    </div>
  );
}