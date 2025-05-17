
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomersPage from "./pages/CustomersPage";
import CartPage from "./pages/CartPage";
import SalesPage from "./pages/SalesPage";
import ProductsManagementPage from "./pages/ProductsManagementPage";
import DebtManagementPage from "./pages/DebtManagementPage";
import PromotionsPage from "./pages/PromotionsPage";
import LoginPage from "./pages/LoginPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import CustomerEditPage from "./pages/CustomerEditPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/debts" element={<DebtManagementPage />} />
                  </Route>
                </Route>
                
                {/* Admin-only routes */}
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route element={<Layout />}>
                    <Route path="/sales" element={<SalesPage />} />
                    <Route path="/products" element={<ProductsManagementPage />} />
                    <Route path="/promotions" element={<PromotionsPage />} />
                    <Route path="/categories" element={<CategoryManagementPage />} />
                  </Route>
                </Route>
                
                {/* Redirect or 404 for unknown routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <Toaster />
              <Sonner />
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
