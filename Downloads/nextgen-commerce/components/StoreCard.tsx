import React from 'react';
import type { Merchant } from '../types';
import { StoreIcon } from './icons/StoreIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';

interface StoreCardProps {
    merchant: Merchant;
}

const StoreCard: React.FC<StoreCardProps> = ({ merchant }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full mr-4">
                    <StoreIcon className="w-6 h-6 text-primary"/>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{merchant.storeName}</h2>
                    <p className="text-sm text-gray-500">{merchant.name}</p>
                </div>
            </div>
            <div className="flex items-center text-gray-600">
                <AtSymbolIcon className="w-4 h-4 mr-2"/>
                <a href={`mailto:${merchant.email}`} className="text-sm hover:text-primary transition-colors">{merchant.email}</a>
            </div>
            {merchant.deliveryInfo && (
                <p className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <strong>Delivery Info:</strong> {merchant.deliveryInfo}
                </p>
            )}
        </div>
    );
};

export default StoreCard;
