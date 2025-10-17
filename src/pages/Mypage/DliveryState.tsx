import { Label } from '@radix-ui/react-label';
import React from 'react';

const DliveryState = () => {
  return (
    <div
      className="w-full 
  min-w-[300px]           
  sm:min-w-[500px]        
  md:min-w-[750px]        
  lg:min-w-[850px]       
  xl:min-w-[900px]        
  max-w-[1260px] mx-auto h-full flex flex-col   "
    >
      <div className="flex flex-row w-full h-full border bg-[rgb(182,180,180)]  border-gray-200 mb-12">
        <div className=" flex bg-[hsl(220_8%_35%)] items-center justify-center  w-1/2">
          님의 회원등급입니다.
        </div>
        <div className="flex flex-row items-center justify-center w-1/2">
          <div className="w-1/3">쿠폰</div>
          <div className="w-1/3">회원등급</div>
          <div className="w-1/3">예치금</div>
        </div>
      </div>
      <div>
        <Label className="flex flex-row items-center gap-3">
          <h2 className="text-xl font-semibold">현재 배송중인 상품</h2>
          <h6>최근 30일 내 주문한 상품입니다.</h6>
        </Label>

        <div className="mt-12 w-full h-full flex bg-[hsl(var(--infocard))] p-8">
          <ol className="flex flex-row w-full justify-around items-center relative">
            {[
              '입금대기',
              '결제완료',
              '상품준비중',
              '배송중',
              '배송완료',
              '구매확정',
            ].map((label, i, arr) => (
              <li key={label} className="relative flex flex-col items-center">
                {/* 🔹 상태 항목 */}
                <b className="font-normal mb-1">{label}</b>
                <strong className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-gray-700 font-semibold">
                  0
                </strong>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DliveryState;
