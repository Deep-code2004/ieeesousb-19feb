import React from 'react';
import { StoreIcon } from './icons/StoreIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface MerchantLandingProps {
  onViewChange: (view: 'merchant-login' | 'merchant-registration') => void;
}

const MerchantLanding: React.FC<MerchantLandingProps> = ({ onViewChange }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="text-center mb-12">
        <StoreIcon className="w-16 h-16 text-accent mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Merchant Portal</h1>
        <p className="mt-3 text-lg text-gray-400">
          Manage your store, products, and deliveries
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Section */}
          <div className="bg-secondary p-8 rounded-lg border border-slate-700">
            <div className="text-center mb-6">
              <ArrowLeftIcon className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Already Registered?</h2>
              <p className="text-gray-400">Access your merchant dashboard</p>
            </div>
            <button
              onClick={() => onViewChange('merchant-login')}
              className="w-full bg-accent text-white py-3 px-4 rounded-md hover:bg-accent-hover transition-colors font-semibold"
            >
              Login to Dashboard
            </button>
          </div>

          {/* Registration Section */}
          <div className="bg-secondary p-8 rounded-lg border border-slate-700">
            <div className="text-center mb-6">
              <UserCircleIcon className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">New Merchant?</h2>
              <p className="text-gray-400">Join our platform and start selling</p>
            </div>
            <button
              onClick={() => onViewChange('merchant-registration')}
              className="w-full bg-accent text-white py-3 px-4 rounded-md hover:bg-accent-hover transition-colors font-semibold"
            >
              Register Your Store
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Why Choose Our Platform?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary p-6 rounded-lg border border-slate-600">
              <h4 className="text-lg font-semibold text-white mb-2">Easy Management</h4>
              <p className="text-gray-400 text-sm">Manage your products and delivery personnel from one dashboard</p>
            </div>
            <div className="bg-primary p-6 rounded-lg border border-slate-600">
              <h4 className="text-lg font-semibold text-white mb-2">Wide Reach</h4>
              <p className="text-gray-400 text-sm">Connect with customers across the platform</p>
            </div>
            <div className="bg-primary p-6 rounded-lg border border-slate-600">
              <h4 className="text-lg font-semibold text-white mb-2">Secure & Reliable</h4>
              <p className="text-gray-400 text-sm">Secure authentication and reliable service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantLanding;
