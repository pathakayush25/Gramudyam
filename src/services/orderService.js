/* ==========================================================================
   ORDER SERVICE
   Handles orders creation, status updates, and tracking transitions
   ========================================================================== */

import { mockOrders } from '../data/mockData';

const ORDERS_STORAGE_KEY = 'gramudyam_orders_list';

export const orderService = {
  getAll() {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(mockOrders));
      return mockOrders;
    } catch {
      return mockOrders;
    }
  },

  getById(id) {
    const orders = this.getAll();
    return orders.find(o => String(o.id) === String(id) || o.trackingNumber === String(id));
  },

  createOrder(orderData) {
    const orders = this.getAll();
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      courier: 'India Post Rural SpeedPost',
      trackingNumber: `EP-MH-${Math.floor(1000000 + Math.random() * 9000000)}IN`,
      paymentStatus: 'Paid',
      trackingSteps: [
        { title: "Order Confirmed", date: "Just now", completed: true, note: "Payment verified & Artisan notified" },
        { title: "Packed at Village Studio", date: "Pending", completed: false, note: "Artisan preparing shipment with QR TrustTag" },
        { title: "Picked up by Rural Carrier", date: "Pending", completed: false, note: "Carrier assigned" },
        { title: "In Transit", date: "Pending", completed: false, note: "En route to destination hub" },
        { title: "Out for Delivery", date: "Pending", completed: false, note: "Final delivery step" }
      ],
      ...orderData
    };
    const updated = [newOrder, ...orders];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return newOrder;
  },

  updateStatus(orderId, newStatus) {
    const orders = this.getAll();
    const updated = orders.map(order => {
      if (order.id === orderId) {
        // Adjust tracking steps according to status
        const steps = [...order.trackingSteps];
        if (newStatus === 'Processing') {
          steps[0].completed = true;
        } else if (newStatus === 'Shipped') {
          steps[0].completed = true;
          steps[1].completed = true;
          steps[1].date = 'Today';
          steps[2].completed = true;
          steps[2].date = 'Today';
          steps[3].completed = true;
          steps[3].date = 'In Transit';
        } else if (newStatus === 'Delivered') {
          steps.forEach(s => (s.completed = true));
          steps[4].date = 'Delivered Today';
        }
        return { ...order, status: newStatus, trackingSteps: steps };
      }
      return order;
    });
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
