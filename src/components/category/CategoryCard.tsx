
import React from 'react';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash, Folder } from 'lucide-react';
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

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  isDeleteDialogOpen: boolean;
  categoryToDelete: string | null;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setCategoryToDelete: (categoryId: string | null) => void;
}

export const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  isDeleteDialogOpen,
  categoryToDelete,
  setIsDeleteDialogOpen,
  setCategoryToDelete
}: CategoryCardProps) => {
  return (
    <Card key={category.id}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-carrefour-blue flex items-center justify-center text-white mr-3">
            <Folder size={16} />
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
          onClick={() => onEdit(category)}
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
                onClick={() => onDelete(category.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
