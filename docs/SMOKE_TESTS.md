# Smoke Tests Checklist

This document outlines the essential smoke tests to run before each release to ensure core functionality works.

## 🧪 Test Execution

Run these tests on both Android and iOS before releasing:
1. Clean install the app
2. Test each scenario below
3. Mark as ✅ Pass or ❌ Fail
4. Document any issues found

---

## Authentication Tests

### ✅ Test 1: User Registration
- [ ] Open app
- [ ] Navigate to sign up
- [ ] Enter valid email and password
- [ ] Complete registration
- [ ] Verify user is logged in
- [ ] Verify redirect to dashboard

### ✅ Test 2: User Login
- [ ] Open app
- [ ] Enter valid credentials
- [ ] Tap login
- [ ] Verify successful login
- [ ] Verify redirect to dashboard

### ✅ Test 3: User Logout
- [ ] While logged in, go to Settings
- [ ] Tap "Log Out"
- [ ] Confirm logout
- [ ] Verify redirect to login screen
- [ ] Verify session is cleared

---

## Dashboard Tests

### ✅ Test 4: Dashboard Loads
- [ ] Login to app
- [ ] Verify dashboard loads within 3 seconds
- [ ] Verify KPIs are displayed
- [ ] Verify no errors shown

### ✅ Test 5: Dashboard Refresh
- [ ] On dashboard, pull down to refresh
- [ ] Verify data refreshes
- [ ] Verify loading indicator appears
- [ ] Verify data updates correctly

---

## Products Tests

### ✅ Test 6: Create Product
- [ ] Navigate to Products screen
- [ ] Tap "Add Product" or FAB
- [ ] Fill in product details (name, price, stock)
- [ ] Save product
- [ ] Verify product appears in list
- [ ] Verify product details are correct

### ✅ Test 7: View Product List
- [ ] Navigate to Products screen
- [ ] Verify products load
- [ ] Verify product cards display correctly
- [ ] Test scrolling through list

### ✅ Test 8: Search Products
- [ ] On Products screen, use search bar
- [ ] Enter product name
- [ ] Verify filtered results appear
- [ ] Clear search
- [ ] Verify all products shown again

---

## Invoices Tests

### ✅ Test 9: Create Invoice
- [ ] Navigate to Invoices screen
- [ ] Tap "New Sale" or FAB
- [ ] Select a customer
- [ ] Add at least one product
- [ ] Set quantity
- [ ] Complete invoice
- [ ] Verify invoice appears in list
- [ ] Verify invoice total is correct

### ✅ Test 10: View Invoice Details
- [ ] From invoice list, tap an invoice
- [ ] Verify invoice details load
- [ ] Verify all line items shown
- [ ] Verify totals are correct
- [ ] Test PDF share/download

### ✅ Test 11: Update Invoice Status
- [ ] Open an invoice detail
- [ ] Change status (e.g., Draft → Sent)
- [ ] Verify status updates
- [ ] Verify status badge reflects change

---

## Purchase Orders Tests

### ✅ Test 12: Create Purchase Order
- [ ] Navigate to Purchase Orders screen
- [ ] Tap "New Purchase" or FAB
- [ ] Select a supplier
- [ ] Add products with quantities
- [ ] Set order date
- [ ] Save purchase order
- [ ] Verify purchase appears in list
- [ ] Verify stock is updated

### ✅ Test 13: Mark Purchase as Received
- [ ] Open a purchase order
- [ ] Tap "Mark as Received"
- [ ] Confirm action
- [ ] Verify status updates to "Received"

---

## Expenses Tests

### ✅ Test 14: Add Expense
- [ ] Navigate to Expenses screen
- [ ] Tap "Add Expense" or FAB
- [ ] Select or create category
- [ ] Enter amount and description
- [ ] Set date
- [ ] Save expense
- [ ] Verify expense appears in list
- [ ] Verify total updates

---

## Reports Tests

### ✅ Test 15: View Reports
- [ ] Navigate to Reports screen
- [ ] Verify KPIs load
- [ ] Verify charts display
- [ ] Test date range selection
- [ ] Verify data updates with range

