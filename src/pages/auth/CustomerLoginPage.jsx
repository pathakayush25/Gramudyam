import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const CustomerLoginPage = () => {
  return (
    <LoginForm
      role="customer"
      title="Patron Sign In"
      subtitle="Discover authentic rural handicrafts and track verified TrustTag orders"
      roleBadge="ग्राहक / Conscious Patron"
      roleIcon="shopping_bag"
      defaultIdentifier="ananya.sharma@example.com"
      defaultPassword="CustomerPassword123"
      identifierLabel="Email Address"
      identifierType="email"
      identifierPlaceholder="ananya.sharma@example.com"
      destinationRoute="/marketplace"
      accentColor="var(--primary-light)"
      demoAccountHint={{
        label: 'Ananya Sharma (Heritage Art Collector, Pune)',
        email: 'ananya.sharma@example.com'
      }}
    />
  );
};

export default CustomerLoginPage;
