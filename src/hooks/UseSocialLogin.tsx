import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

export const UseSocialLogin = () => {
  const auth = getAuth();
  const googleLogin = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;
    await 
    return result.user;
  };

  // google social logout
  const googleLogout = async () => {
    await signOut(auth);
  };
  return { googleLogin, googleLogout };
};
