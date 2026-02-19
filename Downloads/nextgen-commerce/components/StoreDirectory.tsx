import React, { useState, useEffect } from 'react';
import { getMerchants } from '../services/merchantService';
import type { Merchant } from '../types';
import StoreCard from './StoreCard';
import { SpinnerIcon } from './icons/SpinnerIcon';

const StoreDirectory: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      setIsLoading(true);
      try {
        const fetchedMerchants = await getMerchants();
        setMerchants(fetchedMerchants);
      } catch (error) {
        console.error("Failed to fetch merchants", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <SpinnerIcon className="w-10 h-10 text-primary"/>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Partners</h1>
        <p className="text-gray-500 mb-8">Meet the verified merchants on VeriShip.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchants.map(merchant => (
                <StoreCard key={merchant.id} merchant={merchant} />
            ))}
        </div>
    </div>
  );
};

export default StoreDirectory;
