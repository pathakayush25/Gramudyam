import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { CartProvider } from './context/CartContext';

// Shared Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public & Customer Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { VerificationPage } from './pages/VerificationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Role-Based Gateway Pages
import GetStartedPage from './pages/GetStartedPage';

// Customer Pages
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';

// Entrepreneur / Artisan Pages & Layout
import { EntrepreneurLayout } from './pages/entrepreneur/EntrepreneurLayout';
import { Dashboard } from './pages/entrepreneur/Dashboard';
import { Onboarding } from './pages/entrepreneur/Onboarding';
import { VoiceProductCreation } from './pages/entrepreneur/VoiceProductCreation';
import { ProductPreview } from './pages/entrepreneur/ProductPreview';
import { AIQualityScore } from './pages/entrepreneur/AIQualityScore';
import { BrandingSuggestions } from './pages/entrepreneur/BrandingSuggestions';
import { TrustTagPage } from './pages/entrepreneur/TrustTagPage';
import { MyProducts } from './pages/entrepreneur/MyProducts';
import { Orders } from './pages/entrepreneur/Orders';
import { Logistics } from './pages/entrepreneur/Logistics';
import { Analytics } from './pages/entrepreneur/Analytics';

// Layout wrapper for Public / Customer screens
const PublicLayout = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <Navbar />

    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </main>

    <Footer />
    <Toast />
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
              <CartProvider>

                <Routes>

                  {/* =========================
                      PUBLIC PAGES
                  ========================= */}

                  <Route
                    path="/"
                    element={
                      <PublicLayout>
                        <LandingPage />
                      </PublicLayout>
                    }
                  />

                  <Route
                    path="/about"
                    element={
                      <PublicLayout>
                        <AboutPage />
                      </PublicLayout>
                    }
                  />

                  <Route
                    path="/marketplace"
                    element={
                      <PublicLayout>
                        <MarketplacePage />
                      </PublicLayout>
                    }
                  />

                  <Route
                    path="/product/:id"
                    element={
                      <PublicLayout>
                        <ProductDetailsPage />
                      </PublicLayout>
                    }
                  />

                  <Route
                    path="/verify/:id"
                    element={
                      <PublicLayout>
                        <VerificationPage />
                      </PublicLayout>
                    }
                  />

                  <Route
                    path="/trust-tag/:productId"
                    element={
                      <PublicLayout>
                        <VerificationPage />
                      </PublicLayout>
                    }
                  />

                  {/* =========================
                      AUTHENTICATION
                  ========================= */}

                  <Route
                    path="/login"
                    element={
                      <PublicLayout>
                        <LoginPage />
                      </PublicLayout>
                    }
                  />

                  <Route
                    path="/register"
                    element={
                      <PublicLayout>
                        <RegisterPage />
                      </PublicLayout>
                    }
                  />

                  <Route
                    path="/get-started"
                    element={
                      <PublicLayout>
                        <GetStartedPage />
                      </PublicLayout>
                    }
                  />

                  <Route
                    path="/login/artisan"
                    element={
                      <Navigate
                        to="/login?role=artisan"
                        replace
                      />
                    }
                  />

                  <Route
                    path="/login/customer"
                    element={
                      <Navigate
                        to="/login?role=customer"
                        replace
                      />
                    }
                  />

                  <Route
                    path="/login/admin"
                    element={
                      <Navigate
                        to="/login"
                        replace
                      />
                    }
                  />

                  {/* =========================
                      ADMIN
                  ========================= */}

                  <Route
                    path="/admin/*"
                    element={<Navigate to="/" replace />}
                  />

                  <Route
                    path="/admin"
                    element={<Navigate to="/" replace />}
                  />

                  {/* =========================
                      CUSTOMER ROUTES
                      PROTECTED
                  ========================= */}

                  <Route
                    element={
                      <ProtectedRoute allowedRole="customer" />
                    }
                  >

                    <Route
                      path="/cart"
                      element={
                        <PublicLayout>
                          <CartPage />
                        </PublicLayout>
                      }
                    />

                    <Route
                      path="/checkout"
                      element={
                        <PublicLayout>
                          <CheckoutPage />
                        </PublicLayout>
                      }
                    />

                    <Route
                      path="/orders"
                      element={
                        <PublicLayout>
                          <OrderTrackingPage />
                        </PublicLayout>
                      }
                    />

                    <Route
                      path="/orders/:id"
                      element={
                        <PublicLayout>
                          <OrderTrackingPage />
                        </PublicLayout>
                      }
                    />

                    <Route
                      path="/track-order/:id"
                      element={
                        <PublicLayout>
                          <OrderTrackingPage />
                        </PublicLayout>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <PublicLayout>
                          <CustomerDashboard />
                        </PublicLayout>
                      }
                    />

                  </Route>

                  {/* =========================
                      ARTISAN / ENTREPRENEUR
                      PROTECTED ROUTES
                  ========================= */}

                  <Route
                    element={
                      <ProtectedRoute allowedRole="artisan" />
                    }
                  >

                    <Route
                      path="/entrepreneur"
                      element={<EntrepreneurLayout />}
                    >

                      <Route
                        index
                        element={
                          <Navigate
                            to="/entrepreneur/dashboard"
                            replace
                          />
                        }
                      />

                      <Route
                        path="dashboard"
                        element={<Dashboard />}
                      />

                      <Route
                        path="onboarding"
                        element={<Onboarding />}
                      />

                      <Route
                        path="voice-create"
                        element={<VoiceProductCreation />}
                      />

                      <Route
                        path="product-preview"
                        element={<ProductPreview />}
                      />

                      <Route
                        path="quality-score"
                        element={<AIQualityScore />}
                      />

                      <Route
                        path="branding"
                        element={<BrandingSuggestions />}
                      />

                      <Route
                        path="trusttag"
                        element={<TrustTagPage />}
                      />

                      <Route
                        path="products"
                        element={<MyProducts />}
                      />

                      <Route
                        path="orders"
                        element={<Orders />}
                      />

                      <Route
                        path="logistics"
                        element={<Logistics />}
                      />

                      <Route
                        path="analytics"
                        element={<Analytics />}
                      />

                    </Route>

                  </Route>

                  {/* =========================
                      FALLBACK
                  ========================= */}

                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/"
                        replace
                      />
                    }
                  />

                </Routes>

              </CartProvider>
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;