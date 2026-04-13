# Test Plan - Medium Priority Features

**Date:** Generated  
**Scope:** Empty/Error States, Loading Skeletons, Form Validation, Stock Management

---

## 1. Empty/Error State Handling

### 1.1 ExpensesScreen
- [ ] **Empty State**
  - Navigate to Expenses screen with no expenses
  - Verify: EmptyState component shows with Wallet icon
  - Verify: "No expenses yet" message displayed
  - Verify: "Add Expense" button is present and functional

- [ ] **Error State**
  - Simulate network error (disable network or invalid API)
  - Verify: EmptyState component shows with AlertTriangle icon
  - Verify: "Unable to load expenses" message displayed
  - Verify: "Retry" button is present and functional
  - Click Retry: Verify data reloads when network is restored

### 1.2 CreditBookScreen
- [ ] **Empty State - Customer Tab**
  - Navigate to Credit Book with no customers
  - Verify: EmptyState shows with Users icon
  - Verify: "No customers yet" message
  - Verify: "Add Customer" button functional

- [ ] **Empty State - Vendor Tab**
  - Switch to Vendor tab with no vendors
  - Verify: EmptyState shows with Users icon
  - Verify: "No vendors yet" message
  - Verify: "Add Vendor" button functional

- [ ] **Empty State - Expense Tab**
  - Switch to Expense tab with no expenses
  - Verify: EmptyState shows with Wallet icon
  - Verify: "No expenses yet" message
  - Verify: "Add Expense" button functional

- [ ] **Error State**
  - Simulate network error
  - Verify: Error state shows with AlertTriangle icon
  - Verify: "Unable to load credit book" message
  - Verify: Retry button functional

### 1.3 DashboardScreen
- [ ] **Error State**
  - Simulate KPI fetch failure
  - Verify: Error state displays
  - Verify: "Unable to load dashboard" message
  - Verify: Retry button functional

### 1.4 Other Screens (Already Implemented)
- [ ] Verify InvoicesListScreen has proper empty/error states
- [ ] Verify CustomersListScreen has proper empty/error states
- [ ] Verify ProductsListScreen has proper empty/error states
- [ ] Verify PurchaseListScreen has proper empty/error states

---

## 2. Loading Skeletons

### 2.1 List Screens
- [ ] **InvoicesListScreen**
  - Navigate to Invoices screen
  - Verify: InvoiceListSkeleton displays while loading
  - Verify: Skeleton shows 4 placeholder cards
  - Verify: Skeleton disappears when data loads

- [ ] **CustomersListScreen**
  - Navigate to Customers screen
  - Verify: CustomerListSkeleton displays while loading
  - Verify: Skeleton shows 5 placeholder cards with avatars
  - Verify: Skeleton disappears when data loads

- [ ] **PurchaseListScreen**
  - Navigate to Purchases screen
  - Verify: PurchaseListSkeleton displays while loading
  - Verify: Skeleton shows 4 placeholder cards
  - Verify: Skeleton disappears when data loads

- [ ] **ExpensesScreen**
  - Navigate to Expenses screen
  - Verify: ExpenseListSkeleton displays while loading
  - Verify: Skeleton shows 5 placeholder cards
  - Verify: Skeleton disappears when data loads

- [ ] **CreditBookScreen**
  - Navigate to Credit Book screen
  - Verify: CreditBookSkeleton displays while loading
  - Verify: Skeleton shows summary cards, tabs, and list items
  - Verify: Skeleton disappears when data loads

### 2.2 Skeleton Animation
- [ ] Verify all skeletons have smooth pulsing animation
- [ ] Verify skeleton colors match theme (border color)
- [ ] Verify skeleton sizes match actual content

---

## 3. Form Validation

### 3.1 ProductFormScreen

#### Create Mode
- [ ] **Required Fields**
  - Try to save without name: Verify error "Item name is required"
  - Try to save without SKU: Verify error "SKU is required"
  - Try to save without unit: Verify error "Unit is required"
  - Try to save without price: Verify error "Price is required"
  - Try to save without tax rate: Verify error "Tax rate is required"
  - Try to save without low stock threshold: Verify error "Low stock threshold is required"

- [ ] **Price Validation**
  - Enter negative price: Verify error "Price cannot be negative"
  - Enter zero price: Verify error "Price must be greater than zero"
  - Enter non-numeric price: Verify error "Enter a valid number"
  - Enter valid price: Verify no error

