# Test Plan for COBOL Student Account Application

This test plan covers the business logic implemented in the COBOL application (`MainProgram`, `Operations`, `DataProgram`) and is intended for validation with business stakeholders. Fill in the "Actual Result" and "Status" columns during execution.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-01 | View Balance — initial account balance | Application freshly started (no prior operations). Default `STORAGE-BALANCE` = 1000.00. | 1. From menu choose "1" (View Balance). 2. Observe displayed balance. | Current balance displayed = 1000.00. | TBD | TBD | Confirms initial account seed value. |
| TC-02 | Credit Account — valid credit increases balance | Start with known balance (e.g., 1000.00). | 1. From menu choose "2" (Credit Account). 2. Enter a valid amount (e.g., 100.00). 3. After operation, view balance (choose "1"). | New balance displayed = old balance + credit (e.g., 1100.00). | TBD | TBD | Verifies addition and in-memory write via `DataProgram`. |
| TC-03 | Debit Account — valid debit decreases balance | Start with known balance greater than debit amount. | 1. From menu choose "3" (Debit Account). 2. Enter a valid amount less than or equal to current balance (e.g., 200.00). 3. After operation, view balance. | New balance displayed = old balance - debit (e.g., 800.00). | TBD | TBD | Confirms subtraction and write-back. |
| TC-04 | Debit Account — insufficient funds blocked | Start with known balance (e.g., 1000.00). | 1. From menu choose "3" (Debit Account). 2. Enter an amount larger than the balance (e.g., 2000.00). | System displays: "Insufficient funds for this debit." Balance remains unchanged. | TBD | TBD | Validates business rule: no overdraft allowed. |
| TC-05 | Amount format and precision | Application accepts monetary input. | 1. Credit with decimals (e.g., 12.34). 2. Debit with decimals (e.g., 5.67). 3. View balance. | Monetary values handled with two decimal places; arithmetic reflects cents correctly. | TBD | TBD | Values stored in `PIC 9(6)V99` (two decimals). |
| TC-06 | Amount limits and overflow behavior | Understand max representable amount (999,999.99). | 1. Attempt to credit an extremely large amount (over 999,999.99). 2. Observe behavior. | Expected: system should either reject or show overflow/failed behavior; business should decide acceptable behavior. | TBD | TBD | COBOL field limits may cause unexpected behavior — recommend adding validation in future. |
| TC-07 | Operation code padding correctness | Calls to `Operations` use 6-char op codes (e.g., 'TOTAL ', 'DEBIT '). | 1. Verify `MainProgram` calls use padded codes. 2. If testing `Operations` directly, pass exactly 6-character codes. | Operations respond only when codes match padded values. | TBD | TBD | Important when porting to other runtimes — preserve exact op codes or refactor. |
| TC-08 | Persistence behavior across restarts | Note: `DataProgram` uses in-memory `WORKING-STORAGE` only. | 1. Start app, credit 50.00. 2. Exit program. 3. Restart app and view balance. | Expected: balance resets to default (1000.00). Document as non-persistent. | TBD | TBD | Confirms that persistence is NOT implemented. |
| TC-09 | Menu invalid selection handling | User selects invalid menu option. | 1. From menu enter invalid option (e.g., 9 or non-numeric). 2. Observe message and whether program continues to prompt. | System displays "Invalid choice, please select 1-4." and returns to menu. | TBD | TBD | Evaluates user flow resilience. |
| TC-10 | Non-numeric input for amounts | User enters non-numeric characters when prompted for amount. | 1. Choose Credit or Debit. 2. When prompted for amount, enter alphabetic input (e.g., 'abc'). 3. Observe outcome. | Expected: business to define desired behavior. Current implementation has minimal validation; may store zero, cause error, or behave inconsistently. | TBD | TBD | Recommend adding strict numeric validation in Node.js conversion. |

## How to run these tests (manual)

1. From project root compile and run (if COBOL toolchain present):

```bash
cobc -x src/cobol/main.cob src/cobol/operations.cob src/cobol/data.cob -o accountsystem
./accountsystem
```

2. Execute each test case using the interactive menu; record "Actual Result" and mark "Status" as Pass/Fail.

## Notes for Stakeholders

- Use this plan to validate business rules before automated tests are implemented for the Node.js port. 
- Where the expected behavior is ambiguous (e.g., non-numeric input, overflow), the test plan marks the expected result as a stakeholder decision and recommends how the Node.js implementation should behave.
