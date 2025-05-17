
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Category } from '@/lib/types';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (category: Partial<Category>) => void;
}

export const AddCategoryDialog = ({ isOpen, onOpenChange, onAddCategory }: AddCategoryDialogProps) => {
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    icon: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    onAddCategory(newCategory);
    setNewCategory({
      name: '',
      icon: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon">Ícone (nome do ícone)</Label>
            <Input
              id="icon"
              name="icon"
              placeholder="Ex: shopping-cart"
              value={newCategory.icon}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={handleAddCategory} className="mt-2 bg-carrefour-blue hover:bg-carrefour-lightBlue">
            Adicionar Categoria
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
