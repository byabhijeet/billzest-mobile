# Technical Architecture – BillZest Mobile App

## 1. Overview

- **App type:** React Native CLI (iOS + Android)
- **Navigation:** React Navigation (Stack + Bottom Tabs + Drawer)
- **Backend:** Supabase (Auth, Postgres, RLS, Storage, Realtime)
- **Data Layer:** Supabase client + module-based service files + offline cache (SQLite/MMKV)
- **Logic Layer:** Dedicated logic modules (`invoiceLogic`, `billingLogic`, `stockLogic`, `customerLogic`)
- **State Management:** Combination of React state, React Context, and a query/cache layer (e.g. TanStack Query) plus local persistence
- **Theming:** Central theme provider using `dark.js` and `light.js` matching BillZest web

---

## 2. Navigation Architecture

### 2.1 Navigator Structure

- **Root Stack (`RootStack`)**
  - `AuthStack`
    - `LoginScreen`
    - (Optional) `ForgotPasswordScreen`, `OnboardingScreen`
  - `AppDrawer` (main application shell)
    - Contains `BottomTabNavigator` + secondary stacks

- **Bottom Tab Navigator (`MainTabs`)**
  - `DashboardTabStack`
    - `DashboardScreen`
  - `ProductsTabStack`
    - `ProductsListScreen`
    - `ProductDetailScreen`
    - `ProductFormScreen` (Add/Edit)
  - `CustomersTabStack`
    - `CustomersListScreen`
    - `CustomerDetailScreen`
    - `CustomerFormScreen` (Add/Edit)
  - `InvoicesTabStack`
    - `InvoicesListScreen`
    - `InvoiceDetailScreen`
    - `NewInvoiceScreen` (Billing/POS)

- **Drawer Navigator (`AppDrawer`)**
  - Wraps `MainTabs` and exposes routes via drawer items:
    - Dashboard → `DashboardTabStack` root
    - Products → `ProductsTabStack` root
    - Customers → `CustomersTabStack` root
    - Invoices → `InvoicesTabStack` root
    - Create Purchase → `PurchaseScreen` (own stack or inside Products stack)
    - CreditBook → `CreditBookScreen` + `CustomerCreditDetailScreen`
    - Reports → `ReportsScreen`
    - Business Info → `BusinessInfoScreen` (Settings sub)
    - Billing Templates → `BillingTemplatesScreen`
    - Plans → `PlansScreen`
    - Notifications → `NotificationsScreen`
    - Security → `SecuritySettingsScreen`
    - Integrations → `IntegrationsScreen`
    - Settings → `SettingsRootScreen`
    - Logout → triggers logout and returns to `AuthStack`

### 2.2 Navigation Data Flow

- `App.tsx`:
  - Wraps app with:
    - `ThemeProvider`
    - `SupabaseProvider`
    - `AppStateProvider` (global app-level state/context)
    - `QueryClientProvider` (if using TanStack Query)
    - `NavigationContainer`
  - Root stack decides between `AuthStack` or `AppDrawer` based on auth session.

- Screen-to-screen navigation:
  - Uses typed navigation params (TypeScript) for safety:
    - Example: `InvoiceDetailScreen` receives `invoiceId`.
    - Example: `ProductDetailScreen` receives `productId`.

---

## 3. Component Hierarchy

### 3.1 Top-Level Structure

- `App.tsx`
  - `Providers`:
    - `ThemeProvider` (light/dark + BillZest tokens)
    - `SupabaseProvider` (client + session)
    - `AppStateProvider` (user, business, settings, offline queue status)
    - `QueryClientProvider`
  - `NavigationContainer`
    - `RootStack`

### 3.2 Shared Components (in `/src/components`)

- **Layout**
  - `ScreenContainer` (handles safe area, background, padding, scroll vs fixed)
  - `AppBar` / `Header` (title, back button, action buttons)
  - `TabBar` (custom bottom tab style, matched to web)
  - `DrawerContent` (custom drawer UI, matched to web sidebar)

