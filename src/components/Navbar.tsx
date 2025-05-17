import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, User, Package, Users, BarChart2, CreditCard, MessageCircle, LogOut, Grid3X3, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const totalItems = getTotalItems();

  const regularMenuItems = [
    { icon: <Package size={20} />, label: 'Produtos', path: '/' },
    { icon: <Users size={20} />, label: 'Clientes', path: '/customers' },
    { icon: <CreditCard size={20} />, label: 'Gerenciar Dívidas', path: '/debts' },
  ];

  const adminMenuItems = [
    { icon: <BarChart2 size={20} />, label: 'Gerenciar Produtos', path: '/products' },
    { icon: <User size={20} />, label: 'Vendas', path: '/sales' },
    { icon: <MessageCircle size={20} />, label: 'Promoções', path: '/promotions' },
    { icon: <Folder size={20} />, label: 'Categorias', path: '/categories' },
  ];

  // Combine menus based on user role
  const mainMenuItems = isAdmin 
    ? [...regularMenuItems, ...adminMenuItems]
    : regularMenuItems;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="py-4">
                <h2 className="text-lg font-poppins font-bold text-carrefour-blue mb-6">Bairro Mercadinho</h2>
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-center mb-2">
                    <User size={16} className="mr-2 text-gray-500" />
                    <span className="font-medium">{user?.username || 'Usuário'}</span>
                    {isAdmin && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Admin</span>}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="flex items-center w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" /> Sair
                  </Button>
                </div>
                <nav className="space-y-2">
                  {mainMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center py-2 px-3 rounded-md hover:bg-carrefour-gray transition-colors ${
                        isActive(item.path) 
                          ? 'bg-carrefour-blue text-white' 
                          : 'text-gray-700'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex-1 md:flex-initial">
          <Link to="/" className="text-xl font-poppins font-bold text-carrefour-blue">Bairro Mercadinho</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {mainMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center text-sm font-medium ${
                isActive(item.path) 
                  ? 'text-carrefour-blue' 
                  : 'text-gray-600 hover:text-carrefour-blue'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Menu & Cart Icon */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout} 
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={16} className="mr-2" /> Sair
            </Button>
          </div>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-carrefour-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
