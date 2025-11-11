import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface UserRoleData {
  uid: string;
  email: string | null;
  nickname?: string;
  isSeller?: boolean;
}

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userRoleData: UserRoleData | null;
  isLoggedIn: boolean;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuthListener: () => void; // onAuthStateChanged 동기화
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      firebaseUser: null,
      userRoleData: null,
      isLoggedIn: false,

      setFirebaseUser: async user => {
        if (!user) {
          set(
            {
              firebaseUser: null,
              userRoleData: null,
              isLoggedIn: false,
            },
            false,
            'clearUser',
          );
          return;
        }

        const docRef = doc(db, 'User', user.uid);
        const docSnap = await getDoc(docRef);

        let userRoleData: UserRoleData = {
          uid: user.uid,
          email: user.email,
          isSeller: false,
        };

        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<UserRoleData>;
          userRoleData = { ...userRoleData, ...data };
        }
        set({
          firebaseUser: user,
          userRoleData,
          isLoggedIn: true,
        });
      },
      login: async (email, password) => {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await get().setFirebaseUser(userCredential.user);
      },

      logout: async () => {
        const auth = getAuth();
        await signOut(auth);
        set({ firebaseUser: null, isLoggedIn: false }, false, 'logout');
      },
      initAuthListener: () => {
        const auth = getAuth();
        onAuthStateChanged(auth, async user => {
          await get().setFirebaseUser(user);
        });
      },
    }),
    { name: 'AuthStore' }, // DevTools에서 식별 이름
  ),
);

export const useSocialAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      firebaseUser: null,
      userRoleData: null,
      isLoggedIn: false,

      setFirebaseUser: async user => {
        if (!user) {
          set(
            {
              firebaseUser: null,
              userRoleData: null,
              isLoggedIn: false,
            },
            false,
            'clearUser',
          );
          return;
        }

        const docRef = doc(db, 'SocialUser', user.uid);
        const docSnap = await getDoc(docRef);

        let userRoleData: UserRoleData = {
          uid: user.uid,
          email: user.email,
          isSeller: false,
        };

        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<UserRoleData>;
          userRoleData = { ...userRoleData, ...data };
        }
        set({
          firebaseUser: user,
          userRoleData,
          isLoggedIn: true,
        });
      },
      login: async (email, password) => {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await get().setFirebaseUser(userCredential.user);
      },

      logout: async () => {
        const auth = getAuth();
        await signOut(auth);
        set({ firebaseUser: null, isLoggedIn: false }, false, 'logout');
      },
      initAuthListener: () => {
        const auth = getAuth();
        onAuthStateChanged(auth, async user => {
          await get().setFirebaseUser(user);
        });
      },
    }),
    { name: 'AuthStore' }, // DevTools에서 식별 이름
  ),
);
