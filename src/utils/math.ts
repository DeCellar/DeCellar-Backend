export function fPercentChange(oldNumber: number, newNumber: number) {
  if (oldNumber == 0 && newNumber > 0) {
    return 100;
  } else if (oldNumber == 0 && newNumber == 0) {
    return 0;
  } else {
    const percentageChange = ((newNumber - oldNumber) / oldNumber) * 100;
    return percentageChange;
  }
}

export function fSumArray(arr: number[]): number {
  return arr.reduce((sum, num) => sum + num, 0);
}
