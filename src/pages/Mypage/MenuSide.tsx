import React from 'react';
import { Link } from 'react-router-dom';

const MenuSide = () => {
  return (
    <aside className="w-full px-6 ml-6 py-8 bg-[rgb(182,180,180)] rounded-md">
      <h2 className="font-bold text-lg text-gray-700 mb-7 border-b border-gray-500 pb-3 ">
        마이페이지
      </h2>

      <section className="mb-7">
        <div className="flex  ml-10">
          <h3 className="font-bold text-base text-gray-700 pt-2 mb-2">
            <span className="border-t-2 border-gray-100 pt-2">쇼핑</span>정보
          </h3>
        </div>
        <ul className="flex flex-col items-start space-y-2 text-sm pl-2 ml-12 ">
          <li>- 주문목록/배송조회</li>
          <li>- 취소/반품/교환 내역</li>
          <li>- 환불/입금 내역</li>
          <li>- 찜리스트</li>
        </ul>
      </section>

      <section className="mb-7">
        <div className="flex flex-row ml-10">
          <h3 className="font-bold text-base text-gray-700 pt-2 mb-2">
            <span className="border-t-2 border-gray-100 pt-2">혜택</span>관리
          </h3>
        </div>
        <ul className="flex flex-col items-start space-y-2 text-sm pl-2 ml-12">
          <li>- 쿠폰</li>
          <li>- 예치금</li>
          <li>- 마일리지</li>
        </ul>
      </section>

      <section className="mb-7">
        <div className="flex flex-row ml-10">
          <h3 className="font-bold text-base text-gray-700 pt-2 mb-2">
            <span className="border-t-2 border-gray-100 pt-2">고객</span>관리
          </h3>
        </div>
        <ul className="flex flex-col items-start space-y-2 text-sm pl-2 ml-12">
          <li>- 1:1 문의</li>
        </ul>
      </section>

      <section>
        <div className="flex flex-row ml-10">
          <h3 className="font-bold text-base text-gray-700 pt-2 mb-2">
            <span className="border-t-2 border-gray-100 pt-2">회원</span>정보
          </h3>
        </div>
        <ul className="flex flex-col items-start space-y-2 text-sm pl-2 ml-12">
          <li>
            <Link to="/mypage/edit">- 회원정보 변경</Link>
          </li>
          <li>- 회원탈퇴</li>
          <li>- 배송지정보</li>
        </ul>
      </section>

      <section>
        <div className="flex flex-row ml-10">
          <h3 className="font-bold text-base text-gray-700 pt-2 mb-2">
            <span className="border-t-2 border-gray-100 pt-2">나의</span>
            회원정보
          </h3>
        </div>
        <ul className="flex flex-col items-start space-y-2 text-sm pl-2 ml-12">
          <li>- 나의 상품정보</li>
        </ul>
      </section>

      <section>
        <div className="flex flex-row ml-10">
          <h3 className="font-bold text-base text-gray-700 pt-2 mb-2">
            <span className="border-t-2 border-gray-100 pt-2">쇼핑</span>정보
          </h3>
        </div>
        <ul className="flex flex-col items-start space-y-2 text-sm pl-2 ml-12">
          <li>- 나의 상품후기</li>
        </ul>
      </section>
    </aside>
  );
};

export default MenuSide;