- **UI Elements**
  - `Button` (primary/secondary/ghost, loading state)
  - `IconButton`
  - `Text` (themed text variants: title, subtitle, body, caption)
  - `Input` / `TextField` (with label, helper/error text)
  - `Select` / `Dropdown` (for category, status)
  - `Switch` / `Toggle`
  - `Checkbox`, `Radio` (as needed in settings)
  - `Card` (for dashboard KPIs, list items)
  - `Chip` / `Badge` (status badges)

- **Data / Lists**
  - `ListItem` (generic)
  - `ProductListItem`
  - `CustomerListItem`
  - `InvoiceListItem`
  - `EmptyStateView`
  - `LoadingStateView`
  - `ErrorStateView`

- **Feedback**
  - `Toast` / Snackbar wrapper
  - `Modal` / `BottomSheet` (for payments, confirmations)

These components will be fully theme-aware (no hard-coded colors/fonts).

### 3.3 Screen Containers (in `/src/screens`)

Each screen:
- Uses shared components for layout and visuals.
- Delegates data fetching/mutations to:
  - Logic modules (`/logic`)
  - Or service modules (`/supabase`) indirectly via logic.

Example:
- `ProductsListScreen`
  - Calls `productLogic.useProductsList()` hook or uses `productService.list()` through query.
  - Renders list with `ProductListItem` inside `ScreenContainer`.

---

## 4. State Management Strategy

### 4.1 Types of State

- **Server State** (data from Supabase):
  - Products, Customers, Invoices, Purchases, Credit entries, Settings, etc.
- **Local-Only State:**
  - UI state (modals open, current tab filter, search text).
  - Offline mutation queue.
  - Theme preference override.
  - App lock (PIN/biometric) state.

### 4.2 Tools

- **React State / Hooks**
  - For local UI state within components/screens.

- **React Context**
  - `ThemeContext`: active theme (light/dark/system) + toggle.
  - `AuthContext`: current user/session, login/logout actions.
  - `AppSettingsContext`: business selection (if multi-tenant later), language, currency.
  - `OfflineContext`: online/offline status, pending mutations count.

- **Query + Cache Layer (e.g., TanStack Query)**
  - For server state fetching and caching:
    - Keys: `['products']`, `['products', id]`, `['invoices', filters]`, etc.
  - Configured to:
    - Read from offline cache (SQLite/MMKV) on initial load.
    - Persist cache to storage and hydrate on app start.

- **Offline Storage**
  - **SQLite**:
    - Tables: `products_cache`, `customers_cache`, `invoices_cache`, `settings_cache`, `mutation_queue`, etc.
  - **MMKV**:
    - Lightweight key-value for:
      - Theme preference.
      - Basic app settings.
      - Last sync timestamps.
      - App lock PIN (if encrypted).

### 4.3 Data Flow

- Reads:
 1. Screen requests data via logic hook or query.
 2. Query first hits local cache (SQLite via custom persistence).
 3. If online & stale, fetch from Supabase.
 4. On success, update SQLite and re-render.

- Writes:
 1. Screen calls a logic function (e.g., `invoiceLogic.createInvoice(payload)`).
 2. Logic decides:
    - If online → call Supabase service, await result, update caches.
    - If offline → write to `mutation_queue` and local cache (temp IDs), mark as pending.
 3. Sync engine watches connectivity and processes `mutation_queue` when online.

---

## 5. Offline Strategy

### 5.1 Storage Layout (SQLite)

Example local tables (simplified):

- `products_cache`
  - `id`, `business_id`, `name`, `sku`, `price`, `stock_qty`, `status`, `updated_at`, `deleted_at`
- `customers_cache`
  - `id`, `business_id`, `name`, `phone`, `email`, `balance`, `updated_at`, `deleted_at`
- `invoices_cache`
  - `id`, `business_id`, `customer_id`, `number`, `status`, `total`, `created_at`, `updated_at`, `is_pending_sync`, `temp_id`
- `invoice_items_cache`
  - `id`, `invoice_id`, `product_id`, `name`, `quantity`, `price`, `discount`, `tax`
