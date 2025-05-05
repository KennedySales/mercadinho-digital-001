
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Buscar produtos..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex w-full mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-10 border-carrefour-blue focus:border-carrefour-blue"
        />
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleClear}
          >
            <X size={18} className="text-gray-400" />
          </Button>
        )}
      </div>
      <Button 
        className="ml-2 bg-carrefour-blue hover:bg-carrefour-lightBlue"
        onClick={handleSearch}
      >
        Buscar
      </Button>
    </div>
  );
};

export default SearchBar;
