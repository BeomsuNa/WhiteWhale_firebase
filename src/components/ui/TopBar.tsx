import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import LoginInfoGuest from '@/sections/Login/LoginInfoGuest';
import LoginInfoSeller from '@/sections/Login/LoginInfoSeller';
import LoginInfoUser from '@/sections/Login/LoginInfoUser';
import { Elegant } from '@/assets/logo';
import { useAuthStore } from '@/stores/authStore';

const Header = () => {
  const user = useAuthStore(s => s.userRoleData);
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const handleLogOutButton = () => {
    logout();
    navigate('/');
  };

  const handleMainPage = () => {
    navigate('/');
  };

  const getloginInfoSection = () => {
    if (!isLoggedIn || !user) {
      return <LoginInfoGuest />;
    }
    if (isLoggedIn && user.isSeller) {
      return (
        <LoginInfoSeller
          nickname={user.nickname ?? '판매자'}
          handleLogOutButton={handleLogOutButton}
        />
      );
    }
    return (
      <LoginInfoUser
        nickname={user.nickname ?? '구매자'}
        handleLogOutButton={handleLogOutButton}
      />
    );
  };

  return (
    <div
      className="w-full 
  min-w-[300px]           
  sm:min-w-[500px]        
  md:min-w-[750px]        
  lg:min-w-[850px]       
  xl:min-w-[900px]        
   mx-aut flex justify-between p-4 bg-rgb(55, 58, 64) text-white"
    >
      <Avatar>
        <AvatarImage
          src={Elegant}
          className="w-24 h-24"
          onClick={() => handleMainPage}
          alt="logo"
        />
        <AvatarFallback>불러오는 중...</AvatarFallback>
      </Avatar>
      {getloginInfoSection()}
    </div>
  );
};

export default Header;