- [ ] **Stock Validation**
  - Enter negative stock: Verify error "Stock cannot be negative"
  - Enter decimal stock: Verify error "Stock must be a whole number"
  - Enter non-numeric stock: Verify error "Stock must be numeric"
  - Leave stock empty: Verify no error (optional field)
  - Enter valid stock: Verify no error

- [ ] **Tax Rate Validation**
  - Enter negative tax rate: Verify error "Tax rate must be between 0 and 100"
  - Enter tax rate > 100: Verify error "Tax rate must be between 0 and 100"
  - Enter non-numeric tax rate: Verify error "Tax rate must be numeric"
  - Enter valid tax rate (0-100): Verify no error

- [ ] **Low Stock Threshold Validation**
  - Enter negative threshold: Verify error "Threshold cannot be negative"
  - Enter decimal threshold: Verify error "Threshold must be a whole number"
  - Enter non-numeric threshold: Verify error "Threshold must be numeric"
  - Enter valid threshold: Verify no error

#### Edit Mode
- [ ] Verify all validations work in edit mode
- [ ] Verify existing values are pre-filled correctly

### 3.2 CustomerFormScreen

- [ ] **Business Name Validation**
  - Try to save without business name: Verify error "Business name is required"
  - Enter 1 character: Verify error "Business name must be at least 2 characters"
  - Enter valid name (2+ chars): Verify no error

- [ ] **Phone Validation**
  - Try to save without phone: Verify error "Phone number is required"
  - Enter 9 digits: Verify error "Phone number must be exactly 10 digits"
  - Enter 11 digits: Verify error "Phone number must be exactly 10 digits"
  - Enter phone starting with 0-5: Verify error "Please enter a valid Indian mobile number"
  - Enter valid 10-digit Indian mobile (6-9): Verify no error

- [ ] **Contact Person Validation (Optional)**
  - Enter 1 character: Verify error "Contact person name must be at least 2 characters"
  - Leave empty: Verify no error (optional field)
  - Enter valid name: Verify no error

### 3.3 AddSaleScreen (Invoice Creation)

- [ ] **Client Selection**
  - Try to checkout without selecting client: Verify error "Please select a customer before saving the invoice"
  - Select client: Verify no error

- [ ] **Items Validation**
  - Try to checkout without items: Verify error "Add at least one item to create an invoice"
  - Add items: Verify no error

- [ ] **Item Quantity Validation**
  - Add item with quantity 0: Verify error "Quantity for [product] must be greater than zero"
  - Add item with negative quantity: Verify error "Quantity for [product] must be greater than zero"
  - Add item with decimal quantity: Verify error "Quantity for [product] must be a whole number"
  - Add item with valid quantity: Verify no error

- [ ] **Item Price Validation**
  - Add item with price 0: Verify error "Price for [product] must be greater than zero"
  - Add item with negative price: Verify error "Price for [product] must be greater than zero"
  - Add item with valid price: Verify no error

- [ ] **Date Validation**
  - Set invalid date: Verify error "Please select a valid date"
  - Set valid date: Verify no error

---

## 4. Stock Management

### 4.1 Stock Deduction on Invoice Creation

#### Test Setup
1. Create a product with known stock (e.g., Product A with stock = 100)
2. Note the initial stock value

#### Test Cases
- [ ] **Single Product Invoice**
  - Create invoice with Product A, quantity = 10
  - Verify: Invoice created successfully
  - Verify: Product A stock reduced from 100 to 90
  - Check database: Verify stock value is correct

- [ ] **Multiple Products Invoice**
  - Create invoice with:
    - Product A, quantity = 5
    - Product B, quantity = 3
  - Verify: Invoice created successfully
  - Verify: Product A stock reduced by 5
  - Verify: Product B stock reduced by 3

- [ ] **Multiple Items of Same Product**
  - Create invoice with Product A, quantity = 5
  - Create another invoice with Product A, quantity = 3
  - Verify: Total stock reduction = 8
  - Verify: Final stock = initial - 8

- [ ] **Insufficient Stock**
  - Set Product A stock to 5
  - Create invoice with Product A, quantity = 10
  - Verify: Invoice created successfully (non-blocking)
  - Verify: Product A stock reduced to 0 (not negative)
  - Check logs: Verify warning about insufficient stock

- [ ] **Stock Goes to Zero**
  - Set Product A stock to 5
  - Create invoice with Product A, quantity = 5
  - Verify: Product A stock becomes 0
  - Verify: No negative stock

- [ ] **Product Matching by ID (Primary Method)**
  - Create invoice with product IDs passed
  - Verify: Stock deducted correctly
  - Check logs: Verify product IDs were used

