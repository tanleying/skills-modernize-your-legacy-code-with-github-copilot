#!/usr/bin/env node
// A simple in-memory accounting application ported from legacy COBOL.
// Core business logic is factored for unit testing.

const readline = require('readline');

let balance = 1000.0; // initial value from COBOL data.cob
const MAX_AMOUNT = 999999.99; // corresponds to PIC 9(6)V99

function resetBalance() {
  balance = 1000.0;
}

function getBalance() {
  return balance;
}

function credit(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
    throw new Error('Invalid amount');
  }
  if (amount > MAX_AMOUNT) {
    throw new Error('Amount exceeds allowable limit');
  }
  balance += amount;
  if (balance > MAX_AMOUNT) {
    balance = MAX_AMOUNT;
  }
  return balance;
}

function debit(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
    throw new Error('Invalid amount');
  }
  if (amount > MAX_AMOUNT) {
    throw new Error('Amount exceeds allowable limit');
  }
  if (amount <= balance) {
    balance -= amount;
    return balance;
  } else {
    throw new Error('Insufficient funds');
  }
}

// interactive layer
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
  rl.question('Enter your choice (1-4): ', handleMenuChoice);
}

function handleMenuChoice(choice) {
  switch (choice.trim()) {
    case '1':
      console.log(`Current balance: ${balance.toFixed(2)}`);
      displayMenu();
      break;
    case '2':
      rl.question('Enter credit amount: ', (input) => {
        try {
          const newBal = credit(parseFloat(input));
          console.log(`Amount credited. New balance: ${newBal.toFixed(2)}`);
        } catch (err) {
          console.log(err.message);
        }
        displayMenu();
      });
      break;
    case '3':
      rl.question('Enter debit amount: ', (input) => {
        try {
          const newBal = debit(parseFloat(input));
          console.log(`Amount debited. New balance: ${newBal.toFixed(2)}`);
        } catch (err) {
          console.log(err.message);
        }
        displayMenu();
      });
      break;
    case '4':
      console.log('Exiting the program. Goodbye!');
      rl.close();
      break;
    default:
      console.log('Invalid choice, please select 1-4.');
      displayMenu();
  }
}

// exports for testing
module.exports = {
  getBalance,
  credit,
  debit,
  resetBalance,
  MAX_AMOUNT,
};

// start the interactive loop when run directly
if (require.main === module) {
  displayMenu();
}
