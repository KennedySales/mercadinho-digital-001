
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { CategoryList } from '@/components/category/CategoryList';
import { AddCategoryDialog } from '@/components/category/AddCategoryDialog';
import { EditCategoryDialog } from '@/components/category/EditCategoryDialog';

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

  const handleAddCategory = (categoryData: Partial<Category>) => {
    if (!categoryData.name) {
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
      name: categoryData.name,
      icon: categoryData.icon || 'category',
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

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const openEditDialog = (category: Category) => {
    setEditCategory(category);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-poppins font-semibold">Gerenciar Categorias</h1>
        <AddCategoryDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddCategory={handleAddCategory}
        />
      </div>

      <CategoryList 
        categories={categories}
        onEditCategory={openEditDialog}
        onDeleteCategory={handleDeleteCategory}
        isDeleteDialogOpen={isDeleteDialogOpen}
        categoryToDelete={categoryToDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        setCategoryToDelete={setCategoryToDelete}
      />

      <EditCategoryDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editCategory={editCategory}
        onUpdateCategory={handleUpdateCategory}
        handleInputChange={(e) => handleInputChange(e, true)}
      />
    </div>
  );
};

export default CategoryManagementPage;
