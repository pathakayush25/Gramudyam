import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import { demoArtisan, demoCustomer } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gramudyam_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [role, setRole] = useState(() => {
    try {
      const saved = localStorage.getItem('gramudyam_auth_user');
      if (saved) return JSON.parse(saved).role;
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);


  // =========================
  // LOAD CURRENT SESSION
  // =========================
  useEffect(() => {

    const loadSession = async () => {

      try {

        const currentUser = await authService.getCurrentUser();

        if (!currentUser) {
          const saved = localStorage.getItem('gramudyam_auth_user');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed?.id) {
                setUser(parsed);
                setRole(parsed.role || 'artisan');
                setLoading(false);
                return;
              }
            } catch {}
          }
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        const profile = await authService.getCurrentProfile();

        if (profile) {

          const loggedInUser = {
            id: currentUser.id,
            name: profile.full_name,
            email: profile.email || currentUser.email,
            phone: profile.phone,
            role: profile.role,
            village: profile.village,
            district: profile.district,
            craft: profile.craft,
            shgName: profile.shg_name
          };

          setUser(loggedInUser);
          setRole(profile.role);

        } else {
          const resolvedRole = currentUser.user_metadata?.role || 'artisan';
          const fallbackUser = {
            id: currentUser.id,
            name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Artisan',
            email: currentUser.email,
            phone: currentUser.user_metadata?.phone || '',
            role: resolvedRole,
            village: currentUser.user_metadata?.village || 'Palghar',
            district: currentUser.user_metadata?.district || 'Palghar',
            craft: currentUser.user_metadata?.craft || 'Handicrafts'
          };
          setUser(fallbackUser);
          setRole(resolvedRole);
        }

      } catch (error) {

        console.error('AUTH SESSION ERROR:', error);

        setUser(null);
        setRole(null);

      } finally {

        setLoading(false);

      }
    };


    loadSession();


    // =========================
    // SUPABASE AUTH LISTENER
    // =========================

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        console.log('AUTH EVENT:', event);

        if (!session) {
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setRole(null);
          }
          return;
        }

        try {

          const profile = await authService.getProfile(
            session.user.id
          );

          if (profile) {

            const loggedInUser = {
              id: session.user.id,
              name: profile.full_name,
              email: profile.email || session.user.email,
              phone: profile.phone,
              role: profile.role,
              village: profile.village,
              district: profile.district,
              craft: profile.craft,
              shgName: profile.shg_name
            };

            setUser(loggedInUser);
            setRole(profile.role);

          } else {

            const resolvedRole = session.user.user_metadata?.role || 'artisan';
            const fallbackUser = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Artisan',
              email: session.user.email,
              phone: session.user.user_metadata?.phone || '',
              role: resolvedRole,
              village: session.user.user_metadata?.village || 'Palghar',
              district: session.user.user_metadata?.district || 'Palghar',
              craft: session.user.user_metadata?.craft || 'Handicrafts'
            };
            setUser(fallbackUser);
            setRole(resolvedRole);

          }

        } catch (error) {

          console.error(
            'AUTH STATE PROFILE ERROR:',
            error
          );

        }
      }
    );


    return () => {
      subscription.unsubscribe();
    };

  }, []);


  // =========================
  // LOGIN
  // =========================
  const loginAs = async (
    targetRole,
    customUser = null
  ) => {
    const resolvedUser = customUser || (targetRole === 'artisan' ? demoArtisan : demoCustomer);

    setUser(resolvedUser);
    setRole(resolvedUser.role || targetRole);

    try {
      localStorage.setItem('gramudyam_auth_user', JSON.stringify(resolvedUser));
    } catch (e) {
      console.warn('LocalStorage error saving session:', e);
    }

    return resolvedUser;
  };


  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {

    try {

      await authService.logout();

    } catch (error) {

      console.error('LOGOUT ERROR:', error);

    } finally {
      try {
        localStorage.removeItem('gramudyam_auth_user');
      } catch {}
      setUser(null);
      setRole(null);
    }
  };


  // =========================
  // UPDATE PROFILE
  // =========================
  const updateProfile = async (data) => {

    if (!user?.id) {
      console.error(
        'Cannot update profile: no logged-in user.'
      );

      return null;
    }

    try {

      const { data: updatedProfile, error } =
        await supabase
          .from('profiles')
          .update(data)
          .eq('id', user.id)
          .select()
          .single();

      if (error) {
        throw error;
      }

      const updatedUser = {
        ...user,
        name: updatedProfile.full_name,
        email: updatedProfile.email || user.email,
        phone: updatedProfile.phone,
        role: updatedProfile.role,
        village: updatedProfile.village,
        district: updatedProfile.district,
        craft: updatedProfile.craft,
        shgName: updatedProfile.shg_name
      };

      setUser(updatedUser);
      setRole(updatedProfile.role);

      return updatedUser;

    } catch (error) {

      console.error(
        'UPDATE PROFILE ERROR:',
        error
      );

      return null;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        setRole,
        loginAs,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () =>
  useContext(AuthContext);