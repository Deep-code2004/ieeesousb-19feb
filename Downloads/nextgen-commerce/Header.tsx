import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheckIcon } from './components/icons/ShieldCheckIcon';
import { ShoppingCartIcon } from './components/icons/ShoppingCartIcon';

interface HeaderProps {
  currentView: 'customer' | 'admin' | 'merchant';
  onViewChange: (view: 'customer' | 'admin' | 'merchant') => void;
  cartItemCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, cartItemCount, onCartClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCountRef = useRef(cartItemCount);
  
  const activeClass = "bg-primary text-white";
  const inactiveClass = "text-gray-600 hover:bg-gray-200";

  useEffect(() => {
    if (cartItemCount > prevCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartItemCount;
  }, [cartItemCount]);


  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-gray-800">VeriShip</span>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => onViewChange('customer')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out ${currentView === 'customer' ? activeClass : inactiveClass}`}
                >
                    Store
                </button>
                <button
                    onClick={() => onViewChange('admin')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out ${currentView === 'admin' ? activeClass : inactiveClass}`}
                >
                    Admin
                </button>
                <button
                    onClick={() => onViewChange('merchant')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out ${currentView === 'merchant' ? activeClass : inactiveClass}`}
                >
                    For Merchants
                </button>
            </div>
            {currentView === 'customer' && (
                <button 
                    onClick={onCartClick}
                    className="relative text-gray-600 hover:text-primary transition-colors"
                    aria-label={`Shopping cart with ${cartItemCount} items`}
                >
                    <ShoppingCartIcon className="w-7 h-7" />
                    {cartItemCount > 0 && (
                        <span className={`absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-accent text-white text-xs font-bold rounded-full ${isAnimating ? 'animate-badge-pop' : ''}`}>
                            {cartItemCount}
                        </span>
                    )}
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
