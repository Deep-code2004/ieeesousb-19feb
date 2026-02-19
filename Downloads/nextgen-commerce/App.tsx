import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import MerchantRegistration from './components/MerchantRegistration';
import MerchantLanding from './components/MerchantLanding';
import OrderTrackingPage from './components/OrderTrackingPage';
import CheckoutFlow from './components/CheckoutFlow';
import ShoppingCart from './components/ShoppingCart';
import ProductModal from './components/ProductModal';
import CustomerRegistrationModal from './components/CustomerRegistrationModal';
import ChatAssistant from './components/ChatAssistant';
import type { Product, CartItem } from './types';

import MerchantLogin from './components/MerchantLogin';
import MerchantDashboard from './components/MerchantDashboard';
import type { Merchant } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'admin' | 'merchant' | 'merchant-login' | 'merchant-registration' | 'merchant-dashboard' | 'tracking' | 'checkout'>('customer');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [loggedInMerchant, setLoggedInMerchant] = useState<Merchant | null>(null);
  const [cartMessage, setCartMessage] = useState<string>('');

  // Load merchant session from localStorage on mount
  useEffect(() => {
    const savedMerchant = localStorage.getItem('loggedInMerchant');
    if (savedMerchant) {
      try {
        const merchant = JSON.parse(savedMerchant);
        setLoggedInMerchant(merchant);
        setCurrentView('merchant-dashboard');
      } catch (error) {
        console.error('Failed to parse saved merchant data:', error);
        localStorage.removeItem('loggedInMerchant');
      }
    }
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuickAddToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    // Show brief feedback message
    setCartMessage(`${product.name} added to cart!`);
    setTimeout(() => setCartMessage(''), 2000);
    // Don't open cart automatically for quick add - users can continue shopping
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    setSelectedProduct(null); // Close modal after adding to cart
    setIsCartOpen(true); // Open cart after adding
  };
  
  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
        handleRemoveFromCart(productId);
        return;
    }
    setCartItems(prevItems =>
        prevItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleOrderPlaced = () => {
    setCartItems([]); // Clear cart after successful order
    setCurrentView('customer'); // Go back to customer dashboard
  };

  const handleBackToCart = () => {
    setCurrentView('customer');
    setIsCartOpen(true);
  };

  const handleMerchantLogin = (merchant: Merchant) => {
    setLoggedInMerchant(merchant);
    localStorage.setItem('loggedInMerchant', JSON.stringify(merchant));
    setCurrentView('merchant-dashboard');
  };

  const handleMerchantLogout = () => {
    setLoggedInMerchant(null);
    localStorage.removeItem('loggedInMerchant');
    setCurrentView('customer');
  };

  const renderView = () => {
    switch (currentView) {
      case 'customer':
        return <CustomerDashboard onProductSelect={handleProductSelect} onAddToCart={handleQuickAddToCart} onViewChange={setCurrentView} />;
      case 'admin':
        return <AdminDashboard />;
      case 'merchant':
        return <MerchantLanding onViewChange={setCurrentView} />;
      case 'merchant-login':
        return <MerchantLogin onLogin={handleMerchantLogin} />;
      case 'merchant-registration':
        return <MerchantRegistration onSuccess={() => setCurrentView('merchant-login')} />;
      case 'merchant-dashboard':
        return loggedInMerchant ? (
          <MerchantDashboard merchant={loggedInMerchant} onLogout={handleMerchantLogout} />
        ) : (
          <MerchantLogin onLogin={handleMerchantLogin} />
        );
      case 'tracking':
        return <OrderTrackingPage />;
      case 'checkout':
        return (
          <CheckoutFlow
            cartItems={cartItems}
            onOrderPlaced={handleOrderPlaced}
            onBackToCart={handleBackToCart}
          />
        );
      default:
        return <CustomerDashboard onProductSelect={handleProductSelect} onAddToCart={handleQuickAddToCart} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="bg-primary text-gray-200 min-h-screen flex flex-col">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onRegisterClick={() => setIsRegistrationOpen(true)}
      />
      <main className="flex-grow relative">
        {renderView()}
        {cartMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-accent text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {cartMessage}
          </div>
        )}
      </main>
      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {isCartOpen && (
        <ShoppingCart
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onProceedToCheckout={() => {
            setIsCartOpen(false);
            setCurrentView('checkout');
          }}
        />
      )}

      {isRegistrationOpen && (
        <CustomerRegistrationModal onClose={() => setIsRegistrationOpen(false)} />
      )}

      <ChatAssistant />
    </div>
  );
}

export default App;