- [ ] **Product Matching by Name (Fallback)**
  - Create invoice without product IDs (simulate old flow)
  - Verify: Products matched by name (case-insensitive)
  - Verify: Stock deducted correctly
  - Check logs: Verify name matching was used

- [ ] **Product Not Found**
  - Create invoice with product name that doesn't exist
  - Verify: Invoice created successfully
  - Verify: Warning logged about product not found
  - Verify: No stock update attempted

- [ ] **Stock Update Failure (Non-Blocking)**
  - Simulate database error during stock update
  - Verify: Invoice still created successfully
  - Verify: Error logged but doesn't block invoice creation

### 4.2 Stock Addition on Purchase Creation

#### Test Setup
1. Create a product with known stock (e.g., Product A with stock = 50)
2. Note the initial stock value

#### Test Cases
- [ ] **Single Product Purchase**
  - Create purchase with Product A, quantity = 20
  - Verify: Purchase created successfully
  - Verify: Product A stock increased from 50 to 70
  - Check database: Verify stock value is correct

- [ ] **Multiple Products Purchase**
  - Create purchase with:
    - Product A, quantity = 10
    - Product B, quantity = 15
  - Verify: Purchase created successfully
  - Verify: Product A stock increased by 10
  - Verify: Product B stock increased by 15

- [ ] **Multiple Items of Same Product**
  - Create purchase with Product A, quantity = 5
  - Create another purchase with Product A, quantity = 3
  - Verify: Total stock addition = 8
  - Verify: Final stock = initial + 8

---

## 5. Integration Tests

### 5.1 Complete Invoice Flow
- [ ] Create product with stock = 100
- [ ] Create customer
- [ ] Create invoice with product, quantity = 10
- [ ] Verify: Invoice created
- [ ] Verify: Product stock = 90
- [ ] Verify: Invoice appears in list
- [ ] Verify: Invoice detail shows correct information

### 5.2 Complete Purchase Flow
- [ ] Create product with stock = 50
- [ ] Create vendor
- [ ] Create purchase with product, quantity = 20
- [ ] Verify: Purchase created
- [ ] Verify: Product stock = 70
- [ ] Verify: Purchase appears in list

### 5.3 Error Recovery
- [ ] Create invoice while offline
- [ ] Verify: Invoice queued for sync
- [ ] Go online
- [ ] Verify: Invoice syncs and stock is deducted

---

## 6. Edge Cases

### 6.1 Stock Edge Cases
- [ ] **Zero Stock Product**
  - Create invoice with product that has 0 stock
  - Verify: Invoice created, stock stays at 0

- [ ] **Very Large Quantities**
  - Create invoice with quantity = 10000
  - Verify: Stock calculation handles large numbers correctly

- [ ] **Concurrent Updates**
  - Create two invoices simultaneously with same product
  - Verify: Stock updates correctly (or at least doesn't corrupt)

### 6.2 Form Edge Cases
- [ ] **Special Characters in Names**
  - Enter product name with special chars: Verify accepted
  - Enter business name with special chars: Verify accepted

- [ ] **Very Long Inputs**
  - Enter very long product name: Verify handled gracefully
  - Enter very long description: Verify handled gracefully

- [ ] **Unicode Characters**
  - Enter product name in different language: Verify accepted
  - Enter phone number with formatting: Verify normalized correctly

---

## 7. Performance Tests

- [ ] **Large Product List**
  - Create invoice with 50+ products
  - Verify: Stock updates complete in reasonable time
  - Verify: No UI freezing

- [ ] **Rapid Invoice Creation**
  - Create multiple invoices quickly
  - Verify: All stock updates complete correctly
  - Verify: No race conditions

---

## 8. UI/UX Tests

### 8.1 Loading States
- [ ] Verify skeletons appear immediately on screen load
- [ ] Verify skeletons are replaced smoothly (no flicker)
- [ ] Verify loading states don't block user interaction unnecessarily

### 8.2 Error Messages
- [ ] Verify error messages are clear and actionable
- [ ] Verify error messages use appropriate icons
- [ ] Verify retry buttons are easily accessible

### 8.3 Empty States
- [ ] Verify empty states are visually appealing
- [ ] Verify empty states provide clear next steps
- [ ] Verify action buttons in empty states work correctly

---

## Test Results Summary

**Date Tested:** _______________  
**Tester:** _______________  

### Summary
- Total Test Cases: ___
- Passed: ___
- Failed: ___
- Blocked: ___

### Critical Issues Found
1. 
2. 
3. 

### Notes
- 

---

## Next Steps
1. Fix any critical issues found
2. Re-test failed test cases
3. Document any known limitations
4. Update user documentation if needed

