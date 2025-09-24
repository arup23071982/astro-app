import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  CreditCard,
  Calendar,
  Book,
  Package,
  Trash2,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CartItem {
  id: string;
  type: 'consultation' | 'course' | 'product';
  name: string;
  description?: string;
  price: number;
  duration?: number;
  quantity: number;
  image?: string;
  category?: string;
}

export default function CartDrawer() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return Calendar;
      case 'course':
        return Book;
      case 'product':
        return Package;
      default:
        return Package;
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = Math.round(totalPrice * 0.18);
  const finalTotal = totalPrice + gst;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    setIsOpen(false);
    setLocation("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative glass" data-testid="cart-trigger">
          <ShoppingCart className="w-4 h-4" />
          {totalItems > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="glass-card w-full sm:w-96 flex flex-col h-full">
        <SheetHeader className="border-b border-primary/20 pb-4">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="neon-text text-primary">Shopping Cart</span>
            </div>
            <Badge variant="outline" className="text-primary border-primary/50">
              {totalItems} items
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Review your items before checkout
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add some items to get started
              </p>
              <Button 
                onClick={() => setIsOpen(false)} 
                variant="outline" 
                className="glass"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => {
                const IconComponent = getItemIcon(item.type);
                return (
                  <div key={item.id} className="glass p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.duration && (
                          <div className="flex items-center text-sm text-primary mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.duration} min
                          </div>
                        )}
                        {item.category && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {item.category}
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        {item.type !== 'consultation' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price.toLocaleString()} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            {/* Cart Summary */}
            <div className="border-t border-primary/20 pt-4 space-y-3">
              <div className="glass p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-primary/20">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="glass"
                  data-testid="clear-cart-button"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="neon-button"
                  data-testid="checkout-button"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Checkout
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="w-full text-muted-foreground"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Export function to add items to cart
export const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
  const currentCart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
  const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
  } else {
    currentCart.push({ ...item, quantity: item.quantity || 1 });
  }

  localStorage.setItem("cart", JSON.stringify(currentCart));
  
  // Dispatch custom event to update cart components
  window.dispatchEvent(new CustomEvent('cartUpdated'));
};