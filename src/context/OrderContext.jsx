import React, { createContext, useContext, useState } from 'react';
import { orderService } from '../services/orderService';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => orderService.getAll());

  const placeOrder = (orderData) => {
    const newOrder = orderService.createOrder(orderData);
    setOrders(orderService.getAll());
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    const updated = orderService.updateStatus(orderId, status);
    setOrders(updated);
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
