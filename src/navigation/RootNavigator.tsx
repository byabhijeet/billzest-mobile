import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import ProductsListScreen from "../screens/Products/ProductsListScreen";
import ProductDetailScreen from "../screens/Products/ProductDetailScreen";
import ProductFormScreen from "../screens/Products/ProductFormScreen";
import StockSummaryScreen from "../screens/Products/StockSummaryScreen";
// import ProductStockAdjustScreen from '../screens/Products/ProductStockAdjustScreen';
import CustomersListScreen from "../screens/Customers/CustomersListScreen";
import CustomerDetailScreen from "../screens/Customers/CustomerDetailScreen";
import CustomerFormScreen from "../screens/Customers/CustomerFormScreen";
import CategoriesListScreen from "../screens/Products/CategoriesListScreen";
import CategoryFormSheet from "../screens/Products/CategoryFormSheet";
import BarcodeGeneratorScreen from "../screens/Inventory/BarcodeGeneratorScreen";
import InvoicesListScreen from "../screens/Invoices/InvoicesListScreen";
import InvoiceDetailScreen from "../screens/Invoices/InvoiceDetailScreen";
import InvoiceSummaryScreen from "../screens/Invoices/InvoiceSummaryScreen";
import AddItemsScreen from "../screens/Invoices/AddItemsScreen";
import AddSaleScreen from "../screens/Invoices/AddSaleScreen";
import SimplifiedPOSScreen from "../screens/Invoices/SimplifiedPOSScreen";
import PurchaseListScreen from "../screens/Purchase/PurchaseListScreen";
import MobileLoginScreen from "../screens/Auth/MobileLoginScreen";
import VerifyOTPScreen from "../screens/Auth/VerifyOTPScreen";
import PurchaseDetailScreen from "../screens/Purchase/PurchaseDetailScreen";
import SuppliersListScreen from "../screens/Purchase/SuppliersListScreen";
import CreditBookScreen from "../screens/CreditBook/CreditBookScreen";
import PartyLedgerScreen from "../screens/CreditBook/PartyLedgerScreen";
import AddPartySheet from "../components/modals/AddPartySheet";
import AddCreditTransactionSheet from "../screens/CreditBook/AddCreditTransactionSheet";
import ExpensesScreen from "../screens/Expenses/ExpensesScreen";
import ReportsScreen from "../screens/Reports/ReportsScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import BusinessInfoScreen from "../screens/Settings/BusinessInfoScreen";
import OnlineStoreConfigScreen from "../screens/Settings/OnlineStoreConfigScreen";
import BillConfigScreen from "../screens/Settings/BillingTemplatesScreen";
// import PlansScreen from '../screens/Settings/PlansScreen';
// import NotificationsScreen from '../screens/Settings/NotificationsScreen';
// import SecurityScreen from '../screens/Settings/SecurityScreen';
// import IntegrationsScreen from '../screens/Settings/IntegrationsScreen';
import { View, ActivityIndicator } from "react-native";
import { centeredScreenStyles } from "../theme/layout";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useThemeTokens } from "../theme/ThemeProvider";
import { LayoutDashboard, Package, Users, FileText } from "lucide-react-native";
import { useSupabase } from "../contexts/SupabaseContext";
import LoginScreen from "../screens/Auth/LoginScreen";
import CustomDrawer from "./CustomDrawer";
import { useOfflineSync } from "../hooks/useOfflineSync";
import ErrorBoundary from "../components/ErrorBoundary";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const DashboardTabStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="DashboardMain"
      component={DashboardScreen}
      options={{ title: "Dashboard" }}
    />
    <Stack.Screen
      name="MobileLogin"
      component={MobileLoginScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
    <Stack.Screen
      name="VerifyOTP"
      component={VerifyOTPScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
  </Stack.Navigator>
);

const ProductsTabStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="ProductsMain"
      component={ProductsListScreen}
      options={{ title: "Products" }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: "Product Details" }}
    />
    <Stack.Screen
      name="ProductForm"
      component={ProductFormScreen}
      options={{ title: "Product Form" }}
    />
    <Stack.Screen
      name="StockSummary"
      component={StockSummaryScreen}
      options={{ title: "Stock Summary" }}
    />
    <Stack.Screen
      name="CategoriesList"
      component={CategoriesListScreen}
      options={{ title: "Categories" }}
    />
    <Stack.Screen
      name="CategoryFormSheet"
      component={CategoryFormSheet}
      options={{ headerShown: false, presentation: "formSheet" }}
    />
    <Stack.Screen
      name="BarcodeGenerator"
      component={BarcodeGeneratorScreen}
      options={{ title: "Barcode Generator", headerShown: false }}
    />
    {/* OUT OF SCOPE FOR V1 — retained for future releases
    <Stack.Screen
      name="StockAdjust"
      component={ProductStockAdjustScreen}
      options={{ title: 'Stock Adjustment' }}
    />
    */}
  </Stack.Navigator>
);

const CustomersTabStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="CustomersMain"
      component={CustomersListScreen}
      options={{ title: "Customers" }}
    />
    <Stack.Screen
      name="CustomerDetail"
      component={CustomerDetailScreen}
      options={{ title: "Customer Details" }}
    />
    <Stack.Screen
      name="CustomerForm"
      component={CustomerFormScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
    <Stack.Screen
      name="AddPartySheet"
      component={AddPartySheet}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
  </Stack.Navigator>
);

const InvoicesTabStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="InvoicesMain"
      component={InvoicesListScreen}
      options={{ title: "Invoices" }}
    />
    <Stack.Screen
      name="InvoiceDetail"
      component={InvoiceDetailScreen}
      options={{ title: "Invoice Detail" }}
    />
    <Stack.Screen
      name="AddSale"
      component={AddSaleScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
    <Stack.Screen
      name="InvoiceSummary"
      component={InvoiceSummaryScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddItems"
      component={AddItemsScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
    <Stack.Screen
      name="CustomerForm"
      component={CustomerFormScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
    <Stack.Screen
      name="AddPartySheet"
      component={AddPartySheet}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
    <Stack.Screen
      name="SimplifiedPOS"
      component={SimplifiedPOSScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
  </Stack.Navigator>
);

const PurchaseStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="PurchaseList"
      component={PurchaseListScreen}
      options={{ title: "Purchases" }}
    />
    <Stack.Screen
      name="PurchaseDetail"
      component={PurchaseDetailScreen}
      options={{ title: "Purchase Detail" }}
    />
    <Stack.Screen
      name="PurchaseCreate"
      component={AddSaleScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
      initialParams={{ initialMode: "purchase" }}
    />
    <Stack.Screen
      name="PurchaseCreateVendor"
      component={CustomerFormScreen}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
    <Stack.Screen
      name="SuppliersList"
      component={SuppliersListScreen}
      options={{ title: "Suppliers" }}
    />
    <Stack.Screen
      name="AddPartySheet"
      component={AddPartySheet}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
  </Stack.Navigator>
);

const ExpensesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="ExpensesMain"
      component={ExpensesScreen}
      options={{ title: "Expenses" }}
    />
  </Stack.Navigator>
);

const VendorsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="SuppliersList"
      component={SuppliersListScreen}
      options={{ title: "Vendors / Suppliers" }}
    />
  </Stack.Navigator>
);

const CreditBookStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="CreditBookMain"
      component={CreditBookScreen}
      options={{ title: "Credit Book" }}
    />
    <Stack.Screen
      name="PartyLedgerScreen"
      component={PartyLedgerScreen}
      options={{ title: "Party Ledger" }}
    />
    <Stack.Screen
      name="AddPartySheet"
      component={AddPartySheet}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
    <Stack.Screen
      name="AddCreditTransactionSheet"
      component={AddCreditTransactionSheet}
      options={{ headerShown: false, presentation: "fullScreenModal" }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="DashboardTab"
      component={DashboardTabStack}
      options={{
        title: "Dashboard",
        tabBarIcon: ({ color, size }) => (
          <LayoutDashboard color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="ProductsTab"
      component={ProductsTabStack}
      options={{
        title: "Products",
        tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name="CustomersTab"
      component={CustomersTabStack}
      options={{
        title: "Customers",
        tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
      }}
    />
    <Tab.Screen
      name="InvoicesTab"
      component={InvoicesTabStack}
      options={{
        title: "Invoices",
        tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
      }}
    />
  </Tab.Navigator>
);

const AppDrawerNavigator = () => {
  const { tokens } = useThemeTokens();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerTitleAlign: "left",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: tokens.background },
        headerTintColor: tokens.foreground,
        drawerStyle: { width: "75%" },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabs}
        options={{ title: "Home" }}
      />
      <Drawer.Screen
        name="Purchases"
        component={PurchaseStack}
        options={{ title: "Purchases" }}
      />
      <Drawer.Screen
        name="Vendors"
        component={VendorsStack}
        options={{ title: "Vendors / Suppliers" }}
      />
      <Drawer.Screen
        name="Expenses"
        component={ExpensesStack}
        options={{ title: "Expenses" }}
      />
      <Drawer.Screen
        name="CreditBook"
        component={CreditBookStack}
        options={{ title: "Credit Book" }}
      />
      {/* OUT OF SCOPE FOR V1 — retained for future releases */}
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: "Reports" }}
      />
      {/* BusinessInfo moved to SettingsStack
      <Drawer.Screen
        name="BusinessInfo"
        component={BusinessInfoScreen}
        options={{ title: 'Business Info' }}
      />
      */}
      {/* OUT OF SCOPE FOR V1 — retained for future releases
      <Drawer.Screen
        name="BillingTemplates"
        component={BillingTemplatesScreen}
        options={{ title: 'Billing Templates' }}
      />
      <Drawer.Screen
        name="Plans"
        component={PlansScreen}
        options={{ title: 'Plans' }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Drawer.Screen
        name="Security"
        component={SecurityScreen}
        options={{ title: 'Security' }}
      />
      <Drawer.Screen
        name="Integrations"
        component={IntegrationsScreen}
        options={{ title: 'Integrations' }}
      />
      */}
      <Drawer.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{ title: "Settings" }}
      />
      <Drawer.Screen
        name="SimplifiedPOS"
        component={SimplifiedPOSScreen}
        options={{ title: "Quick Bill POS", headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

const SettingsStack = createNativeStackNavigator();
const SettingsStackNavigator = () => (
  <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
    <SettingsStack.Screen
      name="SettingsMain"
      component={SettingsScreen}
      options={{ title: "Settings" }}
    />
    <SettingsStack.Screen
      name="BusinessInfo"
      component={BusinessInfoScreen}
      options={{ title: "Business Info" }}
    />
    <SettingsStack.Screen
      name="OnlineStoreConfig"
      component={OnlineStoreConfigScreen}
      options={{ title: "Online Store Setup" }}
    />
    <SettingsStack.Screen
      name="BillingTemplates"
      component={BillConfigScreen}
      options={{ title: "Billing Settings" }}
    />
  </SettingsStack.Navigator>
);

const RootNavigator = () => {
  const { mode, tokens } = useThemeTokens();
  const { user, isLoading } = useSupabase();
  const shouldBypassAuth = false;

  // Initialize offline sync - will sync when app becomes active and on mount
  useOfflineSync();

  const navigationTheme = {
    ...(mode === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      primary: tokens.primary,
      background: tokens.background,
      card: tokens.card,
      text: tokens.foreground,
      border: tokens.border,
      notification: tokens.destructive,
    },
  };

  if (isLoading && !shouldBypassAuth) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <View style={centeredScreenStyles.container}>
          <ActivityIndicator size="large" color={tokens.primary} />
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <ErrorBoundary>
        {shouldBypassAuth || user ? (
          <AppDrawerNavigator />
        ) : (
          <AuthStackNavigator />
        )}
      </ErrorBoundary>
    </NavigationContainer>
  );
};

export default RootNavigator;
