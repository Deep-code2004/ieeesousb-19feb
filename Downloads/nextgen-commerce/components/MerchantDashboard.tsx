import React, { useState, useEffect } from 'react';
import { getProductsByMerchant, createProduct } from '../services/productService';
import { getDeliveryPeopleByMerchant, createDeliveryPerson } from '../services/deliveryService';
import { StoreIcon } from './icons/StoreIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TruckIcon } from './icons/TruckIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import type { Product, DeliveryPerson, Merchant } from '../types';

interface MerchantDashboardProps {
  merchant: Merchant;
  onLogout: () => void;
}

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ merchant, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'delivery'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [merchant.id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, deliveryData] = await Promise.all([
        getProductsByMerchant(merchant.id),
        getDeliveryPeopleByMerchant(merchant.id)
      ]);
      setProducts(productsData);
      setDeliveryPeople(deliveryData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      setShowProductForm(false);
      // Reload products to ensure consistency
      const updatedProducts = await getProductsByMerchant(merchant.id);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleAddDeliveryPerson = async (personData: Omit<DeliveryPerson, 'id'>) => {
    try {
      const newPerson = await createDeliveryPerson(personData);
      setDeliveryPeople(prev => [...prev, newPerson]);
      setShowDeliveryForm(false);
      // Reload delivery people to ensure consistency
      const updatedDeliveryPeople = await getDeliveryPeopleByMerchant(merchant.id);
      setDeliveryPeople(updatedDeliveryPeople);
    } catch (error) {
      console.error('Failed to add delivery person:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <SpinnerIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Merchant Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {merchant.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex space-x-1 bg-primary p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out ${
              activeTab === 'products' ? 'bg-accent text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingCartIcon className="w-4 h-4 inline mr-2" />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out ${
              activeTab === 'delivery' ? 'bg-accent text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <TruckIcon className="w-4 h-4 inline mr-2" />
            Delivery ({deliveryPeople.length})
          </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Products</h2>
            <button
              onClick={() => setShowProductForm(true)}
              className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-secondary p-6 rounded-lg border border-slate-700">
                <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-md mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                <p className="text-accent font-bold">₹{product.price} per {product.unit}</p>
              </div>
            ))}
          </div>

          {showProductForm && (
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowProductForm(false)}
              merchantId={merchant.id}
            />
          )}
        </div>
      )}

      {activeTab === 'delivery' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Delivery Personnel</h2>
            <button
              onClick={() => setShowDeliveryForm(true)}
              className="flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Delivery Person
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryPeople.map(person => (
              <div key={person.id} className="bg-secondary p-6 rounded-lg border border-slate-700">
                <TruckIcon className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{person.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{person.phone}</p>
                <p className="text-gray-400 text-sm">{person.vehicle} - {person.licensePlate}</p>
              </div>
            ))}
          </div>

          {showDeliveryForm && (
            <DeliveryForm
              onSubmit={handleAddDeliveryPerson}
              onCancel={() => setShowDeliveryForm(false)}
              merchantId={merchant.id}
            />
          )}


        </div>
      )}
    </div>
  );
};

const ProductForm: React.FC<{
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  merchantId: string;
}> = ({ onSubmit, onCancel, merchantId }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    imageUrl: '',
    unit: '',
    largeCategory: '',
    cardColor: 'cyan' as const,
    merchantId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary p-6 rounded-lg w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Add New Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            rows={3}
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <input
            type="text"
            placeholder="Unit (e.g., kg, piece)"
            value={formData.unit}
            onChange={e => setFormData({...formData, unit: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <div className="flex space-x-2">
            <button type="submit" className="flex-1 bg-accent text-white py-2 rounded-md hover:bg-accent-hover">
              Add Product
            </button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeliveryForm: React.FC<{
  onSubmit: (data: Omit<DeliveryPerson, 'id'>) => void;
  onCancel: () => void;
  merchantId: string;
}> = ({ onSubmit, onCancel, merchantId }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    imageUrl: '',
    vehicle: '',
    licensePlate: '',
    merchantId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({...formData, imageUrl: event.target.result as string});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary p-6 rounded-lg w-full max-w-md mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Add Delivery Person</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <div>
            <label htmlFor="profile-image" className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              title="Choose a profile image"
              placeholder="Choose a profile image"
              className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover"
            />
          </div>
          <input
            type="text"
            placeholder="Vehicle"
            value={formData.vehicle}
            onChange={e => setFormData({...formData, vehicle: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <input
            type="text"
            placeholder="License Plate"
            value={formData.licensePlate}
            onChange={e => setFormData({...formData, licensePlate: e.target.value})}
            className="w-full p-2 bg-primary border border-slate-600 rounded-md text-white"
            required
          />
          <div className="flex space-x-2">
            <button type="submit" className="flex-1 bg-accent text-white py-2 rounded-md hover:bg-accent-hover">
              Add Person
            </button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default MerchantDashboard;
