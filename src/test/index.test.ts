import { describe, expect, it } from 'vitest';
const add = (a, b) => a + b;

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
