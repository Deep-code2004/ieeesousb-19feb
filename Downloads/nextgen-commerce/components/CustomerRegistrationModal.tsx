import React, { useState } from 'react';
import { registerCustomer } from '../services/userService';
import { XIcon } from './icons/XIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { AtSymbolIcon } from './icons/AtSymbolIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface CustomerRegistrationModalProps {
  onClose: () => void;
}

const CustomerRegistrationModal: React.FC<CustomerRegistrationModalProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            setError('Please fill out all fields.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await registerCustomer(formData);
            setSuccess(true);
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-secondary rounded-xl shadow-2xl w-full max-w-md flex flex-col transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Create Account</h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-slate-700 rounded-full p-2 transition-colors"
            >
                <XIcon className="w-6 h-6" />
                <span className="sr-only">Close</span>
            </button>
        </div>

        <div className="p-6">
            {success ? (
                 <div className="text-center">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold text-white">Welcome!</h2>
                    <p className="text-gray-400 mt-2">Your account has been created successfully.</p>
                    <button onClick={onClose} className="mt-6 w-full py-2 bg-accent text-white rounded-md font-semibold hover:bg-accent-hover transition-colors">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField name="name" type="text" value={formData.name} onChange={handleChange} label="Full Name" icon={<UserCircleIcon className="w-5 h-5 text-gray-400" />} required />
                    <InputField name="email" type="email" value={formData.email} onChange={handleChange} label="Email Address" icon={<AtSymbolIcon className="w-5 h-5 text-gray-400" />} required />
                    <InputField name="phone" type="tel" value={formData.phone} onChange={handleChange} label="Phone Number" icon={<PhoneIcon className="w-5 h-5 text-gray-400" />} required />
                    <InputField name="address" type="text" value={formData.address} onChange={handleChange} label="Delivery Address" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} required />
                    
                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                        {isSubmitting ? <SpinnerIcon className="h-5 w-5" /> : 'Create Account'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{name: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, icon: React.ReactNode, required?: boolean}> = 
({ name, type, value, onChange, label, icon, required }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="relative rounded-md shadow-sm">
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


export default CustomerRegistrationModal;
