import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface HeaderProps {
  currentView: 'customer' | 'admin' | 'merchant' | 'merchant-login' | 'merchant-dashboard';
  onViewChange: (view: 'customer' | 'admin' | 'merchant' | 'merchant-login' | 'merchant-dashboard') => void;
  cartItemCount: number;
  onCartClick: () => void;
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, cartItemCount, onCartClick, onRegisterClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCountRef = useRef(cartItemCount);
  
  const activeClass = "bg-accent text-white";
  const inactiveClass = "text-gray-300 hover:bg-slate-700";

  useEffect(() => {
    if (cartItemCount > prevCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartItemCount;
  }, [cartItemCount]);


  return (
    <header className="bg-secondary shadow-md sticky top-0 z-40 border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <ShieldCheckIcon className="w-8 h-8 text-accent" />
          <span className="text-2xl font-bold text-white">NextGen Commerce</span>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-primary p-1 rounded-lg">
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
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out ${currentView === 'merchant' || currentView === 'merchant-login' || currentView === 'merchant-dashboard' ? activeClass : inactiveClass}`}
                >
                    For Merchants
                </button>
            </div>
             {currentView === 'customer' && (
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={onRegisterClick} 
                        className="px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out text-gray-300 hover:bg-slate-700"
                    >
                        Register
                    </button>
                    <button 
                        onClick={onCartClick}
                        className="relative text-gray-300 hover:text-white transition-colors"
                        aria-label={`Shopping cart with ${cartItemCount} items`}
                    >
                        <ShoppingCartIcon className="w-7 h-7" />
                        {cartItemCount > 0 && (
                            <span className={`absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-accent text-white text-xs font-bold rounded-full ${isAnimating ? 'animate-badge-pop' : ''}`}>
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;