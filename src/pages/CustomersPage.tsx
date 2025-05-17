
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { User, UserPlus, Phone, Mail, Home, Calendar, CreditCard, Edit, Trash, Share2 } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Link } from 'react-router-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CustomersPage = () => {
  const { customers, addCustomer, deleteCustomer, shareToWhatsApp, generateDebtMessage } = useData();
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    accountBalance: 0,
    purchaseHistory: []
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSearch = (term: string) => {
    if (!term) {
      setFilteredCustomers(customers);
      return;
    }
    
    const lowerTerm = term.toLowerCase();
    const filtered = customers.filter(
      customer => 
        customer.name.toLowerCase().includes(lowerTerm) || 
        customer.phone.includes(term) ||
        (customer.email && customer.email.toLowerCase().includes(lowerTerm))
    );
    setFilteredCustomers(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Nome e telefone são obrigatórios!');
      return;
    }
    
    addCustomer({
      id: Math.random().toString(36).substring(2, 15),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      address: newCustomer.address,
      accountBalance: 0,
      purchaseHistory: []
    });
    
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      accountBalance: 0,
      purchaseHistory: []
    });
    
    setIsDialogOpen(false);
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id);
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleShareDebt = (customer: Customer) => {
    const message = generateDebtMessage(customer);
    const whatsappUrl = shareToWhatsApp(customer.phone, message);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-poppins font-semibold">Clientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-carrefour-blue hover:bg-carrefour-lightBlue">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome*</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome do cliente"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone*</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="email@exemplo.com"
                  value={newCustomer.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Endereço completo"
                  value={newCustomer.address}
                  onChange={handleInputChange}
                />
              </div>
              <Button onClick={handleAddCustomer} className="mt-2 bg-carrefour-blue hover:bg-carrefour-lightBlue">
                Adicionar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Buscar clientes..." />

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <Card key={customer.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-carrefour-blue flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-lg">{customer.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone size={14} className="mr-1" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    customer.accountBalance < 0
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {formatCurrency(customer.accountBalance)}
                  </div>
                </div>

                <Tabs defaultValue="info">
                  <TabsList className="w-full">
                    <TabsTrigger value="info" className="flex-1">Informações</TabsTrigger>
                    <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="pt-4">
                    {customer.email && (
                      <div className="flex items-center mb-2">
                        <Mail size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center mb-2">
                        <Home size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm">{customer.address}</span>
                      </div>
                    )}
                    {!customer.email && !customer.address && (
                      <p className="text-sm text-gray-500">Nenhuma informação adicional</p>
                    )}
                    
                    <div className="flex mt-4 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="flex-1"
                      >
                        <Link to={`/customers/${customer.id}/edit`}>
                          <Edit size={14} className="mr-1" /> Editar
                        </Link>
                      </Button>
                      
                      <AlertDialog 
                        open={isDeleteDialogOpen && customerToDelete === customer.id} 
                        onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open);
                          if (!open) setCustomerToDelete(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => setCustomerToDelete(customer.id)}
                          >
                            <Trash size={14} className="mr-1" /> Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir {customer.name}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    {customer.accountBalance < 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleShareDebt(customer)}
                      >
                        <Share2 size={14} className="mr-1" /> Notificar sobre dívida
                      </Button>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="history" className="pt-4">
                    {customer.purchaseHistory.length > 0 ? (
                      <div className="space-y-3">
                        {customer.purchaseHistory.slice(0, 3).map(purchase => (
                          <div key={purchase.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-2 text-gray-500" />
                              <span>{purchase.date}</span>
                            </div>
                            <div className="flex items-center">
                              <CreditCard size={14} className="mr-2 text-gray-500" />
                              <span>{formatCurrency(purchase.total)}</span>
                            </div>
                          </div>
                        ))}
                        {customer.purchaseHistory.length > 3 && (
                          <Button variant="link" size="sm" className="p-0 h-auto text-carrefour-blue">
                            Ver mais
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhuma compra registrada</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
