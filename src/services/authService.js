import { supabase } from '../lib/supabase';

export const authService = {

  // =========================
  // REGISTER
  // =========================
  async register({
    name,
    email,
    password,
    phone,
    role
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone,
          role: role
        }
      }
    });

    if (error) {
      throw error;
    }

    return data;
  },


  // =========================
  // LOGIN
  // =========================
  async login(email, password) {

    // Make sure login receives strings
    if (typeof email !== 'string') {
      throw new Error('Login email must be a string.');
    }

    if (typeof password !== 'string') {
      throw new Error('Login password must be a string.');
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

    if (error) {
      throw error;
    }

    return data;
  },


  // =========================
  // LOGOUT
  // =========================
  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return true;
  },


  // =========================
  // GET CURRENT USER
  // =========================
  async getCurrentUser() {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return null;
    }

    if (!session) {
      return null;
    }

    return session.user;
  },


  // =========================
  // GET CURRENT PROFILE
  // =========================
  async getCurrentProfile() {

    const user = await this.getCurrentUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Profile error:', error);
      return null;
    }

    return data;
  },


  // =========================
  // GET CURRENT ROLE
  // =========================
  async getCurrentRole() {

    const profile = await this.getCurrentProfile();

    if (!profile) {
      return null;
    }

    return profile.role;
  },


  // =========================
  // GET PROFILE BY USER ID
  // =========================
  async getProfile(userId) {

    if (!userId) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile error:', error);
      return null;
    }

    return data;
  }
};