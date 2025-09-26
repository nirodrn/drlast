import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { app, database } from '../lib/firebase';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const checkAdminStatus = async (user: User) => {
    try {
      const adminRef = ref(database, 'admin');
      const snapshot = await get(adminRef);
      if (snapshot.exists()) {
        const adminData = snapshot.val();
        const isUserAdmin = Object.values(adminData).some(
          (admin: any) => admin.email === user.email && admin.role === 'admin'
        );
        setIsAdmin(isUserAdmin);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const createUserProfile = async (user: User) => {
    const userRef = ref(database, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    
    if (!userSnapshot.exists()) {
      await set(userRef, {
        email: user.email,
        name: user.displayName || '',
        role: 'user',
        createdAt: new Date().toISOString()
      });
    }
  };

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user);
      await checkAdminStatus(result.user);
      toast.success('Logged in successfully with Google');
    } catch (error: any) {
      toast.error('Failed to sign in with Google');
      throw error;
    }
  }

  async function register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(userCredential.user);
      toast.success('Account created successfully');
    } catch (error: any) {
      let message = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters';
      }
      toast.error(message);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await checkAdminStatus(userCredential.user);
      toast.success('Logged in successfully');
    } catch (error: any) {
      let message = 'Failed to sign in';
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      }
      toast.error(message);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await checkAdminStatus(user);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    isAdmin,
    loading,
    login,
    loginWithGoogle,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}