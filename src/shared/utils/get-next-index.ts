export function getNext<T>(arr: T[], index: number): T {
  let idx = index + 1;
  if (idx >= arr.length) {
    idx = 0;
  }
  return arr[idx];
}