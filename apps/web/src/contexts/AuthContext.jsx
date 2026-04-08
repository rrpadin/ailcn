import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    pb.authStore.isValid && pb.authStore.model?.collectionName === 'users' 
      ? pb.authStore.model 
      : null
  );
  const [currentAdmin, setCurrentAdmin] = useState(
    pb.authStore.isValid && pb.authStore.model?.collectionName === 'admins' 
      ? pb.authStore.model 
      : null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);

    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (pb.authStore.isValid) {
        if (model?.collectionName === 'admins') {
          setCurrentAdmin(model);
          setCurrentUser(null);
        } else if (model?.collectionName === 'users') {
          setCurrentUser(model);
          setCurrentAdmin(null);
        }
      } else {
        setCurrentAdmin(null);
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('admins').authWithPassword(email, password, { 
      $autoCancel: false 
    });
    setCurrentAdmin(authData.record);
    return authData;
  };

  const userLogin = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, {
      $autoCancel: false
    });
    setCurrentUser(authData.record);
    return authData;
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      const name = `${firstName} ${lastName}`.trim();
      
      // Create the user
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name,
        status: 'pending'
      }, { $autoCancel: false });

      // Automatically log them in
      const authData = await pb.collection('users').authWithPassword(email, password, {
        $autoCancel: false
      });
      
      setCurrentUser(authData.record);
      return authData.record;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentAdmin(null);
    setCurrentUser(null);
  };

  const isAdminAuthenticated = pb.authStore.isValid && pb.authStore.model?.collectionName === 'admins';
  const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.collectionName === 'users';

  const value = {
    currentUser,
    currentAdmin,
    isAuthenticated,
    isAdminAuthenticated,
    login,
    userLogin,
    signup,
    logout,
    isLoading,
    isAdmin: isAdminAuthenticated,
    isMember: isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};