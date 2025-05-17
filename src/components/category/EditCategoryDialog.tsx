
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Category } from '@/lib/types';

interface EditCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editCategory: Category | null;
  onUpdateCategory: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EditCategoryDialog = ({ 
  isOpen, 
  onOpenChange, 
  editCategory, 
  onUpdateCategory, 
  handleInputChange 
}: EditCategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-icon">Ícone (nome do ícone)</Label>
              <Input
                id="edit-icon"
                name="icon"
                placeholder="Ex: shopping-cart"
                value={editCategory.icon}
                onChange={handleInputChange}
              />
            </div>
            <Button onClick={onUpdateCategory} className="mt-2 bg-carrefour-blue hover:bg-carrefour-lightBlue">
              Atualizar Categoria
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