- `settings_cache`
  - `business_id`, `key`, `value`, `updated_at`
- `mutation_queue`
  - `id`, `operation_type` (`INSERT`/`UPDATE`/`DELETE`), `entity` (`product`, `invoice`, etc.), `payload_json`, `temp_id`, `created_at`, `status` (`PENDING`/`FAILED`/`DONE`), `last_error`

### 5.2 Sync Engine

- Runs as a background task / effect when:
  - Connectivity changes to online.
  - App becomes active.
- Processes `mutation_queue` in FIFO order per entity:
  - For each entry:
    - Call relevant Supabase service function.
    - On success:
      - Update local cache (e.g., replace temp invoice ID with server ID).
      - Mark queue item `DONE`.
    - On error:
      - Mark `FAILED`, keep error message.
      - Notify user via badge/toast in a “Sync Issues” area (Settings or offline banner).

### 5.3 Conflict Strategy

- MVP: **Last write wins** (server timestamp-based).
- Future: can add versioning/ETags if needed.

---

## 6. Database Schemas (Supabase – High Level)

The mobile app **shares the exact same Supabase proje   ct and core schema** as the BillZest web app. Any new tables or columns for mobile-only features must be added as **additive migrations** that keep the web app compatible.

The baseline schema below is taken from `BillZest_Web/docs/SYSTEM_ARCHITECTURE.md`.

### 6.1 Existing Core Tables (Shared Web + Mobile)

**`bill_config`**  
Configuration settings for billing generation.
- `id` (uuid, PK)
- `user_id` (uuid)
- `store_name` (text)
- `address` (text)
- `phone` (text)
- `gst_number` (text)
- `language` (text)
- `paper_size` (text)
- `template_data` (json)
- `created_at`, `updated_at` (timestamp)

**`clients`**  
Customer information (mobile UI will label these as "Customers").
- `id` (uuid, PK)
- `user_id` (uuid)
- `name` (text)
- `email` (text)
- `phone` (text)
- `address` (text)
- `notes` (text)
- `created_at`, `updated_at` (timestamp)

**`products`**  
Inventory items.
- `id` (uuid, PK)
- `user_id` (uuid)
- `name` (text)
- `description` (text)
- `category` (text)
- `price` (numeric)
- `mrp` (numeric)
- `stock` (numeric)
- `unit` (text)
- `barcode` (text)
- `sku` (text)
- `image_url` (text)
- `is_active` (boolean)
- `expiry_date` (date)
- `created_at`, `updated_at` (timestamp)

**`invoices`**  
Sales records.
- `id` (uuid, PK)
- `user_id` (uuid)
- `client_id` (uuid, FK → `clients.id`)
- `invoice_number` (text)
- `issue_date` (date)
- `due_date` (date)
- `status` (text)
- `subtotal` (numeric)
- `tax_rate` (numeric)
- `tax_amount` (numeric)
- `total_amount` (numeric)
- `notes` (text)
- `created_at`, `updated_at` (timestamp)

**`invoice_items`**  
Line items for each invoice.
- `id` (uuid, PK)
- `invoice_id` (uuid, FK → `invoices.id`)
- `description` (text)
- `quantity` (numeric)
- `unit_price` (numeric)
- `amount` (numeric)
- `created_at` (timestamp)

**`payments`**  
Payment records for invoices.
- `id` (uuid, PK)
- `user_id` (uuid)
- `invoice_id` (uuid, FK → `invoices.id`)
- `amount` (numeric)
- `payment_date` (date)
- `payment_method` (text)
- `reference_number` (text)
- `notes` (text)
- `created_at` (timestamp)

**`profiles`**  
User profile information.
- `id` (uuid, PK)
- `full_name` (text)
- `business_name` (text)
- `email` (text)
- `phone` (text)
- `address` (text)
- `created_at`, `updated_at` (timestamp)

These tables form the **shared contract** between web and mobile. All mobile features that touch billing, products, clients/customers, and payments must use these tables and their existing semantics.

### 6.2 Planned Additive Tables (Shared, Future)

