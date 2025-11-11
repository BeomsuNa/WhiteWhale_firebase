import { db } from '@/config/firebase';
import { useAuthStore } from '@/stores/authStore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const UseSocialLogin = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const googleLogin = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleAuthProvider);
    const { user } = result;
    const userRef = doc(db, 'Users', user.uid);
    const docsnap = await getDoc(userRef);
    if (!docsnap.exists()) {
      alert('로그인 인증에 성공했습니다! 회원가입을 진행해주세요');
      navigate('/SignUp');
    }
    return user;
  };

  // google social logout
  const googleLogout = async () => {
    await signOut(auth);
  };
  return { googleLogin, googleLogout };
};

export const UseTestSocialLogin = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const TestgoogleLogin = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleAuthProvider);
    const { user } = result;
    const userRef = doc(db, 'TestUsers', user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email ?? null,
        providerId: user.providerData[0]?.providerId ?? 'google',
        role: 'customer', // 기본 역할
        createdAt: serverTimestamp(),
      });
    }
    alert('로그인 되었습니다');
    navigate('/');
    return user;
  };

  return { TestgoogleLogin };
};
