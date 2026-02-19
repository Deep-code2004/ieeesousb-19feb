import React, { useState } from 'react';
import { registerMerchant } from '../services/merchantService';
import { StoreIcon } from './icons/StoreIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';


interface MerchantRegistrationProps {
  onSuccess?: () => void;
}

const MerchantRegistration: React.FC<MerchantRegistrationProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        storeName: '',
        email: '',
        password: '',
        deliveryInfo: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.storeName || !formData.email || !formData.password) {
            setError('Please fill out all required fields.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);
        try {
            await registerMerchant(formData);
            setSuccess(true);
            setFormData({ name: '', storeName: '', email: '', password: '', deliveryInfo: '' }); // Reset form
            onSuccess?.();
        } catch (err) {
            setError('Failed to register. Please try again later.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                <h2 className="text-3xl font-bold text-white">Registration Successful!</h2>
                <p className="text-gray-400 mt-2">Thank you for joining NextGen Commerce. Our team will review your application and get in touch.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 px-6 py-2 bg-accent text-white rounded-md font-semibold hover:bg-accent-hover transition-colors">
                    Register Another Merchant
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Become a Partner</h1>
                    <p className="mt-3 max-w-md mx-auto text-lg text-gray-400">
                       Join our platform and reach more customers.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg shadow-2xl border border-slate-700">
                    <div className="space-y-6">
                        {/* Form fields */}
                        <InputField name="storeName" type="text" value={formData.storeName} onChange={handleChange} label="Store Name" icon={<StoreIcon className="w-5 h-5 text-gray-400" />} required />
                        <InputField name="name" type="text" value={formData.name} onChange={handleChange} label="Contact Person" icon={<UserCircleIcon className="w-5 h-5 text-gray-400" />} required />
                        <InputField name="email" type="email" value={formData.email} onChange={handleChange} label="Contact Email" icon={<AtSymbolIcon className="w-5 h-5 text-gray-400" />} required />
                        <InputField name="password" type="password" value={formData.password} onChange={handleChange} label="Password" icon={<ShieldCheckIcon className="w-5 h-5 text-gray-400" />} required />
                        <div>
                            <label htmlFor="deliveryInfo" className="block text-sm font-medium text-gray-300">
                                Delivery Information
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-start pt-3">
                                   <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <textarea
                                    name="deliveryInfo"
                                    id="deliveryInfo"
                                    rows={3}
                                    value={formData.deliveryInfo}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-4 py-2 bg-primary border-slate-600 rounded-md focus:ring-accent focus:border-accent sm:text-sm text-gray-200 placeholder-gray-500"
                                    placeholder="e.g., Primary Driver: John Doe, 555-1234"
                                />
                            </div>
                        </div>

                    </div>
                    {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                    <div className="mt-8">
                        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                           {isSubmitting ? <SpinnerIcon className="h-5 w-5" /> : 'Register Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField: React.FC<{name: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, icon: React.ReactNode, required?: boolean}> = 
({ name, type, value, onChange, label, icon, required }) => (
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

export default MerchantRegistration;
