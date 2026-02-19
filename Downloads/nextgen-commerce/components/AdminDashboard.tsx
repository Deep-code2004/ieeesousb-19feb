import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { getMerchants } from '../services/merchantService';
import { getCustomers } from '../services/userService';
import { getReviews, updateReviewStatus } from '../services/reviewService';
import type { Order, OrderStatus, Merchant, Customer, Review } from '../types';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { StoreIcon } from './icons/StoreIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { StarIcon } from './icons/StarIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import OrderDetail from './OrderDetail';


type AdminTab = 'parcels' | 'merchants' | 'customers' | 'reviews';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('parcels');
    const [orders, setOrders] = useState<Order[]>([]);
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const [fetchedOrders, fetchedMerchants, fetchedCustomers, fetchedReviews] = await Promise.all([
                    getOrders(),
                    getMerchants(),
                    getCustomers(),
                    getReviews()
                ]);
                setOrders(fetchedOrders);
                setMerchants(fetchedMerchants);
                setCustomers(fetchedCustomers);
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        setActionLoading(prev => ({...prev, [orderId]: true}));
        const originalOrders = [...orders];
        // Optimistic update
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        try {
            await updateOrderStatus(orderId, newStatus);
        } catch (error) {
            console.error("Failed to update order status", error);
            setOrders(originalOrders); // Revert on error
        } finally {
            setActionLoading(prev => ({...prev, [orderId]: false}));
        }
    };

    const handleReviewStatusChange = async (reviewId: string, newStatus: 'APPROVED' | 'PENDING') => {
        setActionLoading(prev => ({...prev, [reviewId]: true}));
        const originalReviews = [...reviews];
        // Optimistic update
        setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
        try {
            await updateReviewStatus(reviewId, newStatus);
        } catch (error) {
            console.error("Failed to update review status", error);
            setReviews(originalReviews); // Revert on error
        } finally {
            setActionLoading(prev => ({...prev, [reviewId]: false}));
        }
    };
    
    const getStatusColor = (status: OrderStatus) => {
        switch(status) {
            case 'DELIVERED': return 'bg-green-900/50 text-green-300 border border-green-700';
            case 'REJECTED': return 'bg-red-900/50 text-red-300 border border-red-700';
            case 'SHIPPED': return 'bg-blue-900/50 text-blue-300 border border-blue-700';
            case 'APPROVED': return 'bg-cyan-900/50 text-cyan-300 border border-cyan-700';
            case 'PENDING_VERIFICATION': return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700';
            default: return 'bg-slate-700 text-slate-300';
        }
    }

    const renderTabContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-20">
                    <SpinnerIcon className="w-10 h-10 text-accent"/>
                </div>
            );
        }

        switch(activeTab) {
            case 'parcels': return renderParcelsTable();
            case 'merchants': return renderMerchantsTable();
            case 'customers': return renderCustomersTable();
            case 'reviews': return renderReviewsTable();
            default: return null;
        }
    }

    const renderParcelsTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Store</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-secondary divide-y divide-slate-700">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{order.productName}</div>
                                <div className="text-sm text-gray-400">{order.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.partnerStore.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <div className="flex items-center justify-center space-x-4">
                                    {actionLoading[order.id] ? <SpinnerIcon className="w-5 h-5"/> : (
                                    <>
                                        {order.status === 'PENDING_VERIFICATION' && (
                                            <>
                                                <button onClick={() => handleStatusChange(order.id, 'APPROVED')} className="text-green-400 hover:text-green-300">Approve</button>
                                                <button onClick={() => handleStatusChange(order.id, 'REJECTED')} className="text-red-400 hover:text-red-300">Reject</button>
                                            </>
                                        )}
                                        {order.status === 'APPROVED' && (
                                            <button onClick={() => handleStatusChange(order.id, 'SHIPPED')} className="text-blue-400 hover:text-blue-300">Ship</button>
                                        )}
                                        <button onClick={() => setSelectedOrder(order)} className="text-gray-400 hover:text-white">Details</button>
                                    </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderMerchantsTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Store Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact Person</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    </tr>
                </thead>
                <tbody className="bg-secondary divide-y divide-slate-700">
                    {merchants.map(merchant => (
                        <tr key={merchant.id} className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{merchant.storeName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{merchant.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{merchant.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCustomersTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Address</th>
                    </tr>
                </thead>
                <tbody className="bg-secondary divide-y divide-slate-700">
                    {customers.map(customer => (
                        <tr key={customer.id} className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{customer.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{customer.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{customer.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{customer.address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderReviewsTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-secondary divide-y divide-slate-700">
                    {reviews.map(review => (
                        <tr key={review.id} className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{review.productName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{review.customer.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{review.rating}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{review.comment}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${review.status === 'APPROVED' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'}`}>
                                    {review.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <div className="flex items-center justify-center space-x-4">
                                    {actionLoading[review.id] ? <SpinnerIcon className="w-5 h-5"/> : (
                                    <>
                                        {review.status === 'PENDING' && (
                                            <button onClick={() => handleReviewStatusChange(review.id, 'APPROVED')} className="text-green-400 hover:text-green-300">Approve</button>
                                        )}
                                        {review.status === 'APPROVED' && (
                                            <button onClick={() => handleReviewStatusChange(review.id, 'PENDING')} className="text-red-400 hover:text-red-300">Reject</button>
                                        )}
                                    </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const TabButton: React.FC<{ tab: AdminTab; label: string; icon: React.ReactNode }> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${activeTab === tab ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:px-8 py-8 sm:py-16">
            <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
            <div className="flex space-x-2 border-b border-slate-700 mb-6">
               <TabButton tab="parcels" label="Parcel Approvals" icon={<ClipboardDocumentListIcon className="w-5 h-5"/>}/>
               <TabButton tab="merchants" label="Merchants" icon={<StoreIcon className="w-5 h-5"/>}/>
               <TabButton tab="customers" label="Customers" icon={<UserGroupIcon className="w-5 h-5"/>}/>
               <TabButton tab="reviews" label="Review Approvals" icon={<StarIcon className="w-5 h-5"/>}/>
            </div>
            <div className="bg-secondary shadow-lg rounded-lg overflow-hidden border border-slate-700">
                {renderTabContent()}
            </div>
            {selectedOrder && (
                <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export default AdminDashboard;
