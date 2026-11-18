import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const ArtisanLoginPage = () => {
  return (
    <LoginForm
      role="artisan"
      title="Artisan Portal Sign In"
      subtitle="Access your digital stall, vernacular voice tools, and village earnings"
      roleBadge="ग्रामीण उद्योजक / Artisan Producer"
      roleIcon="handshake"
      defaultIdentifier="savita.patil@yeolapaithani.org"
      defaultPassword="ArtisanPassword123"
      identifierLabel="Registered Email or Mobile Number"
      identifierType="email"
      identifierPlaceholder="savita.patil@yeolapaithani.org"
      destinationRoute="/entrepreneur/dashboard"
      accentColor="var(--secondary)"
      demoAccountHint={{
        label: 'Savita Patil (Yeola Paithani Master Weaver • SHG Lead)',
        email: 'savita.patil@yeolapaithani.org'
      }}
    />
  );
};

export default ArtisanLoginPage;
