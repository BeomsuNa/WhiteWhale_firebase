import { Outlet } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './components/context/AuthContext';

import Header from './components/ui/TopBar';
import { ProductCategoryProvider } from './components/context/ProductCategoryContext';
import PageHeader from './components/ui/PageHeader';
import SideDrawer from './components/ui/SideDrawer';
import Footer from './components/ui/Footer';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductCategoryProvider>
          <div
            className="w-full min-h-screen flex flex-col justify-start  bg-backgroundColor "
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
