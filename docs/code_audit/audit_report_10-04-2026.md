# BillZest Mobile — Comprehensive Audit Report

**Date:** April 10, 2026  
**Scope:** `d:\Applications\BillZest_Parent\BillZest_Mobile\src` (122 source files)  
**Stack:** Expo 54, React 19, React Native 0.81.5, React Navigation 7, Supabase, React Query, Zustand

---

## EXECUTIVE SUMMARY

**Overall Health Score: 5.5 / 10**

The app has a solid foundation — centralized theme tokens, proper auth gating, React Query for data, Zustand for local state, offline-first considerations, and a well-structured ErrorBoundary. However, it suffers from god-components, pervasive `any` usage (39 files), race conditions in stock management, hardcoded credentials, and minimal accessibility coverage. The codebase is functional but fragile; one complex flow (invoice creation) carries 1235 lines of coupled UI + business logic.

### Top 5 Critical Issues

| # | Issue | File | Why it matters |
|---|-------|------|---------------|
| 1 | **Hardcoded Supabase credentials in source** | [config.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/config.ts) | Anon key + URL committed to repo; leaked in any public bundle |
| 2 | **Race condition in stock adjustment** | [ordersService.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/ordersService.ts#L183-L226) | Read-then-write without transactions — concurrent orders can oversell |
| 3 | **AddSaleScreen is a 1235-line god-component** | [AddSaleScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx) | Unmaintainable, mixes validation/navigation/API/UI; any change risks regression |
| 4 | **`any` type used across 39 files** | Project-wide | Defeats TypeScript safety; silent type mismatches cause runtime crashes |
| 5 | **All large lists use ScrollView + `.map()` instead of FlatList** | [ProductsListScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Products/ProductsListScreen.tsx), [InvoicesListScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/InvoicesListScreen.tsx), [AddItemsScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddItemsScreen.tsx) | Every item renders at once — severe performance with 100+ products |

---

## FINDINGS BY CATEGORY

### 1. BROKEN OR SUSPECT FUNCTIONALITY

**[CRITICAL]** — [ordersService.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/ordersService.ts#L183-L226) / [createOrder](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/ordersService.ts#124-249)
> Stock adjustment uses read-then-write (fetch current stock → subtract → update). Two concurrent sales of the same product will both read the same stock value and both succeed, resulting in negative stock. **Fix:** Use a Supabase RPC/stored procedure with `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1`.

**[HIGH]** — [AddSaleScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#L93-L141) / Edit mode `useEffect`
> The effect depends on `[isEditMode, existingInvoice, products, loadInvoiceData]` but [loadInvoiceData](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/stores/invoiceStore.ts#154-209) is a Zustand action that changes identity on every render (not memoized). This causes the effect to re-fire repeatedly. **Fix:** Remove [loadInvoiceData](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/stores/invoiceStore.ts#154-209) from the dependency array and reference it directly from the store.

**[HIGH]** — [AddSaleScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#L394-L398) / Edit mode doesn't actually update items
> When editing, [handleGenerateBill](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#331-465) only calls `updateInvoice.mutateAsync({ orderId, status: 'sent' })` — it never sends the modified line items or updated totals. The "edit" only changes status. **Fix:** Use `ordersService.updateOrder` with the full updated items payload.

**[MEDIUM]** — [DashboardScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Dashboard/DashboardScreen.tsx#L52-L53)
> `saleSheetVisible` state is set to `true` via quick link but there is no corresponding modal/sheet that reads this state. The "New Sale" quick link sets `setSaleSheetVisible(true)` but nothing renders when it's true — user taps and nothing happens. **Fix:** Either navigate to [AddSale](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#58-855) or render the sheet.

**[MEDIUM]** — [DashboardScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Dashboard/DashboardScreen.tsx#L202-L209) / Navigation params mismatch
> Quick link `add-party` navigates to `{ screen: 'CustomersList' }` but the route is registered as `CustomersMain`. Quick link `scan-item` navigates to `{ screen: 'ProductsList' }` but the route is `ProductsMain`. Both are silent failures (screen not found in stack). **Fix:** Use `'CustomersMain'` and `'ProductsMain'`.

**[MEDIUM]** — [invoiceStore.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/stores/invoiceStore.ts#L74)
> Tax amount scaling: [(i.taxAmount / i.quantity) * (i.quantity + 1)](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/App.tsx#12-28) — dividing by int then multiplying introduces floating point drift on repeated add/remove cycles. **Fix:** Recalculate from rate: `const taxPerUnit = (i.rate * i.taxRate) / 100; const newTaxAmount = taxPerUnit * newQty;`

---

### 2. SUPABASE & API WIRING

**[CRITICAL]** — [config.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/config.ts)
> Supabase URL and anon key are hardcoded in plain text. Even though anon keys are "public", this makes key rotation impossible without a code change. **Fix:** Move to environment variables via `expo-constants` or `.env` with `react-native-dotenv`.

**[HIGH]** — [ordersService.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/ordersService.ts#L357-L365) / [deleteOrder](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/ordersService.ts#354-366)
> Deletes order items first, then the order. If the second delete fails, items are orphaned. No transaction wrapping. Error from `order_items` delete is not checked. **Fix:** Wrap in a Supabase RPC or at minimum check both errors.

**[MEDIUM]** — [realtimeService.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/realtimeService.ts)
> Realtime subscriptions are defined but I found no evidence of them being used in any screen or hook. They are dead code. The [onProductsChanged](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/realtimeService.ts#11-29) and [onOrdersChanged](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/realtimeService.ts#30-48) methods are never called. **Fix:** Either integrate into React Query invalidation or remove.

**[MEDIUM]** — [ordersService.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/ordersService.ts#L76)
> Search filter uses `customer_name` and `customer_phone` columns in the `.or()` clause, but the orders table joins `parties` — these column names may not exist on the `orders` table (the party name is on the `parties` table). This would silently return no search results. **Fix:** Verify column names match the actual schema or use a view.

**[LOW]** — [supabaseClient.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/supabase/supabaseClient.ts#L8-L9)
> Logs sensitive URL at startup with `logger.log('[Supabase] URL:', CONFIG.SUPABASE_URL)`. Production builds should not log infrastructure URLs. **Fix:** Gate behind `__DEV__`.

---

### 3. UI CLUTTER & SPACE WASTAGE

**[MEDIUM]** — [InvoicesListScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/InvoicesListScreen.tsx#L186-L199)
> "View Reports" hero card takes ~100px of vertical space with low information density. It's a permanent ad for the Reports screen that users will quickly stop noticing. **Fix:** Remove or make dismissible.

**[MEDIUM]** — [AddSaleScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#L758)
> `<View style={{ height: 120 }} />` — hardcoded 120px spacer at bottom of scroll creates excessive dead space on many screen sizes. **Fix:** Use `paddingBottom` on `contentContainerStyle` instead.

**[LOW]** — [DashboardScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Dashboard/DashboardScreen.tsx#L483)
> `paddingBottom: 100` on content container is excessive — this is intended to clear the tab bar but 100px is too much (tab bars are ~50-60px). **Fix:** Reduce to 80 or use `useSafeAreaInsets().bottom + tabBarHeight`.

---

### 4. VISUAL & COMPONENT INCONSISTENCY

**[MEDIUM]** — Theme tokens
> Colors are properly centralized in [tokens.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/theme/tokens.ts) ✅, but several files use hardcoded hex colors:
> - `'#fff'` appears in AddSaleScreen (line 782), AddItemsScreen (line 275, 487), InvoicesListScreen (line 477)
> - `'rgba(250,204,21,0.9)'` in ProductsListScreen (line 624)
> - `'#1a1a2e'` shadow color in AddSaleScreen, AddItemsScreen
> - `'rgba(0,0,0,0.15)'` in InvoicesListScreen (line 504)
>
> **Fix:** Add `shadowDefault`, `white`, `surface` tokens to the theme system.

**[MEDIUM]** — Font families
> No custom font family is loaded via `expo-font`. All text uses system defaults. The [ErrorBoundary](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/components/ErrorBoundary.tsx#22-74) uses `fontFamily: 'monospace'` but that's for error display only. **Fix:** Load a font like Inter via `expo-font` and set it in a global text style.

**[LOW]** — Icon library consistency
> ✅ The app consistently uses `lucide-react-native` throughout — good.

**[LOW]** — Border radius inconsistency
> Theme defines `radius: 16` but styles use 8, 10, 12, 14, 16, 20, 24, 999 throughout. No spacing scale is enforced. **Fix:** Define `radiusSm`, `radiusMd`, `radiusLg`, `radiusFull` in tokens.

---

### 5. SCREEN-LEVEL REVIEW

| Screen | Purpose | CTA | Loading | Empty | Error | Keyboard | Scroll |
|--------|---------|-----|---------|-------|-------|----------|--------|
| **DashboardScreen** | ✅ | ✅ Quick actions | ✅ Skeleton | ✅ | ✅ | N/A | ✅ |
| **LoginScreen** | ✅ | ✅ Sign In | ❌ No skeleton | N/A | ✅ | ✅ KAV | ✅ |
| **ProductsListScreen** | ✅ | ✅ FAB | ✅ Spinner | ✅ | ✅ | N/A | ✅ |
| **InvoicesListScreen** | ✅ | ✅ FAB | ✅ Skeleton | ✅ | ✅ | N/A | ✅ |
| **AddSaleScreen** | ✅ | ✅ Generate Bill | ❌ No loading | ❌ No empty (items) | ✅ Alert | ❌ No KAV | ✅ |
| **AddItemsScreen** | ✅ | ✅ Add to Invoice | ❌ No loading | ✅ | ❌ No error | ❌ No KAV | ✅ |
| **CustomerFormScreen** | ✅ | ✅ | N/A | N/A | N/A | ❌ No KAV* | ✅ |

> **Key gaps:** [AddSaleScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#58-855) and [AddItemsScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddItemsScreen.tsx#60-282) have text inputs but no `KeyboardAvoidingView`, meaning the keyboard occludes inputs on iOS. Only 4 files in the entire project use `KeyboardAvoidingView`.

---

### 6. COMPONENT QUALITY

**[HIGH]** — [AddSaleScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx) — **1235 lines**
> God-component handling: invoice meta, party selection, item management, barcode scanning, adjustments, tax calculation, currency formatting, validation, order creation, navigation, and all styles. **Fix:** Extract into: `useInvoiceFlow` hook (validation + submission), `InvoiceMetaStrip`, `InvoiceItemsList`, `InvoiceTotalsCard`, `InvoiceBottomBar`.

**[HIGH]** — `any` overuse (39 files affected)
> Key offenders: `navigation: useNavigation<any>()` in every screen, `route: useRoute<any>()`, [(inv as any).received_amount](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/App.tsx#12-28), `callback: (payload: any) => void` in realtimeService.ts, `const product: any` in AddItemsScreen. **Fix:** Define proper navigation param types (`RootStackParamList`) and domain types.

**[MEDIUM]** — Duplicated utility functions
> [formatCurrency](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#274-280) is defined identically in AddSaleScreen (line 274), AddItemsScreen (line 83), and at least InvoicesListScreen. [getInitials](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#324-330) is defined in AddSaleScreen (line 324) and AddItemsScreen (line 52). **Fix:** Extract to `src/utils/formatting.ts`.

**[LOW]** — Inline styles
> `style={{ flex: 1 }}` (AddSaleScreen line 598), `style={{ height: 120 }}` (line 758), `style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}` (line 741). **Fix:** Move to `StyleSheet.create`.

---

### 7. NAVIGATION & FLOW

**[HIGH]** — Broken navigation targets from Dashboard quick links
> [DashboardScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Dashboard/DashboardScreen.tsx#45-461) line 202: navigates to `{ screen: 'CustomersList' }` — should be `'CustomersMain'`.
> Line 207: navigates to `{ screen: 'ProductsList' }` — should be `'ProductsMain'`.
> Both produce silent navigation failures.

**[MEDIUM]** — Drawer "Vendors" screen is outside PurchaseStack
> [RootNavigator.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/navigation/RootNavigator.tsx#L313-L315): `SuppliersListScreen` is registered directly as a Drawer screen (not wrapped in a stack), making it a dead-end — no back navigation, no sub-navigation to supplier details. **Fix:** Wrap in its own stack or navigate within PurchaseStack.

**[LOW]** — Auth gate is proper
> ✅ [RootNavigator](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/navigation/RootNavigator.tsx#408-451) correctly gates [AppDrawerNavigator](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/navigation/RootNavigator.tsx#288-375) behind `user` check, with loading state handled.

**[LOW]** — No deep link handling
> No linking config found in `NavigationContainer`. Not blocking for V1, but worth noting.

---

### 8. PERFORMANCE RED FLAGS

**[CRITICAL]** — All product/invoice lists use `ScrollView` + `.map()` instead of `FlatList`
> [ProductsListScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Products/ProductsListScreen.tsx#L337): `filteredProducts.map(product => ...)` renders ALL products at once.
> [InvoicesListScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/InvoicesListScreen.tsx#L294): `invoices.map(invoice => ...)` renders ALL invoices at once.
> [AddItemsScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddItemsScreen.tsx#L179): `filtered.map(product => ...)` renders ALL products at once.
>
> With 200+ products, this causes significant frame drops and memory pressure. **Fix:** Replace with `FlatList` with `keyExtractor`, `getItemLayout` (for fixed-height items), and `windowSize={10}`.

**[HIGH]** — No `React.memo` on list item components
> `ProductCard`, `InvoiceCard`, `CustomerCard` are not memoized. Every parent re-render (e.g., search input change) re-renders every card. **Fix:** Wrap with `React.memo`.

**[MEDIUM]** — `Animated.Value` creates a new instance each render cycle
> [DashboardScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Dashboard/DashboardScreen.tsx#L58): `const [rotateAnim] = useState(new Animated.Value(0))` — correct pattern but the `useEffect` on line 228 uses `rotateAnim` in deps, causing animation restarts. **Fix:** Remove `rotateAnim` from the dependency array.

---

### 9. CODE QUALITY & BEST PRACTICES

**[HIGH]** — Files exceeding 300 lines (need splitting):
| File | Lines | Issue |
|------|-------|-------|
| [AddSaleScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx) | 1235 | God-component |
| [ProductsListScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Products/ProductsListScreen.tsx) | 635 | Styles + logic mixed |
| [DashboardScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Dashboard/DashboardScreen.tsx) | 555 | Heavy but acceptable |
| [InvoicesListScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/InvoicesListScreen.tsx) | 517 | Could extract styles |
| [AddItemsScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddItemsScreen.tsx) | 491 | Acceptable |
| [RootNavigator.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/navigation/RootNavigator.tsx) | 453 | Comments inflate count, OK |

**[MEDIUM]** — `console.log` in production code
> Found in [testSupabaseConnection.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/utils/testSupabaseConnection.ts) (11 occurrences) and [offlineQueue.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/utils/offlineQueue.ts) (1 occurrence). Also `console.error` in [ProductsListScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Products/ProductsListScreen.tsx#L178) and `console.warn` in [LoginScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Auth/LoginScreen.tsx#L110). **Fix:** Replace all with the existing `logger` utility.

**[MEDIUM]** — Missing TypeScript navigation types
> Every screen uses `useNavigation<any>()` and `useRoute<any>()`. No `RootStackParamList` type exists. **Fix:** Define param list types and use typed hooks.

**[LOW]** — Two validation utility files
> Both [validation.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/utils/validation.ts) (5887 bytes) and [validators.ts](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/utils/validators.ts) (5680 bytes) exist. **Fix:** Consolidate into one.

**[LOW]** — Empty `useEffect` in LoginScreen
> [LoginScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Auth/LoginScreen.tsx#L30-L37): `useEffect(() => { /* commented out */ }, [])` — dead code. **Fix:** Remove.

---

### 10. ACCESSIBILITY

**[HIGH]** — Limited `accessibilityLabel` coverage
> Only ~25 files out of 122 have any `accessibilityLabel`. Key missing areas:
> - All `Pressable` elements in [AddSaleScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#58-855) (back button, party selection, stepper buttons, adjustments)
> - Drawer items in `CustomDrawer`
> - Date range pills in [DashboardScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Dashboard/DashboardScreen.tsx#45-461)
> - All stepper buttons (`+`/`-`) in [AddItemsScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddItemsScreen.tsx#60-282)
>
> **Fix:** Add `accessibilityLabel` to every interactive `Pressable`, especially stepper controls ("Increase quantity for {product.name}").

**[MEDIUM]** — Small tap targets
> [AddSaleScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#L1026): `stepperBtn` has `paddingHorizontal: 4, paddingVertical: 2` — effective touch area is far below 44×44pt minimum.
> [AddItemsScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddItemsScreen.tsx#L424): `stepperBtn` has `padding: 2`.
>
> **Fix:** Set minimum `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}` or increase padding to 12px.

**[LOW]** — No color contrast validation
> Theme uses `hsl(0, 0%, 45%)` for `mutedForeground` on `hsl(0, 0%, 100%)` background (light mode) — contrast ratio ~4.2:1. Passes AA for body text (4.5:1 needed for small text). Some small labels at 10-11px may fail. **Fix:** Audit with a contrast checker tool.

---

## QUICK WINS (< 30 min each)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Fix Dashboard nav targets (`CustomersMain` / `ProductsMain`) | Quick links actually work | 5 min |
| 2 | Extract [formatCurrency](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#274-280) + [getInitials](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx#324-330) to `utils/formatting.ts` | Eliminate duplication | 15 min |
| 3 | Replace `console.log/warn/error` with `logger` across 4 files | Clean production logs | 10 min |
| 4 | Remove empty `useEffect` in LoginScreen | Dead code cleanup | 1 min |
| 5 | Move Supabase config to env variables | Security hygiene | 20 min |
| 6 | Add `accessibilityLabel` to all FABs, back buttons, and steppers | Major a11y improvement | 25 min |
| 7 | Replace hardcoded `'#fff'` with `tokens.primaryForeground` | Theme consistency | 10 min |
| 8 | Fix Dashboard "New Sale" quick link (navigate instead of setting unused state) | Feature works | 5 min |
| 9 | Add `hitSlop` to stepper buttons | Usability on mobile | 10 min |
| 10 | Add `KeyboardAvoidingView` to AddSaleScreen | Input not hidden by keyboard | 15 min |

---

## REFACTOR CANDIDATES

### 1. [AddSaleScreen.tsx](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddSaleScreen.tsx) → Invoice Flow Module
**Current:** 1235-line monolith handling everything from party selection to stock validation to API calls.

**Target:**
```
screens/Invoices/
  AddSaleScreen.tsx          (~200 lines — orchestrator only)
  components/
    InvoiceMetaStrip.tsx
    BillToCard.tsx
    InvoiceItemsList.tsx
    AdjustmentsSummary.tsx
    TotalsCard.tsx
    InvoiceBottomBar.tsx
  hooks/
    useInvoiceFlow.ts        (validation, submission, mode switching)
```

### 2. Navigation — Add Type Safety
**Current:** Every screen uses `useNavigation<any>()`.

**Target:** Create a `src/navigation/types.ts` file defining:
```typescript
export type RootStackParamList = {
  DashboardMain: undefined;
  ProductDetail: { productId: string };
  AddSale: { invoiceId?: string; initialMode?: 'sale' | 'purchase' };
  InvoiceDetail: { orderId: string; invoice?: Order };
  // ... all routes
};
```

### 3. Lists — Migrate to FlatList
**Current:** `ScrollView` + `.map()` for all product, invoice, and customer lists.

**Target:** Replace with `FlatList` in [ProductsListScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Products/ProductsListScreen.tsx#47-432), [InvoicesListScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/InvoicesListScreen.tsx#41-341), `CustomersListScreen`, [AddItemsScreen](file:///d:/Applications/BillZest_Parent/BillZest_Mobile/src/screens/Invoices/AddItemsScreen.tsx#60-282), `ExpensesScreen`, and `CreditBookScreen`. Wrap item components in `React.memo`.

### 4. Stock Management — Use Atomic Operations
**Current:** Read-then-write in JS for stock adjustments during order creation/cancellation.

**Target:** Create a Supabase RPC function:
```sql
CREATE FUNCTION adjust_stock(p_product_id UUID, p_delta INT)
RETURNS void AS $$
  UPDATE products SET stock_quantity = stock_quantity + p_delta WHERE id = p_product_id;
$$ LANGUAGE sql;
```
