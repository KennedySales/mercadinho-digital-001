
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { MessageCircle, Share2, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';

const PromotionsPage = () => {
  const { products, customers, generatePromotionMessage, shareToWhatsApp } = useData();
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});
  const [selectedCustomers, setSelectedCustomers] = useState<Record<string, boolean>>({});
  const [messageText, setMessageText] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();
  
  // Filter products by search term
  const filteredProducts = products.filter(product => 
    searchTerm === '' || 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
    
    // Auto-generate message when products are selected
    const updatedSelection = {
      ...selectedProducts,
      [productId]: !selectedProducts[productId]
    };
    
    const selectedProductsList = products.filter(product => 
      updatedSelection[product.id]
    );
    
    if (selectedProductsList.length > 0) {
      const generatedMessage = generatePromotionMessage(selectedProductsList);
      setMessageText(generatedMessage);
    }
  };
  
  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };
  
  const handleSelectAllCustomers = () => {
    const allSelected = customers.every(customer => selectedCustomers[customer.id]);
    
    if (allSelected) {
      // Unselect all
      setSelectedCustomers({});
    } else {
      // Select all
      const newSelection: Record<string, boolean> = {};
      customers.forEach(customer => {
        newSelection[customer.id] = true;
      });
      setSelectedCustomers(newSelection);
    }
  };
  
  const handleShareToWhatsApp = () => {
    // For single number
    if (phoneNumber) {
      const whatsappUrl = shareToWhatsApp(phoneNumber, messageText);
      window.open(whatsappUrl, '_blank');
      return;
    }
    
    // For selected customers
    const selectedCustomerIds = Object.keys(selectedCustomers).filter(id => selectedCustomers[id]);
    
    if (selectedCustomerIds.length === 0) {
      toast({
        title: "Nenhum destinatário selecionado",
        description: "Selecione pelo menos um cliente ou insira um número de telefone.",
        variant: "destructive",
      });
      return;
    }
    
    // Open for the first customer and show message about more
    const firstCustomer = customers.find(c => c.id === selectedCustomerIds[0]);
    if (firstCustomer) {
      const whatsappUrl = shareToWhatsApp(firstCustomer.phone, messageText);
      window.open(whatsappUrl, '_blank');
      
      if (selectedCustomerIds.length > 1) {
        toast({
          title: `Enviando para ${selectedCustomerIds.length} clientes`,
          description: "O WhatsApp foi aberto para o primeiro cliente. Continue o processo para os demais manualmente.",
        });
      } else {
        toast({
          title: "Mensagem preparada",
          description: "O WhatsApp foi aberto com a mensagem preparada.",
        });
      }
    }
  };
  
  const selectedProductsCount = Object.values(selectedProducts).filter(Boolean).length;
  const selectedCustomersCount = Object.values(selectedCustomers).filter(Boolean).length;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-poppins font-semibold mb-6">Compartilhar Promoções</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Criar Mensagem de Promoção</h2>
              
              <div className="mb-4">
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`product-${product.id}`}
                          checked={!!selectedProducts[product.id]}
                          onCheckedChange={() => handleProductSelect(product.id)}
                        />
                        <div className="grid gap-1">
                          <Label htmlFor={`product-${product.id}`} className="flex items-center gap-1.5">
                            {product.name}
                            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                              {product.category}
                            </span>
                          </Label>
                        </div>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="message" className="mb-2 block">
                  Mensagem de Promoção ({selectedProductsCount} produtos selecionados)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Digite sua mensagem ou selecione produtos para gerar automaticamente"
                  className="min-h-[150px]"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Enviar Para</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                
                <div className="text-sm text-gray-500">
                  ou selecione os clientes abaixo
                </div>
                
                <div className="border rounded-md p-4 h-[300px] overflow-y-auto">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedCustomersCount} de {customers.length} selecionados
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleSelectAllCustomers}>
                      {customers.every(c => selectedCustomers[c.id]) ? "Desmarcar Todos" : "Marcar Todos"}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {customers.map(customer => (
                      <div key={customer.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`customer-${customer.id}`}
                          checked={!!selectedCustomers[customer.id]}
                          onCheckedChange={() => handleCustomerSelect(customer.id)}
                        />
                        <Label htmlFor={`customer-${customer.id}`}>
                          {customer.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!messageText || (!phoneNumber && selectedCustomersCount === 0)}
                onClick={handleShareToWhatsApp}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Compartilhar via WhatsApp
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
