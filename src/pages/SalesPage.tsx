
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Banknote, 
  CreditCard, 
  User, 
  Calendar, 
  Clock, 
  ShoppingBag,
  Check,
  Clock3 
} from 'lucide-react';

const SalesPage = () => {
  const { purchases, products, customers } = useData();
  const [dateFilter, setDateFilter] = useState('all');

  const getFilteredPurchases = () => {
    if (dateFilter === 'all') {
      return purchases;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      return purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        purchaseDate.setHours(0, 0, 0, 0);
        return purchaseDate.getTime() === today.getTime();
      });
    }
    
    if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);
      
      return purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        purchaseDate.setHours(0, 0, 0, 0);
        return purchaseDate >= weekAgo;
      });
    }
    
    return purchases;
  };

  const filteredPurchases = getFilteredPurchases();
  
  // Calculate summary statistics
  const totalRevenue = filteredPurchases.reduce((sum, purchase) => {
    if (purchase.paymentStatus === 'paid') {
      return sum + purchase.total;
    }
    return sum;
  }, 0);
  
  const pendingRevenue = filteredPurchases.reduce((sum, purchase) => {
    if (purchase.paymentStatus === 'pending') {
      return sum + purchase.total;
    }
    return sum;
  }, 0);
  
  const totalSales = filteredPurchases.length;
  
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'pix':
        return (
          <svg 
            className="h-4 w-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 12h8" />
            <path d="M12 4v16" />
            <path d="M16 12h4" />
          </svg>
        );
      case 'account':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock3 className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-poppins font-semibold mb-6">Controle de Vendas</h1>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total em vendas</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valores pendentes</p>
              <p className="text-2xl font-semibold">{formatCurrency(pendingRevenue)}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Número de vendas</p>
              <p className="text-2xl font-semibold">{totalSales}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Date filter */}
      <div className="flex mb-6 space-x-2">
        <button
          onClick={() => setDateFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded ${
            dateFilter === 'all' 
              ? 'bg-carrefour-blue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas as vendas
        </button>
        <button
          onClick={() => setDateFilter('today')}
          className={`px-4 py-2 text-sm font-medium rounded ${
            dateFilter === 'today' 
              ? 'bg-carrefour-blue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Hoje
        </button>
        <button
          onClick={() => setDateFilter('week')}
          className={`px-4 py-2 text-sm font-medium rounded ${
            dateFilter === 'week' 
              ? 'bg-carrefour-blue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Últimos 7 dias
        </button>
      </div>
      
      {/* Sales list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Itens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {purchase.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {purchase.customer ? purchase.customer.name : 'Cliente não registrado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {purchase.items.length} {purchase.items.length === 1 ? 'item' : 'itens'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {getPaymentIcon(purchase.paymentMethod)}
                        <span className="ml-2">
                          {purchase.paymentMethod === 'cash' && 'Dinheiro'}
                          {purchase.paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                          {purchase.paymentMethod === 'pix' && 'PIX'}
                          {purchase.paymentMethod === 'account' && 'Na Conta'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {getStatusIcon(purchase.paymentStatus)}
                        <span className="ml-2">
                          {purchase.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(purchase.total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma venda encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