To support roadmap items like **Purchases** and **CreditBook** in both web and mobile, we may introduce additional tables via Supabase migrations (names illustrative):

- `purchases` / `purchase_items` – for stock-in and vendor purchases.
- `credit_entries` – for explicit credit/ledger tracking per client.
- `notification_events` – for system notifications (low stock, payment due, etc.).

These tables:
- Will be defined in the **shared `supabase/migrations`** folder in `BillZest_Web` so both apps see the same schema.
- Must be strictly additive (no breaking changes to existing tables).
- Can then be consumed by mobile service modules and, when needed, by new or extended web pages.

---

## 7. API Contract Definitions (Service Layer)

Located in `/src/supabase`.

### 7.1 Supabase Client

- `supabaseClient.ts`
  - Exports configured Supabase client (URL + anon key).
  - Handles:
    - Auth session listener.
    - Singleton client instance.

### 7.2 Module Service Files

Each module exposes typed functions. Examples (TypeScript signatures for clarity; not implementation):

**`/src/supabase/productsService.ts`**
- `getProducts(params: { search?: string; status?: 'LOW_STOCK' | 'IN_STOCK' | 'OUT_OF_STOCK'; page?: number; limit?: number; }): Promise<Product[]>`
- `getProductById(id: string): Promise<Product | null>`
- `createProduct(input: CreateProductInput): Promise<Product>`
- `updateProduct(id: string, input: UpdateProductInput): Promise<Product>`
- `softDeleteProduct(id: string): Promise<void>`

**`/src/supabase/customersService.ts`**
- Similar list/get/create/update/softDelete APIs.

**`/src/supabase/invoicesService.ts`**
- `getInvoices(params: { status?: Status; dateRange?: { from: string; to: string }; customerId?: string; page?: number; limit?: number; }): Promise<Invoice[]>`
- `getInvoiceById(id: string): Promise<InvoiceWithItems>`
- `createInvoice(input: CreateInvoiceInput): Promise<InvoiceWithItems>`
- `updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice>`
- `recordPayment(input: RecordPaymentInput): Promise<Payment>`
- Under the hood, uses Supabase `from('invoices')` etc., ensuring tenant filtering.

**`/src/supabase/creditBookService.ts`**
- `getCustomerCredits(businessId, customerId)`
- `getCreditOverview(businessId)`
- `createCreditEntry`, `settleCreditEntry`, etc.

All services:
- Respect RLS via `business_id` filter and policies.
- Normalize errors to a standard `AppError` type (see next section).

---

## 8. Error-Handling Model

### 8.1 Error Types

Define an `AppError` structure:

- `type`: `'NETWORK' | 'AUTH' | 'RLS' | 'VALIDATION' | 'UNKNOWN'`
- `code`: string (e.g., Supabase error code or custom code)
- `message`: user-friendly message
- `details`: optional raw error info (for logging)

### 8.2 Sources

- **Network errors**: connectivity issues, timeouts.
- **Auth errors**: invalid tokens, session expired, unauthorized.
- **RLS/Permission errors**: Supabase `403` or policy failures.
- **Validation errors**: from server or client-side logic.
- **Unknown errors**: fallback.

### 8.3 Handling Strategy

- Service functions catch raw Supabase errors and convert to `AppError`.
- Logic modules decide:
  - Whether to surface error as a toast, in-form error, or screen-level error.
  - When to retry automatically (e.g., network).

- UI:
  - Uses generic `ErrorStateView` for screen-level failures.
  - Uses inline error messages for forms (e.g., product form, invoice form).
  - Shows offline banner when network is down and operations are queued.

---

## 9. Logic Layer Interactions

Located in `/src/logic`.

### 9.1 Modules

- `invoiceLogic.ts`
  - `createInvoice(input)`: orchestrates:
    - Local validation (items, totals).
    - Offline vs online branching.
    - Writes to local cache and queue if offline.
  - `useInvoiceDetail(id)` hook: fetch from cache + Supabase.
  - `recordPayment(invoiceId, paymentInput)`.

