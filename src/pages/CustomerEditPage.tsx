
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/context/DataContext';
import { Customer } from '@/lib/types';
import { ArrowLeft, Save, Trash } from 'lucide-react';
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
import { formatCurrency } from '@/lib/utils';

const CustomerEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, updateCustomer, deleteCustomer, getCustomerById } = useData();
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load customer data
  useEffect(() => {
    if (id) {
      const customer = getCustomerById(id);
      if (customer) {
        setFormData({
          name: customer.name,
          phone: customer.phone,
          email: customer.email || '',
          address: customer.address || '',
        });
      } else {
        // Customer not found, redirect
        navigate('/customers');
      }
    }
  }, [id, getCustomerById, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      const currentCustomer = getCustomerById(id);
      if (currentCustomer) {
        updateCustomer({
          ...currentCustomer,
          name: formData.name || currentCustomer.name,
          phone: formData.phone || currentCustomer.phone,
          email: formData.email,
          address: formData.address
        });
        navigate('/customers');
      }
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteCustomer(id);
      navigate('/customers');
    }
  };

  // Get customer for display
  const customer = id ? getCustomerById(id) : null;

  if (!customer) {
    return null; // or loading state
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/customers')} 
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-semibold">Editar Cliente</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    <Trash size={16} className="mr-2" /> Excluir Cliente
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso excluirá permanentemente o cliente
                      {customer.name} e todos os seus dados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Sim, excluir cliente
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit">
                <Save size={16} className="mr-2" /> Salvar Alterações
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Customer Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Saldo da conta</h3>
              <p className={`text-xl font-bold ${
                customer.accountBalance < 0 
                  ? 'text-red-600' 
                  : 'text-green-600'
              }`}>
                {formatCurrency(customer.accountBalance)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Histórico de compras</h3>
              {customer.purchaseHistory.length > 0 ? (
                <div className="space-y-2">
                  {customer.purchaseHistory.slice(0, 5).map(purchase => (
                    <div 
                      key={purchase.id} 
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm">{purchase.date}</span>
                      <span className="font-medium">{formatCurrency(purchase.total)}</span>
                    </div>
                  ))}
                  
                  {customer.purchaseHistory.length > 5 && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Mostrando 5 de {customer.purchaseHistory.length} compras
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma compra registrada</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerEditPage;
