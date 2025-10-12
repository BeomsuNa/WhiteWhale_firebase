import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  isLoggedIn: boolean;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    set => ({
      firebaseUser: null,
      isLoggedIn: false,

      setFirebaseUser: user =>
        set(
          () => ({
            firebaseUser: user,
            isLoggedIn: !!user,
          }),
          false,
          'setFirebaseUser',
        ),

      login: async (email, password) => {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
      },

      logout: async () => {
        const auth = getAuth();
        await signOut(auth);
        set({ firebaseUser: null, isLoggedIn: false }, false, 'logout');
      },
    }),
    { name: 'AuthStore' }, // DevTools에서 식별 이름
  ),
);