- `billingLogic.ts`
  - Focused on New Invoice screen:
    - Functions for:
      - Adding/removing items.
      - Calculating totals, tax, discounts.
      - Validating invoice constraints.
    - Pure functions + hooks to keep POS screen fast and testable.

- `stockLogic.ts`
  - `applyPurchaseToStock(purchase): void`
  - `applyInvoiceToStock(invoice): void`
  - `adjustStock(productId, delta, reason): void`

- `customerLogic.ts`
  - `useCustomerDetail(id)`
  - `calculateCustomerBalance(customerId)`
  - `recordCustomerPayment`

### 9.2 Interaction Flow Example (New Invoice)

1. `NewInvoiceScreen` uses `billingLogic` for local item editing and totals.
2. On submit:
   - `invoiceLogic.createInvoice(formData)` is called.
3. `invoiceLogic`:
   - Calls `billingLogic.validateInvoice(formData)`.
   - If offline → enqueues mutation, writes local invoice with `is_pending_sync = true`.
   - If online → uses `invoicesService.createInvoice`, updates caches, triggers UI refresh.
4. `stockLogic` then updates product stock (local + server as applicable).

---

## 10. Folder Structure

Within `BillZest_Mobile` project:

```text
BillZest_Mobile/
  App.tsx
  index.js
  ...
  /src
    /screens
      /Dashboard
        DashboardScreen.tsx
      /Products
        ProductsListScreen.tsx
        ProductDetailScreen.tsx
        ProductFormScreen.tsx
      /Customers
        CustomersListScreen.tsx
        CustomerDetailScreen.tsx
        CustomerFormScreen.tsx
      /Invoices
        InvoicesListScreen.tsx
        InvoiceDetailScreen.tsx
        NewInvoiceScreen.tsx
      /Purchase
        PurchaseScreen.tsx
      /CreditBook
        CreditBookScreen.tsx
        CustomerCreditDetailScreen.tsx
      /Reports
        ReportsScreen.tsx
      /Settings
        SettingsRootScreen.tsx
        ProfileScreen.tsx
        BusinessInfoScreen.tsx
        BillingTemplatesScreen.tsx
        PlansScreen.tsx
        NotificationsSettingsScreen.tsx
        SecuritySettingsScreen.tsx
        IntegrationsScreen.tsx
      /Notifications
        NotificationsScreen.tsx
      /Auth
        LoginScreen.tsx
    /components
      Button.tsx
      Card.tsx
      Input.tsx
      Text.tsx
      ListItem.tsx
      Badge.tsx
      Header.tsx
      DrawerContent.tsx
      ...
    /navigation
      RootNavigator.tsx
      AuthNavigator.tsx
      AppDrawerNavigator.tsx
      MainTabsNavigator.tsx
      ProductsStackNavigator.tsx
      CustomersStackNavigator.tsx
      InvoicesStackNavigator.tsx
      types.ts
    /theme
      dark.ts
      light.ts
      ThemeProvider.tsx
      tokens.ts (if mirroring web tokens)
    /supabase
      supabaseClient.ts
      productsService.ts
      customersService.ts
      invoicesService.ts
      purchasesService.ts
      creditBookService.ts
      settingsService.ts
      types.ts (generated or hand-written)
    /logic
      invoiceLogic.ts
      billingLogic.ts
      stockLogic.ts
      customerLogic.ts
      offlineSync.ts
    /state (optional, if using context hooks here)
      AuthContext.tsx
      AppSettingsContext.tsx
      OfflineContext.tsx
    /storage
      sqlite.ts (helpers for DB setup & queries)
      mmkv.ts
      persistence.ts (query cache persistence)
    /types
      domain.ts (Product, Customer, Invoice types, etc.)
    /utils
      formatters.ts (currency, date, numbers)
      validators.ts
      constants.ts
```

This structure respects the required directories: `/screens`, `/components`, `/navigation`, `/theme`, `/supabase`, `/logic`, and adds small, focused directories where they bring clarity (`/storage`, `/types`, `/utils`, `/state`).