
import React from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { categories } = useData();

  return (
    <div className="w-full pb-4 mb-4 border-b">
      <h3 className="font-medium text-lg mb-3">Categorias</h3>
      <ScrollArea className="pb-2">
        <div className="flex space-x-2 pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className={selectedCategory === null ? "bg-carrefour-blue" : ""}
            onClick={() => onSelectCategory(null)}
          >
            Todos
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={selectedCategory === category.id ? "bg-carrefour-blue" : ""}
              onClick={() => onSelectCategory(category.id)}
            >
              <Package className="mr-2 h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
