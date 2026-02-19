import React from 'react';
import type { Order } from '../types';
import { XIcon } from './icons/XIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { StoreIcon } from './icons/StoreIcon';
import { TruckIcon } from './icons/TruckIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';


interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onClose }) => {

    const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; }> = ({ icon, label, value }) => (
        <div className="flex items-start py-3">
            <div className="text-accent mr-4 mt-1">{icon}</div>
            <div>
                <p className="text-sm font-semibold text-gray-400">{label}</p>
                <p className="text-md text-white">{value}</p>
            </div>
        </div>
    );
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(price);
    }
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short',
        });
    }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-secondary rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center sticky top-0 bg-secondary/80 backdrop-blur-sm z-10 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Order Details</h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-slate-700 rounded-full p-2 transition-colors"
            >
                <XIcon className="w-6 h-6" />
                <span className="sr-only">Close</span>
            </button>
        </div>
        
        <div className="overflow-y-auto px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                <div className="md:col-span-2 flex items-center bg-primary p-4 rounded-lg">
                    <img src={order.productImageUrl} alt={order.productName} className="w-24 h-24 object-cover rounded-md mr-4" />
                    <div>
                        <p className="text-sm text-gray-400">Product</p>
                        <h3 className="text-lg font-bold text-white">{order.productName}</h3>
                        <p className="text-gray-300">Quantity: {order.quantity}</p>
                        <p className="text-lg font-bold text-accent mt-1">{formatPrice(order.price * order.quantity)}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-white mb-2 border-b border-slate-700 pb-2">Customer</h4>
                    <DetailRow icon={<UserCircleIcon className="w-5 h-5"/>} label="Name" value={order.customer.name} />
                    <DetailRow icon={<UserCircleIcon className="w-5 h-5"/>} label="Address" value={order.customer.address} />
                    <DetailRow icon={<UserCircleIcon className="w-5 h-5"/>} label="Contact" value={<>{order.customer.email}<br/>{order.customer.phone}</>} />
                </div>
                 <div>
                    <h4 className="text-lg font-semibold text-white mb-2 border-b border-slate-700 pb-2">Delivery</h4>
                    <DetailRow icon={<TruckIcon className="w-5 h-5"/>} label="Delivery Person" value={`${order.deliveryPerson.name} (${order.deliveryPerson.vehicle} - ${order.deliveryPerson.licensePlate})`} />
                    <DetailRow icon={<TruckIcon className="w-5 h-5"/>} label="Tracking ID" value={order.trackingId} />
                    <DetailRow icon={<StoreIcon className="w-5 h-5"/>} label="Partner Store" value={order.partnerStore.name} />
                </div>

                <div className="md:col-span-2">
                     <h4 className="text-lg font-semibold text-white mb-2 border-b border-slate-700 pb-2">Order Information</h4>
                     <div className="grid sm:grid-cols-2 gap-x-8">
                        <DetailRow icon={<CreditCardIcon className="w-5 h-5"/>} label="Order ID" value={order.id} />
                        <DetailRow icon={<CreditCardIcon className="w-5 h-5"/>} label="Status" value={<span className="font-bold">{order.status.replace(/_/g, ' ')}</span>} />
                        <DetailRow icon={<CalendarIcon className="w-5 h-5"/>} label="Date Placed" value={formatDate(order.createdAt)} />
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
