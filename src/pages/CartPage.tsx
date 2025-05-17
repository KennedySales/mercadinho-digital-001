
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useData } from '@/context/DataContext';
import { Customer, PaymentMethod, PaymentStatus } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, ArrowLeft, CreditCard, User, Wallet, Banknote } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const CartPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { customers, addPurchase } = useData();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const navigate = useNavigate();
  
  const totalPrice = getTotalPrice();
  const showCustomerSelect = paymentMethod === 'account';
  
  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // If payment method is 'account' but no customer is selected
    if (paymentMethod === 'account' && !selectedCustomerId) {
      alert('Por favor, selecione um cliente para a compra na conta.');
      return;
    }
    
    const paymentStatus: PaymentStatus = paymentMethod === 'account' ? 'pending' : 'paid';
    
    // Register the purchase
    addPurchase(
      items, 
      paymentMethod, 
      paymentStatus, 
      paymentMethod === 'account' ? selectedCustomerId : undefined
    );
    
    // Clear the cart
    clearCart();
    
    // Navigate to success page or back to products
    navigate('/');
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-4 text-2xl font-poppins font-semibold">Seu carrinho está vazio</h1>
          <p className="mt-2 text-gray-600">Adicione produtos ao carrinho para continuar com sua compra.</p>
          <Button 
            onClick={() => navigate('/')} 
            className="mt-6 bg-carrefour-blue hover:bg-carrefour-lightBlue"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para produtos
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost"
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-poppins font-semibold">Carrinho</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Itens ({items.length})</h2>
            <div className="divide-y">
              {items.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Resumo da compra</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">Forma de pagamento</h3>
                <RadioGroup 
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center">
                      <Banknote className="mr-2 h-4 w-4" />
                      Dinheiro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Cartão de Crédito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex items-center">
                      <svg 
                        className="mr-2 h-4 w-4" 
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
                      PIX
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="account" id="account" />
                    <Label htmlFor="account" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Pagar na Conta
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {showCustomerSelect && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Selecione o cliente</h3>
                  <Select 
                    value={selectedCustomerId} 
                    onValueChange={setSelectedCustomerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} {customer.accountBalance < 0 ? 
                            `(Saldo: ${formatCurrency(customer.accountBalance)})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                onClick={handleCheckout}
                className="w-full bg-carrefour-blue hover:bg-carrefour-lightBlue"
                disabled={showCustomerSelect && !selectedCustomerId}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Finalizar Compra
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
