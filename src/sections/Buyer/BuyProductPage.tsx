import * as PortOne from '@portone/browser-sdk/v2';

import { Button } from '@/components/ui/button';
import Geocoder from '@/Order/Geocoder';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/components/context/AuthContext';
import { PaymentResponse } from '@/lib/payments';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useCart } from '@/hooks/UseCart';

const BuyProductPage = () => {
  const { data: user } = useQuery<User>({ queryKey: ['user'] });
  const navigate = useNavigate();
  const { cart, updateQuantity, clearCart } = useCart();
  const queryClient = useQueryClient();
  const { data: addressData } = useQuery({ queryKey: ['addressData'] });

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(productId, quantity);
  };

  const handlePayment = async () => {
    try {
      // 1️⃣ PortOne 결제 요청 (cart의 각 상품에 대해 병렬 요청)
      const paymentResponses = await Promise.all(
        cart.map(async product => {
          const response = (await PortOne.requestPayment({
            storeId: import.meta.env.VITE_STORE_ID,
            channelKey: import.meta.env.VITE_CHANNEL_KEY,
            paymentId: `payment-${crypto.randomUUID()}`,
            orderName: product.productName,
            totalAmount: product.productPrice * product.quantity + 3000,
            currency: 'CURRENCY_KRW',
            payMethod: 'CARD',
          })) as PaymentResponse | undefined;

          if (response?.code != null) {
            throw new Error(response.message);
          }

          // 결제 성공 시 Firestore에 주문 데이터 저장
          const orderId = `order-${crypto.randomUUID()}`;
          const orderRef = doc(collection(db, 'Orders'), orderId);

          await setDoc(orderRef, {
            orderId,
            userId: user!.uid ?? 'guest',
            productId: product.id,
            productName: product.productName,
            productPrice: product.productPrice,
            orderQuantity: product.quantity,
            address: addressData || '미지정',
            payMethod: 'CARD',
            payState: 'paid',
            createdAt: serverTimestamp(),
          });

          // 재고(productQuantity) 업데이트
          const productRef = doc(db, 'Product', product.id);
          await updateDoc(productRef, {
            productQuantity: Math.max(
              product.productQuantity! - product.quantity,
              0,
            ),
          });

          return response;
        }),
      );

      // 2️⃣ React Query 수동 무효화 (상품, 장바구니, 구매목록 등)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['cart'] }),
        queryClient.invalidateQueries({ queryKey: ['products'] }),
        queryClient.invalidateQueries({ queryKey: ['productCardData'] }),
        queryClient.invalidateQueries({ queryKey: ['orders'] }),
      ]);

      // 3️⃣ 장바구니 비우기
      clearCart();

      // 4️⃣ 사용자 안내 및 페이지 이동
      alert('결제가 완료되었습니다.');
      navigate('/mypage/orders'); // 주문 내역 페이지로 이동
    } catch (error: any) {
      console.error('결제 실패:', error);
      alert(error.message || '결제 중 오류가 발생했습니다.');
    }
  };

  const totalAmount = cart.reduce(
    (total, product) => total + product.productPrice * product.quantity,
    0,
  );
  const shippingFee = 3000;
  const grandTotal = totalAmount + shippingFee;

  return (
    <main className="bg-gray-50 min-h-screen py-12 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12 tracking-tight">
          Checkout
        </h1>

        {/* Orderer Information Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200">
            주문자 정보 (Orderer Info) 🙋‍♀️
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이름 (Name)
              </label>
              <input
                id="name"
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                전화번호 (Phone)
              </label>
              <div className="flex space-x-2">
                <select
                  id="phone-prefix"
                  title="휴대폰 사업자"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="010" selected>
                    010
                  </option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                </select>
                <input
                  id="phone-middle"
                  placeholder="xxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <input
                  id="phone-last"
                  placeholder="xxxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이메일 (Email)
              </label>
              <div className="flex space-x-2">
                <input
                  id="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <span className="self-center text-gray-500">@</span>
                <select className="w-40 px-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                  <option value="naver.com">naver.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="nate.com">nate.com</option>
                  <option value="gmail.com">gmail.com</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Information Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200">
            배송지 정보 (Shipping Info) 🚚
          </h2>
          <Geocoder />
        </section>

        {/* Product List Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200">
            주문 상품 (Order Items) 📦
          </h2>
          <ul>
            {cart.map(product => (
              <li
                key={product.id}
                className="flex items-center space-x-6 py-4 border-b last:border-b-0 border-gray-200"
              >
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-24 h-24 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.productName}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {product.productPrice.toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <div className="text-lg font-medium w-6 text-center">
                      {product.productQuantity}
                    </div>
                    <Button
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      onClick={() =>
                        handleQuantityChange(product.id, product.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Payment Summary & Button */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200">
            결제 정보 (Payment Summary) 💰
          </h2>
          <div className="space-y-3 text-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">총 상품 금액 (Total)</span>
              <span className="font-semibold">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">배송비 (Shipping Fee)</span>
              <span className="font-semibold">
                {shippingFee.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-xl font-bold">
                총 결제 금액 (Grand Total)
              </span>
              <span className="text-xl font-bold text-indigo-600">
                {grandTotal.toLocaleString()}원
              </span>
            </div>
          </div>
          <Button
            onClick={handlePayment}
            className="w-full mt-8 py-3 rounded-lg text-white font-bold text-lg bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg"
          >
            결제하기 (Pay Now)
          </Button>
        </section>
      </div>
    </main>
  );
};

export default BuyProductPage;
