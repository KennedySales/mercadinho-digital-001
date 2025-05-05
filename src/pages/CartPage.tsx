
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useData } from '@/context/DataContext';
import { Customer, PaymentMethod, PaymentStatus, Discount } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, ArrowLeft, CreditCard, User, Wallet, Banknote, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const CartPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { customers, addPurchase } = useData();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [cashChange, setCashChange] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'none' | 'percentage' | 'fixed'>('none');
  const [discountValue, setDiscountValue] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const totalPrice = getTotalPrice();
  const showCustomerSelect = paymentMethod === 'account';
  const showCashFields = paymentMethod === 'cash';
  
  // Calculate final price after discount
  const [finalPrice, setFinalPrice] = useState<number>(totalPrice);

  useEffect(() => {
    if (discountType === 'none') {
      setFinalPrice(totalPrice);
    } else if (discountType === 'percentage') {
      const percentage = parseFloat(discountValue) || 0;
      const discountAmount = (percentage / 100) * totalPrice;
      setFinalPrice(totalPrice - discountAmount);
    } else if (discountType === 'fixed') {
      const fixed = parseFloat(discountValue) || 0;
      setFinalPrice(Math.max(totalPrice - fixed, 0));
    }
  }, [discountType, discountValue, totalPrice]);

  // Calculate change when cash received changes
  useEffect(() => {
    const received = parseFloat(cashReceived) || 0;
    setCashChange(received - finalPrice);
  }, [cashReceived, finalPrice]);
  
  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Validate payment method specific requirements
    if (paymentMethod === 'account' && !selectedCustomerId) {
      toast({
        title: "Erro na finalização",
        description: "Por favor, selecione um cliente para a compra na conta.",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentMethod === 'cash') {
      const received = parseFloat(cashReceived);
      if (!received || isNaN(received)) {
        toast({
          title: "Erro na finalização",
          description: "Por favor, insira o valor recebido em dinheiro.",
          variant: "destructive",
        });
        return;
      }
      
      if (received < finalPrice) {
        toast({
          title: "Erro na finalização",
          description: "O valor recebido é menor que o total da compra.",
          variant: "destructive",
        });
        return;
      }
    }
    
    const paymentStatus: PaymentStatus = paymentMethod === 'account' ? 'pending' : 'paid';
    
    // Create discount object if any discount is applied
    let discount: Discount | undefined;
    if (discountType !== 'none') {
      discount = {
        type: discountType === 'percentage' ? 'percentage' : 'fixed',
        value: parseFloat(discountValue) || 0,
        description: `Desconto aplicado: ${discountType === 'percentage' ? discountValue + '%' : formatCurrency(parseFloat(discountValue) || 0)}`
      };
    }
    
    // Register the purchase
    addPurchase(
      items, 
      paymentMethod, 
      paymentStatus, 
      paymentMethod === 'account' ? selectedCustomerId : undefined,
      paymentMethod === 'cash' ? parseFloat(cashReceived) || 0 : undefined,
      paymentMethod === 'cash' && cashChange > 0 ? cashChange : undefined,
      discount
    );
    
    // Clear the cart
    clearCart();
    
    // Show success message
    toast({
      title: "Compra finalizada",
      description: "Sua compra foi finalizada com sucesso!",
    });
    
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
                
                {discountType !== 'none' && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>- {formatCurrency(totalPrice - finalPrice)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(finalPrice)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">Adicionar desconto</h3>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Button 
                    variant={discountType === 'none' ? "default" : "outline"}
                    onClick={() => {
                      setDiscountType('none');
                      setDiscountValue('');
                    }}
                    className="w-full"
                  >
                    Sem desconto
                  </Button>
                  <Button 
                    variant={discountType === 'percentage' ? "default" : "outline"}
                    onClick={() => setDiscountType('percentage')}
                    className="w-full"
                  >
                    <Percent className="mr-2 h-4 w-4" />
                    Porcentagem
                  </Button>
                </div>
                <Button 
                  variant={discountType === 'fixed' ? "default" : "outline"}
                  onClick={() => setDiscountType('fixed')}
                  className="w-full mb-2"
                >
                  Valor fixo
                </Button>
                
                {discountType !== 'none' && (
                  <div className="mt-2">
                    <Label htmlFor="discountValue">
                      {discountType === 'percentage' ? 'Porcentagem de desconto (%)' : 'Valor do desconto (R$)'}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder={discountType === 'percentage' ? '10' : '10.00'}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
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

              {showCashFields && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Pagamento em dinheiro</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cashReceived">Valor recebido (R$)</Label>
                      <Input
                        id="cashReceived"
                        type="number"
                        placeholder="0.00"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Troco</Label>
                      <div className={`p-2 rounded-md mt-1 ${
                        cashChange >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {formatCurrency(cashChange >= 0 ? cashChange : 0)}
                        {cashChange < 0 && (
                          <div className="text-xs mt-1">
                            Valor insuficiente
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleCheckout}
                className="w-full bg-carrefour-blue hover:bg-carrefour-lightBlue"
                disabled={(showCustomerSelect && !selectedCustomerId) || 
                         (showCashFields && (parseFloat(cashReceived) < finalPrice))}
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
