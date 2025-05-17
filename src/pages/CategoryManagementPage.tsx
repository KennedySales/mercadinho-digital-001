
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Category as CategoryIcon } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const CategoryManagementPage = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    icon: ''
  });
  
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Protection against non-admin access
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit && editCategory) {
      setEditCategory({ ...editCategory, [name]: value });
    } else {
      setNewCategory(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    const id = Math.random().toString(36).substring(2, 15);
    
    addCategory({
      id,
      name: newCategory.name,
      icon: newCategory.icon || 'category',
      createdAt: new Date().toISOString()
    });
    
    setNewCategory({
      name: '',
      icon: ''
    });
    
    setIsAddDialogOpen(false);
  };

  const handleUpdateCategory = () => {
    if (!editCategory || !editCategory.name) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    updateCategory({
      ...editCategory,
      updatedAt: new Date().toISOString()
    });
    
    setIsEditDialogOpen(false);
    setEditCategory(null);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditCategory(category);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-poppins font-semibold">Gerenciar Categorias</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-carrefour-blue hover:bg-carrefour-lightBlue">
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome*</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome da categoria"
                  value={newCategory.name}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Ícone (nome do ícone)</Label>
                <Input
                  id="icon"
                  name="icon"
                  placeholder="Ex: shopping-cart"
                  value={newCategory.icon}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <Button onClick={handleAddCategory} className="mt-2 bg-carrefour-blue hover:bg-carrefour-lightBlue">
                Adicionar Categoria
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-carrefour-blue flex items-center justify-center text-white mr-3">
                  <CategoryIcon size={16} />
                </div>
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-gray-500">
                <p>Ícone: {category.icon}</p>
                {category.createdAt && (
                  <p>Criado em: {new Date(category.createdAt).toLocaleDateString()}</p>
                )}
                {category.updatedAt && (
                  <p>Atualizado em: {new Date(category.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => openEditDialog(category)}
              >
                <Edit size={14} className="mr-1" /> Editar
              </Button>
              
              <AlertDialog
                open={isDeleteDialogOpen && categoryToDelete === category.id}
                onOpenChange={(open) => {
                  setIsDeleteDialogOpen(open);
                  if (!open) setCategoryToDelete(null);
                }}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setCategoryToDelete(category.id)}
                  >
                    <Trash size={14} className="mr-1" /> Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a categoria {category.name}? Esta ação pode afetar produtos vinculados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteCategory}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {editCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome*</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Nome da categoria"
                  value={editCategory.name}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-icon">Ícone (nome do ícone)</Label>
                <Input
                  id="edit-icon"
                  name="icon"
                  placeholder="Ex: shopping-cart"
                  value={editCategory.icon}
                  onChange={(e) => handleInputChange(e, true)}
                />
              </div>
              <Button onClick={handleUpdateCategory} className="mt-2 bg-carrefour-blue hover:bg-carrefour-lightBlue">
                Atualizar Categoria
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagementPage;
