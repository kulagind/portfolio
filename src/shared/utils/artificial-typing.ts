export async function* generateMessage(message: string) {
  let result = '';
  for (const letter of message) {
    result += letter;
    yield await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, getRandomNumber(30, 200));
    });
  }
}

export function getRandomNumber(from: number, to: number): number {
  return Math.floor(Math.random() * (
    to - from + 1
  )) + from;
}