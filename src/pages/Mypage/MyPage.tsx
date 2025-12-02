import DliveryState from './DliveryState';
import MenuSide from './MenuSide';

function MyPage() {
  return (
    <div
      className=" w-full 
        min-w-[460px]          
        sm:min-w-[500px]        
        md:min-w-[750px]        
        lg:min-w-[850px]        
        xl:min-w-[900px] 
        max-w-[1260px]     
        mx-auto flex flex-row items-start   
        gap-0 mt-12 mb-36
      "
    >
      <div className="flex w-1/4 h-auto pr-8 border-r border-gray-200 ">
        <MenuSide />
      </div>
      <div className="flex flex-1 pl-8 ">
        <DliveryState />
      </div>
    </div>
  );
}

export default MyPage;
