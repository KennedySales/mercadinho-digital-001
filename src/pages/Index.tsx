
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { Product } from '@/lib/types';

const ProductsPage = () => {
  const { products } = useData();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Apply filters
    let result = [...products];
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-poppins font-semibold mb-6">Produtos</h1>

      <SearchBar onSearch={handleSearchChange} />
      
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleCategorySelect} 
      />
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
