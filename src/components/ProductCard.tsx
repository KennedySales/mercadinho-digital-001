
import React from 'react';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // Check if product is expired or close to expiry
  const isExpired = (date: string | null): boolean => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const today = new Date();
    return expiryDate < today;
  };
  
  const isCloseToExpiry = (date: string | null): boolean => {
    if (!date) return false;
    const expiryDate = new Date(date);
    const today = new Date();
    const daysDifference = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDifference >= 0 && daysDifference <= 7;
  };
  
  const getExpiryBadge = () => {
    if (isExpired(product.expirationDate)) {
      return <span className="badge-expired">Vencido</span>;
    }
    if (isCloseToExpiry(product.expirationDate)) {
      return <span className="badge-warning">Vence em breve</span>;
    }
    return null;
  };

  const getStockBadge = () => {
    if (product.stock <= 0) {
      return <span className="badge-expired">Sem estoque</span>;
    }
    if (product.stock <= 5) {
      return <span className="badge-warning">Estoque baixo</span>;
    }
    return <span className="badge-ok">{product.stock} un</span>;
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {getExpiryBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          {getStockBadge()}
        </div>
        <p className="text-carrefour-blue font-bold text-xl">{formatCurrency(product.price)}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mt-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => addToCart(product)} 
          className="w-full bg-carrefour-blue hover:bg-carrefour-lightBlue"
          disabled={product.stock <= 0 || isExpired(product.expirationDate)}
        >
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
