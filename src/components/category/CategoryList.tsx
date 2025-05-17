
import React from 'react';
import { Category } from '@/lib/types';
import { CategoryCard } from './CategoryCard';

interface CategoryListProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  isDeleteDialogOpen: boolean;
  categoryToDelete: string | null;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setCategoryToDelete: (categoryId: string | null) => void;
}

export const CategoryList = ({
  categories,
  onEditCategory,
  onDeleteCategory,
  isDeleteDialogOpen,
  categoryToDelete,
  setIsDeleteDialogOpen,
  setCategoryToDelete
}: CategoryListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEditCategory}
          onDelete={onDeleteCategory}
          isDeleteDialogOpen={isDeleteDialogOpen}
          categoryToDelete={categoryToDelete}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          setCategoryToDelete={setCategoryToDelete}
        />
      ))}
    </div>
  );
};
