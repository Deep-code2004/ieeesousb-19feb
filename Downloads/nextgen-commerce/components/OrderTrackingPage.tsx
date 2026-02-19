import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import type { Order } from '../types';

const OrderTrackingPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getOrders();
                setOrders(fetchedOrders);
            } catch (err) {
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'text-green-400';
            case 'SHIPPED': return 'text-blue-400';
            case 'APPROVED': return 'text-yellow-400';
            case 'PENDING_VERIFICATION': return 'text-orange-400';
            default: return 'text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-white">Order Tracking</h1>
                <p className="mt-2 text-gray-400">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-white">Order Tracking</h1>
                <p className="mt-2 text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Order Tracking</h1>
            {orders.length === 0 ? (
                <p className="text-gray-400">No orders found.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-secondary rounded-lg p-6 border border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{order.productName}</h3>
                                    <p className="text-gray-400">Tracking ID: {order.trackingId}</p>
                                    <p className="text-gray-400">Quantity: {order.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${getStatusColor(order.status)}`}>{order.status.replace('_', ' ')}</p>
                                    <p className="text-gray-400 text-sm">₹{order.price * order.quantity}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="font-semibold text-white mb-2">Customer Details</h4>
                                    <p className="text-gray-400">{order.customer.name}</p>
                                    <p className="text-gray-400">{order.customer.address}</p>
                                    <p className="text-gray-400">{order.customer.phone}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-2">Delivery Details</h4>
                                    <p className="text-gray-400">Store: {order.partnerStore.name}</p>
                                    <p className="text-gray-400">Delivery Person: {order.deliveryPerson.name}</p>
                                    <p className="text-gray-400">Phone: {order.deliveryPerson.phone}</p>
                                    <p className="text-gray-400">Vehicle: {order.deliveryPerson.vehicle} ({order.deliveryPerson.licensePlate})</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-400">
                                <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderTrackingPage;
