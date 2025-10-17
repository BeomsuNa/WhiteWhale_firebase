import { Outlet } from 'react-router-dom';
import './App.css';

import Header from './components/ui/TopBar';
import { ProductCategoryProvider } from './components/context/ProductCategoryContext';
import PageHeader from './components/ui/PageHeader';
import SideDrawer from './components/ui/SideDrawer';
import Footer from './components/ui/Footer';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { useEffect, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const queryClient = useMemo(() => new QueryClient(), []);
  const setFirebaseUser = useAuthStore(s => s.setFirebaseUser);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setFirebaseUser(user);
      if (user) {
        queryClient.setQueryData(['user', user.uid], user);
      } else {
        queryClient.removeQueries({ queryKey: ['user'] });
      }
    });
    return () => unsubscribe();
  }, [setFirebaseUser, queryClient]);
  return (
    <QueryClientProvider client={queryClient}>
      <ProductCategoryProvider>
        <div
          className="w-full min-h-screen flex flex-col justify-start  "
          id="mainSection"
        >
          <Header />
          <SideDrawer />
          <PageHeader />
          <div className="flex items-center justify-center flex-grow ">
            <Outlet />
          </div>
          <Footer />
        </div>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ProductCategoryProvider>
    </QueryClientProvider>
  );
}

export default App;
