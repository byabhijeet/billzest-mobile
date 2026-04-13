[x] 2. Display purchase report on dashboard
[x] 2.1 Create PurchaseReportCard component
[x] 2.2 Add purchase report section to DashboardScreen
[x] 2.3 Display totalPurchases from kpis object
[x] 2.4 Add date range filtering for purchase report
[x] 2.5 Style purchase report card to match dashboard design

[ ] 3. Add product cost field and update inventory calculation
[ ] 3.1 Add cost input field to ProductFormScreen
[ ] 3.2 Add cost validation (must be positive, can be less than price)
[ ] 3.3 Update product creation/update logic to save cost field
[ ] 3.4 Update dashboardService.getKpis to use cost instead of price for inventory calculation
[ ] 3.5 Update BusinessInsightsCards to reflect cost-based inventory value

[x] 4. Implement full invoice edit capability
[x] 4.1 Add edit button to InvoiceDetailScreen for draft invoices
[x] 4.2 Create invoice edit mode in AddSaleScreen
[x] 4.3 Load existing invoice data into edit form
[x] 4.4 Handle invoice item updates (add, remove, modify quantities/prices)
[x] 4.5 Implement stock reconciliation on invoice edit
[x] 4.6 Add validation for invoice edits
[x] 4.7 Update invoice service to handle item modifications

[ ] 5. Implement expense update and delete functionality
[ ] 5.1 Create ExpenseDetailScreen component
[ ] 5.2 Implement expense update form
[ ] 5.3 Add delete confirmation dialog
[ ] 5.4 Update ExpensesScreen to navigate to detail screen on press
[ ] 5.5 Add edit and delete actions to expense detail screen
[ ] 5.6 Implement long-press or swipe actions for quick delete
[ ] 5.7 Update expense mutations to handle updates and deletes

[ ] 6. Add printers and devices placeholder UI
[ ] 6.1 Uncomment Printers & Devices section in SettingsScreen
[ ] 6.2 Create placeholder UI with "Launching Soon" message
[ ] 6.3 Add navigation to printers section
[ ] 6.4 Style placeholder to match settings design

[x] 7. Verify barcode scanner performance
[x] 7.1 Add performance timing to barcode scan operations
[x] 7.2 Measure scan recognition time
[x] 7.3 Optimize findProductByBarcode if exceeds 1 second requirement
[x] 7.4 Add performance logging for monitoring

[ ] 8. Verify app launch to dashboard performance
[ ] 8.1 Add performance timing to app initialization
[ ] 8.2 Measure time from app launch to dashboard render
[ ] 8.3 Optimize session check and data fetching if exceeds 3 seconds
[ ] 8.4 Implement lazy loading for dashboard components if needed
[ ] 8.5 Add performance logging for monitoring

