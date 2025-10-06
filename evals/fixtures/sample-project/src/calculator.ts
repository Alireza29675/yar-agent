export class Calculator {
  add(a: number, b: number): number {
    return a + b
  }

  divide(a: number, b: number): number {
    // Bug: No zero division check
    return a / b
  }

  multiply(a: number, b: number): number {
    return a * b
  }

  subtract(a: number, b: number): number {
    return a - b
  }
}
