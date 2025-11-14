import React from 'react';

const MenuSide = () => {
  return (
    <aside className="w-full px-6 py-8 ">
      <h2 className="font-bold text-lg mb-7 border-b pb-3">마이페이지</h2>

      <section className="mb-7">
        <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-2">
          쇼핑정보
        </h3>
        <ul className="space-y-2 text-sm  pl-2">
          <li>- 주문목록/배송조회</li>
          <li>- 취소/반품/교환 내역</li>
          <li>- 환불/입금 내역</li>
          <li>- 찜리스트</li>
        </ul>
      </section>

      <section className="mb-7">
        <h3 className="font-bold text-base mb-3 border-b  pb-2">혜택관리</h3>
        <ul className="space-y-2 text-sm  pl-2">
          <li>- 쿠폰</li>
          <li>- 예치금</li>
          <li>- 마일리지</li>
        </ul>
      </section>

      <section className="mb-7">
        <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-2">
          고객센터
        </h3>
        <ul className="space-y-2 text-smpl-2">
          <li>- 1:1 문의</li>
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-base mb-3 border-b border-gray-200 pb-2">
          회원정보
        </h3>
        <ul className="space-y-2 text-sm  pl-2">
          <li className=" font-bold">- 회원정보 변경</li>
        </ul>
      </section>
    </aside>
  );
};

export default MenuSide;
