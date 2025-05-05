
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { DataProvider } from "./context/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomersPage from "./pages/CustomersPage";
import CartPage from "./pages/CartPage";
import SalesPage from "./pages/SalesPage";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/sales" element={<SalesPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </CartProvider>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
