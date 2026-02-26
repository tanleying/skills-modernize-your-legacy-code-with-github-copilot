const {
  getBalance,
  credit,
  debit,
  resetBalance,
  MAX_AMOUNT,
} = require('../index');

describe('Accounting business logic', () => {
  beforeEach(() => {
    resetBalance();
  });

  test('TC-01 view initial balance', () => {
    expect(getBalance()).toBe(1000.0);
  });

  test('TC-02 credit increases balance', () => {
    credit(100.0);
    expect(getBalance()).toBe(1100.0);
  });

  test('TC-03 debit decreases balance', () => {
    // start with default 1000
    debit(200.0);
    expect(getBalance()).toBe(800.0);
  });

  test('TC-04 debit with insufficient funds throws', () => {
    expect(() => debit(2000.0)).toThrow('Insufficient funds');
    expect(getBalance()).toBe(1000.0); // unchanged
  });

  test('TC-05 amount format and precision', () => {
    credit(12.34);
    debit(5.67);
    expect(getBalance()).toBeCloseTo(1006.67, 2);
  });

  test('TC-06 amount limit overflow behavior', () => {
    // credit amount > MAX_AMOUNT should throw
    expect(() => credit(MAX_AMOUNT + 1)).toThrow('Amount exceeds allowable limit');
    // after crediting near max then small add should clamp
    credit(MAX_AMOUNT - getBalance());
    // now balance equals MAX_AMOUNT
    expect(getBalance()).toBe(MAX_AMOUNT);
    // further crediting small positive should clamp to MAX_AMOUNT
    credit(10);
    expect(getBalance()).toBe(MAX_AMOUNT);
  });

  test('TC-09 invalid amount input (non-numeric) for credit', () => {
    expect(() => credit(NaN)).toThrow('Invalid amount');
  });

  test('TC-09 invalid amount input (negative) for debit', () => {
    expect(() => debit(-1)).toThrow('Invalid amount');
  });
});
