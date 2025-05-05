
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { formatCurrency, getWhatsAppShareUrl, formatPhoneNumber } from '@/lib/utils';
import { Customer, PaymentMethod } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Banknote, 
  CreditCard, 
  Phone, 
  Share2,
  Check,
  MessageCircle
} from 'lucide-react';

const DebtManagementPage = () => {
  const { customers, updateCustomerBalance, shareToWhatsApp, generateDebtMessage } = useData();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();
  
  // Filter customers with negative balance and by search term
  const debtors = customers.filter(customer => 
    customer.accountBalance < 0 && 
    (searchTerm === '' || 
     customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     customer.phone.includes(searchTerm))
  );
  
  const handlePayment = () => {
    if (!selectedCustomer) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro no pagamento",
        description: "Por favor, insira um valor válido para o pagamento.",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > Math.abs(selectedCustomer.accountBalance)) {
      toast({
        title: "Valor excede a dívida",
        description: "O valor inserido é maior que a dívida total.",
        variant: "destructive",
      });
      return;
    }
    
    // Update customer balance
    updateCustomerBalance(selectedCustomer.id, amount);
    
    // Show success message
    toast({
      title: "Pagamento registrado",
      description: `Pagamento de ${formatCurrency(amount)} registrado com sucesso para ${selectedCustomer.name}.`,
    });
    
    // Reset form
    setPaymentAmount('');
    setSelectedCustomer(null);
  };
  
  const handleShareWhatsApp = (customer: Customer) => {
    const message = generateDebtMessage(customer);
    const whatsappUrl = shareToWhatsApp(customer.phone, message);
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Mensagem preparada",
      description: "O WhatsApp foi aberto com a mensagem preparada.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-poppins font-semibold mb-6">Gerenciamento de Dívidas</h1>
      
      <div className="mb-6">
        <Input
          placeholder="Buscar clientes por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {debtors.length > 0 ? (
          debtors.map(customer => (
            <Card key={customer.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  {customer.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formatPhoneNumber(customer.phone)}</span>
                  </div>
                  <div className="font-medium text-red-600">
                    Dívida: {formatCurrency(Math.abs(customer.accountBalance))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="default"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Banknote className="h-4 w-4 mr-2" />
                      Registrar Pagamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Pagamento</DialogTitle>
                      <DialogDescription>
                        Dívida total de {selectedCustomer && formatCurrency(Math.abs(selectedCustomer.accountBalance))} para {selectedCustomer?.name}.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmount">Valor do Pagamento</Label>
                        <Input
                          id="paymentAmount"
                          type="number"
                          placeholder="0.00"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Forma de Pagamento</Label>
                        <RadioGroup 
                          value={paymentMethod}
                          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="paymentCash" />
                            <Label htmlFor="paymentCash" className="flex items-center">
                              <Banknote className="mr-2 h-4 w-4" />
                              Dinheiro
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit_card" id="paymentCard" />
                            <Label htmlFor="paymentCard" className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              Cartão de Crédito
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pix" id="paymentPix" />
                            <Label htmlFor="paymentPix" className="flex items-center">
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
                        </RadioGroup>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={handlePayment} className="bg-carrefour-blue hover:bg-carrefour-lightBlue">
                        <Check className="h-4 w-4 mr-2" />
                        Confirmar Pagamento
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleShareWhatsApp(customer)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Notificar
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-gray-500">Nenhum cliente com dívidas encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtManagementPage;
