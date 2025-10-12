import { Link } from 'react-router-dom';
import { GitHub, Notion } from '@/assets/logo';

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col justify-center items-center w-full h-72 bg-slate-500  ">
        <div className=" flex items-center p-5">
          <h2>GitHub :</h2>
          <Link rel="preconnect" to="https://github.com/pass98/whiteWhale">
            <img
              src={GitHub}
              alt="GitHub.png"
              className="ml-2 size-8 object-cover w-8 h-8 "
            />
          </Link>
        </div>
        <div />
        <div className="p-5">
          <Link rel="preconnect" to="https://velog.io/@skqjatn293/posts">
            <h2>Blog : https://velog.io/@skqjatn293/posts</h2>
          </Link>
        </div>
        <div className="flex items-center p-5">
          {' '}
          <h2>Notion : </h2>
          <div className=" ml-2 size-8">
            <img
              src={Notion}
              alt="notion.png"
              className="obejct-cover w-8 h-8"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
