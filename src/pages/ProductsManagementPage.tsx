
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ProductsManagementPage: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct({ ...product });
    } else {
      setCurrentProduct({
        id: '',
        name: '',
        price: 0,
        description: '',
        category: '',
        stock: 0,
        expirationDate: null,
        image: 'https://placehold.co/200x200/1A4BA4/FFFFFF/png?text=Produto'
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentProduct(null);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (currentProduct) {
      const { name, value } = e.target;
      setCurrentProduct({
        ...currentProduct,
        [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
      });
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        [field]: value
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentProduct) {
      const { value } = e.target;
      setCurrentProduct({
        ...currentProduct,
        expirationDate: value || null
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProduct && currentProduct.name && currentProduct.price && currentProduct.category) {
      if (currentProduct.id) {
        // Update existing product
        updateProduct(currentProduct as Product);
      } else {
        // Add new product with a generated ID
        const newProduct: Product = {
          ...currentProduct as Product,
          id: Math.random().toString(36).substring(2, 15)
        };
        addProduct(newProduct);
      }
      handleCloseDialog();
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
          <p className="text-gray-600 mt-1">
            Adicione, edite ou remova produtos do catálogo
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="mt-4 sm:mt-0 bg-carrefour-blue" 
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col"
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
              <p className="text-carrefour-blue font-bold my-1">
                R$ {product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>Categoria: {getCategoryName(product.category)}</p>
                <p>Estoque: {product.stock} unidades</p>
                {product.expirationDate && (
                  <p>Validade: {product.expirationDate}</p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenDialog(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 hover:bg-red-50" 
                onClick={() => {
                  setProductToDelete(product);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentProduct?.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            <DialogDescription>
              {currentProduct?.id ? 'Atualize os detalhes do produto abaixo.' : 'Preencha os detalhes do novo produto.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome do produto"
                  value={currentProduct?.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentProduct?.price || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descrição do produto"
                  value={currentProduct?.description || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={currentProduct?.category || ''}
                  onValueChange={(value) => handleSelectChange(value, 'category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Quantidade em estoque"
                  value={currentProduct?.stock || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expirationDate">Data de Validade (opcional)</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={currentProduct?.expirationDate || ''}
                  onChange={handleDateChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  name="image"
                  placeholder="URL da imagem do produto"
                  value={currentProduct?.image || ''}
                  onChange={handleInputChange}
                />
                {currentProduct?.image && (
                  <div className="h-24 border rounded flex items-center justify-center overflow-hidden mt-2">
                    <img 
                      src={currentProduct.image} 
                      alt="Preview" 
                      className="max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-carrefour-blue">
                {currentProduct?.id ? 'Salvar Alterações' : 'Adicionar Produto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o produto "{productToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsManagementPage;
