import { describe, it, expect } from 'vitest';
import { getCartTotal } from '../src/lib/cartService';

describe('getCartTotal', () => {
  it('correctly sums price × quantity for multiple cart items', () => {
    const items = [
      { id: '1', name: 'Item 1', price: 10, quantity: 2 },
      { id: '2', name: 'Item 2', price: 5, quantity: 3 },
    ];

    expect(getCartTotal(items)).toBe(10 * 2 + 5 * 3);
  });
});
