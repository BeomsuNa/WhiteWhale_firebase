import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { UseSocialLogin, UseTestSocialLogin } from '@/hooks/UseSocialLogin';

interface LoginFormProps {
  onLogin: (email: string, passWord: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState<string>('');
  const [passWord, setPassWord] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { googleLogin, googleLogout } = UseSocialLogin();
  const { TestgoogleLogin } = UseTestSocialLogin();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, passWord);
      navigate('/'); // 로그인 성공 시 홈으로 이동
    } catch (error) {
      // 로그인 실패 시 처리할 로직 추가
      alert('로그인이 실패하였습니다. 다시 확인해주세요!');
    }
  };
  return (
    <article className="flex justify-center m-12  min-h-screen min-w-[2000px]">
      <div className="w-full max-w-md max-h-svh pl-8 pr-8 pt-8 shadow-md bg-gray-300">
        <form onSubmit={handleLogin} className=" pl-8 pr-8 pt-8 ">
          <header className="mb-10 text-lg font-bold"> Login</header>
          <fieldset className="mb-4">
            <legend className="sr-only">Login Credentials</legend>
            <section className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border border-black bg-slate-200"
              />
            </section>
            <section className="mb-4">
              <Label htmlFor="passWord">PASSWORD</Label>
              <Input
                type="password"
                id="passWord"
                value={passWord}
                onChange={e => setPassWord(e.target.value)}
                className="border border-black bg-slate-200"
              />
            </section>
          </fieldset>

          <Button type="submit" className="mt-6 mx-6">
            로그인
          </Button>
          <p>
            아직 아이디가 없으신가요? <a href="/SignUp">회원가입 클릭</a>
          </p>
        </form>
        <footer className="mt-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <Button className="w-full">NAVER</Button>
            <Button className="w-full">KAKAO</Button>
            <Button className="w-full" onClick={() => googleLogin()}>
              GOOGLE
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-5">
            <Button className="w-full">NAVER(테스트버전입니다)</Button>
            <Button className="w-full">KAKAO(테스트버전입니다)</Button>
            <Button className="w-full" onClick={() => TestgoogleLogin()}>
              GOOGLE(테스트버전입니다)
            </Button>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default LoginForm;
