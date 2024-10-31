# Testing Documentation

## Overview
This project includes integration tests for the Order API.

## Test Structure

```
tests/
├── app.test.ts       # Main test suite
├── testData.ts       # Test data and constants
└── testService.ts    # Test utility functions
```

## Running Tests

```bash
# Run all tests
npm test
```

## Test Coverage

The test suite covers:

### Inventory Management (`/api/inventory`)
- ✅ Creating and retrieving inventory items
- ✅ Input validation for quantities (rejects non-integers)
- ✅ UUID validation for product IDs

### Order Processing (`/api/order`)
- ✅ Order creation and retrieval
- ✅ Order confirmation flow
- ✅ Order cancellation flow
- ✅ Payment status updates
- ✅ Inventory reservation system

## Test Utilities

### `deleteAllData()`
Truncates all test tables:
- payment_transaction
- order_items
- orders
- inventory
