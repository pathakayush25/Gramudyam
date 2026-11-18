import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

console.log("REGISTER PAGE LOADED");

export const RegisterPage = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('artisan');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    village: 'Dahanu',
    district: 'Palghar',
    craft: 'Warli Art',
    shgName: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("REGISTER BUTTON CLICKED");

    if (!formData.email) {
      alert("Please enter an email address.");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // 1. CREATE USER IN SUPABASE AUTH
      // ==========================================

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,

        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            role: role,

            village: formData.village,
            district: formData.district,
            craft: formData.craft,
            shg_name: formData.shgName
          }
        }
      });

      console.log("SUPABASE SIGNUP DATA:", data);
      console.log("SUPABASE SIGNUP ERROR:", error);

      // ==========================================
      // 2. HANDLE SUPABASE ERROR
      // ==========================================

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("Registration failed. Please try again.");
        return;
      }

      // ==========================================
      // 3. CREATE LOCAL USER OBJECT
      // ==========================================

      const newUser = {
        id: data.user.id,

        name: formData.name,

        email: formData.email,

        phone: formData.phone,

        role:
          role === 'artisan'
            ? 'उद्योजक (Artisan Leader)'
            : 'Conscious Patron',

        village: formData.village,

        district: formData.district,

        craft: formData.craft,

        shgName: formData.shgName,

        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',

        trustScore: 98
      };

      // ==========================================
      // 4. KEEP YOUR EXISTING APP AUTH STATE
      // ==========================================

      loginAs(role, newUser);

      // ==========================================
      // 5. SUCCESS MESSAGE
      // ==========================================

      alert("Account created successfully!");

      // ==========================================
      // 6. REDIRECT
      // ==========================================

      if (role === 'artisan') {
        navigate('/entrepreneur/onboarding');
      } else {
        navigate('/marketplace');
      }

    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="content-top-spacer"
      style={{
        width: '100%',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
    >
      <div
        className="card-base"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '2.5rem',
          backgroundColor: 'var(--surface-container-lowest)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >

        {/* HEADER */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          <div
            className="badge-pill badge-primary"
            style={{
              marginBottom: '0.75rem'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px' }}
            >
              person_add
            </span>

            <span>
              Join Gramudyam • नोंदणी करा
            </span>
          </div>

          <h1
            className="headline-md"
            style={{
              color: 'var(--primary)'
            }}
          >
            Empower Your Rural Craft Enterprise
          </h1>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--on-surface-variant)',
              marginTop: '0.35rem'
            }}
          >
            Create an account to sell directly across India with voice AI
            tools or discover authentic regional crafts.
          </p>
        </div>

        {/* ROLE SELECTION */}

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >

          <button
            type="button"
            onClick={() => setRole('artisan')}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border:
                role === 'artisan'
                  ? '2px solid var(--primary)'
                  : '1px solid var(--border-subtle)',
              backgroundColor:
                role === 'artisan'
                  ? 'var(--primary-container)'
                  : 'var(--surface-container-low)',
              color:
                role === 'artisan'
                  ? 'white'
                  : 'var(--on-surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow:
                role === 'artisan'
                  ? 'var(--shadow-md)'
                  : 'none'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '26px' }}
            >
              handshake
            </span>

            <strong style={{ fontSize: '0.95rem' }}>
              Artisan / Self-Help Group
            </strong>

            <span
              style={{
                fontSize: '0.75rem',
                opacity: 0.85
              }}
            >
              मी कारागीर किंवा बचत गट आहे
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole('customer')}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              border:
                role === 'customer'
                  ? '2px solid var(--primary)'
                  : '1px solid var(--border-subtle)',
              backgroundColor:
                role === 'customer'
                  ? 'var(--primary-container)'
                  : 'var(--surface-container-low)',
              color:
                role === 'customer'
                  ? 'white'
                  : 'var(--on-surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow:
                role === 'customer'
                  ? 'var(--shadow-md)'
                  : 'none'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '26px' }}
            >
              shopping_bag
            </span>

            <strong style={{ fontSize: '0.95rem' }}>
              Conscious Patron
            </strong>

            <span
              style={{
                fontSize: '0.75rem',
                opacity: 0.85
              }}
            >
              मी ग्राहक / खरेदीदार आहे
            </span>
          </button>

        </div>

        {/* REGISTRATION FORM */}

        <form
          onSubmit={handleRegister}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >

          {/* NAME */}

          <div>
            <label className="label-field">
              Full Name *
            </label>

            <input
              type="text"
              name="name"
              placeholder={
                role === 'artisan'
                  ? 'e.g. Savita Patil'
                  : 'e.g. Ananya Sharma'
              }
              value={formData.name}
              onChange={handleChange}
              className="input-base"
              required
            />
          </div>

          {/* PHONE + EMAIL */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}
          >

            <div>
              <label className="label-field">
                WhatsApp Mobile Number *
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>

            <div>
              <label className="label-field">
                Email Address *
              </label>

              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>

          </div>

          {/* PASSWORD */}

          <div>
            <label className="label-field">
              Password *
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="input-base"
              required
              minLength={6}
            />
          </div>

          {/* ARTISAN DETAILS */}

          {role === 'artisan' && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}
              >

                <div>
                  <label className="label-field">
                    Village / Taluka (गाव / तालुका)
                  </label>

                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="label-field">
                    District (जिल्हा)
                  </label>

                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="select-base"
                  >
                    <option value="Palghar">
                      Palghar (पालघर)
                    </option>

                    <option value="Nashik">
                      Nashik (नाशिक)
                    </option>

                    <option value="Kolhapur">
                      Kolhapur (कोल्हापूर)
                    </option>

                    <option value="Satara">
                      Satara (सातारा)
                    </option>

                    <option value="Chhatrapati Sambhajinagar">
                      Chhatrapati Sambhajinagar (छ. संभाजीनगर)
                    </option>

                    <option value="Sindhudurg">
                      Sindhudurg (सिंधुदुर्ग)
                    </option>
                  </select>
                </div>

              </div>

              <div>
                <label className="label-field">
                  Self-Help Group (SHG) or Cooperative Name
                </label>

                <input
                  type="text"
                  name="shgName"
                  placeholder="e.g. Mahila Bachat Gat / Artisan Guild"
                  value={formData.shgName}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>
            </>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="btn-primary btn-lg"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '0.75rem',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1
            }}
          >
            <span>
              {loading
                ? 'Creating Account...'
                : role === 'artisan'
                  ? 'Continue to Onboarding Wizard'
                  : 'Create Patron Account'}
            </span>

            {!loading && (
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            )}
          </button>

        </form>

        {/* LOGIN LINK */}

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.85rem',
            color: 'var(--on-surface-variant)'
          }}
        >
          Already registered?{' '}

          <Link
            to="/login"
            style={{
              color: 'var(--secondary)',
              fontWeight: '700'
            }}
          >
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
};