### ✅ Test 16: Export Reports
- [ ] On Reports screen
- [ ] Tap export option
- [ ] Select PDF or CSV
- [ ] Verify file is generated
- [ ] Verify file can be shared

---

## Offline Functionality Tests

### ✅ Test 17: Offline Mode
- [ ] Enable airplane mode
- [ ] Try to create a product
- [ ] Verify data is queued
- [ ] Verify offline indicator shows
- [ ] Disable airplane mode
- [ ] Verify data syncs automatically
- [ ] Verify queued items are processed

### ✅ Test 18: Data Sync
- [ ] Create data while offline
- [ ] Go back online
- [ ] Verify sync indicator appears
- [ ] Verify data appears in lists
- [ ] Verify no duplicates created

---

## Settings Tests

### ✅ Test 19: Business Info
- [ ] Navigate to Settings → Business Details
- [ ] Verify business info loads
- [ ] Tap Edit
- [ ] Update store name
- [ ] Save changes
- [ ] Verify changes are saved
- [ ] Verify changes persist after app restart

---

## Error Handling Tests

### ✅ Test 20: Network Error Handling
- [ ] Enable airplane mode
- [ ] Try to load dashboard
- [ ] Verify error message shown
- [ ] Verify retry button works
- [ ] Go back online
- [ ] Verify data loads after retry

### ✅ Test 21: Invalid Input Handling
- [ ] Try to create invoice without customer
- [ ] Verify validation error shown
- [ ] Try to create product with invalid price
- [ ] Verify validation error shown

---

## Performance Tests

### ✅ Test 22: App Launch Time
- [ ] Force close app
- [ ] Launch app
- [ ] Time to dashboard: Should be < 3 seconds
- [ ] Verify no blank screens

### ✅ Test 23: Screen Navigation
- [ ] Navigate between screens
- [ ] Verify transitions are smooth
- [ ] Verify no lag or stuttering
- [ ] Verify back navigation works

### ✅ Test 24: Large List Performance
- [ ] Create 50+ products
- [ ] Navigate to Products screen
- [ ] Scroll through list
- [ ] Verify smooth scrolling
- [ ] Verify no memory issues

---

## PDF Generation Tests

### ✅ Test 25: Invoice PDF
- [ ] Open an invoice
- [ ] Tap share/download
- [ ] Select PDF option
- [ ] Verify PDF is generated
- [ ] Verify PDF contains correct data
- [ ] Verify PDF can be shared

### ✅ Test 26: Purchase Receipt PDF
- [ ] Open a purchase order
- [ ] Tap share/download
- [ ] Select PDF option
- [ ] Verify PDF is generated
- [ ] Verify PDF contains correct data

---

## Barcode Scanning Tests

### ✅ Test 27: Barcode Scan (if applicable)
- [ ] Navigate to Products screen
- [ ] Tap barcode scanner
- [ ] Scan a barcode
- [ ] Verify product is found
- [ ] Verify navigation to product detail

---

## Critical Path Test

### ✅ Test 28: Complete Sales Flow
1. [ ] Login
2. [ ] Create a product
3. [ ] Create a customer
4. [ ] Create an invoice with the product
5. [ ] View invoice PDF
6. [ ] Update invoice status
7. [ ] Verify stock decreased
8. [ ] View reports
9. [ ] Logout

---

## Test Results Template

```
Test Date: ___________
Tester: ___________
Platform: [ ] Android [ ] iOS
Build Version: ___________

Results:
- Total Tests: ___
- Passed: ___
- Failed: ___
- Blocked: ___

Critical Issues Found:
1. 
2. 
3. 

Notes:
```

---

## Pre-Release Checklist

Before releasing, ensure:
- [ ] All critical tests (1-28) pass
- [ ] No critical bugs found
- [ ] Performance is acceptable
- [ ] Offline mode works
- [ ] Error handling works
- [ ] PDF generation works
- [ ] All features accessible

