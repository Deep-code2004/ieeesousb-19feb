import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from './services/orderService';
import { getMerchants } from './services/merchantService';
import { getCustomers } from './services/userService';
import type { Order, OrderStatus, Merchant, Customer } from './types';
import { ClipboardDocumentListIcon } from './components/icons/ClipboardDocumentListIcon';
import { StoreIcon } from './components/icons/StoreIcon';
import { UserGroupIcon } from './components/icons/UserGroupIcon';
import { SpinnerIcon } from './components/icons/SpinnerIcon';
import OrderDetail from './components/OrderDetail';


type AdminTab = 'parcels' | 'merchants' | 'customers';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('parcels');
    const [orders, setOrders] = useState<Order[]>([]);
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const [fetchedOrders, fetchedMerchants, fetchedCustomers] = await Promise.all([
                    getOrders(),
                    getMerchants(),
                    getCustomers()
                ]);
                setOrders(fetchedOrders);
                setMerchants(fetchedMerchants);
                setCustomers(fetchedCustomers);
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
    
    const getStatusColor = (status: OrderStatus) => {
        switch(status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800';
            case 'APPROVED': return 'bg-primary/20 text-primary-dark';
            case 'PENDING_VERIFICATION': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    const renderTabContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-20">
                    <SpinnerIcon className="w-10 h-10 text-primary"/>
                </div>
            );
        }

        switch(activeTab) {
            case 'parcels': return renderParcelsTable();
            case 'merchants': return renderMerchantsTable();
            case 'customers': return renderCustomersTable();
            default: return null;
        }
    }

    const renderParcelsTable = () => (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                    <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                            <div className="text-sm text-gray-500">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.partnerStore.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status.replace(/_/g, ' ')}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center space-x-2">
                                {actionLoading[order.id] ? <SpinnerIcon className="w-5 h-5"/> : (
                                <>
                                    {order.status === 'PENDING_VERIFICATION' && (
                                        <>
                                            <button onClick={() => handleStatusChange(order.id, 'APPROVED')} className="text-green-600 hover:text-green-900">Approve</button>
                                            <button onClick={() => handleStatusChange(order.id, 'REJECTED')} className="text-red-600 hover:text-red-900">Reject</button>
                                        </>
                                    )}
                                    {order.status === 'APPROVED' && (
                                        <button onClick={() => handleStatusChange(order.id, 'SHIPPED')} className="text-blue-600 hover:text-blue-900">Ship</button>
                                    )}
                                    <button onClick={() => setSelectedOrder(order)} className="text-gray-600 hover:text-gray-900">Details</button>
                                </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderMerchantsTable = () => (
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {merchants.map(merchant => (
                    <tr key={merchant.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{merchant.storeName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{merchant.email}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderCustomersTable = () => (
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {customers.map(customer => (
                    <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
    
    const TabButton: React.FC<{tab: AdminTab, label: string, icon: React.ReactNode}> = ({tab, label, icon}) => (
         <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab 
                ? 'bg-primary/10 text-primary' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    )


    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="flex space-x-2 border-b border-gray-200 mb-6">
               <TabButton tab="parcels" label="Parcel Approvals" icon={<ClipboardDocumentListIcon className="w-5 h-5"/>}/>
               <TabButton tab="merchants" label="Merchants" icon={<StoreIcon className="w-5 h-5"/>}/>
               <TabButton tab="customers" label="Customers" icon={<UserGroupIcon className="w-5 h-5"/>}/>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {renderTabContent()}
                </div>
            </div>
            {selectedOrder && (
                <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export default AdminDashboard;
