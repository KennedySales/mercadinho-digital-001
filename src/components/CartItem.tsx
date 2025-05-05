
import React from 'react';
import { CartItem as CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">
          {formatCurrency(product.price)} cada
        </p>
      </div>
      <div className="flex items-center">
        <div className="flex items-center space-x-2 mr-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="font-medium w-20 text-right">
          {formatCurrency(product.price * quantity)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => removeFromCart(product.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
