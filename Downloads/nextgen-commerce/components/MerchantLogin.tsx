import React, { useState } from 'react';
import { loginMerchant } from '../services/merchantService';
import { StoreIcon } from './icons/StoreIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import type { Merchant } from '../types';

interface MerchantLoginProps {
  onLogin: (merchant: Merchant) => void;
}

const MerchantLogin: React.FC<MerchantLoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const merchant = await loginMerchant(formData.email, formData.password);
      if (merchant) {
        setSuccess(true);
        onLogin(merchant);
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('Login failed. Please try again later.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>
        <h2 className="text-3xl font-bold text-white">Login Successful!</h2>
        <p className="text-gray-400 mt-2">Welcome back to NextGen Commerce.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Merchant Login</h1>
          <p className="mt-3 text-lg text-gray-400">
            Access your merchant dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg shadow-2xl border border-slate-700">
          <div className="space-y-6">
            <InputField name="email" type="email" value={formData.email} onChange={handleChange} label="Email" icon={<AtSymbolIcon className="w-5 h-5 text-gray-400" />} required />
            <InputField name="password" type="password" value={formData.password} onChange={handleChange} label="Password" icon={<ShieldCheckIcon className="w-5 h-5 text-gray-400" />} required />
          </div>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <div className="mt-8">
            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? <SpinnerIcon className="h-5 w-5" /> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<{name: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, icon: React.ReactNode, required?: boolean}> = ({ name, type, value, onChange, label, icon, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-4 py-2 bg-primary border-slate-600 rounded-md focus:ring-accent focus:border-accent sm:text-sm text-gray-200 placeholder-gray-500"
        required={required}
      />
    </div>
  </div>
);

export default MerchantLogin;
