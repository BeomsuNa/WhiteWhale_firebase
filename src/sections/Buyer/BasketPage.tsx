import { useCart } from '@/components/context/CartContext';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BasketPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartQuantity(productId, quantity);
  };

  const goToBuyProductPage = () => {
    navigate('/buyprodcut');
  };

  const totalAmount = cart.reduce(
    (total, product) => total + product.productPrice * product.quantity,
    0,
  );
  const shippingFee = 3000;
  const grandTotal = totalAmount + shippingFee;

  return (
    <article className="min-h-screen bg-gray-900 text-white p-6 sm:p-10 md:p-20">
      <div className="max-w-4xl mx-auto">
        <header className="text-3xl font-bold mb-8 text-center sm:text-left">
          장바구니 🛒
        </header>

        {cart.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
            <p className="text-xl text-gray-400">장바구니가 비어 있습니다.</p>
            <Button
              className="mt-6 px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
              onClick={() => navigate('/Products')}
            >
              쇼핑하러 가기
            </Button>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
            <ul>
              {cart.map(product => (
                <li
                  key={product.id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <figure className="flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="w-24 h-24 object-cover rounded-md shadow-sm border border-gray-700"
                      />
                      <figcaption className="sr-only">
                        {product.productName}
                      </figcaption>
                    </figure>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-medium">
                        {product.productName}
                      </h3>
                      <p className="text-gray-400">
                        가격: {product.productPrice.toLocaleString()} 원
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center">
                      <Button
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                      >
                        -
                      </Button>
                      <span className="mx-4 text-xl font-bold w-6 text-center">
                        {product.quantity}
                      </span>
                      <Button
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      onClick={() => removeFromCart(product.id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      variant="ghost"
                    >
                      삭제
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Total Amount Section */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <span className="text-xl font-semibold text-gray-300">
                  총 상품 금액
                </span>
                <span className="text-2xl font-bold text-white">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <span className="text-xl font-semibold text-gray-300">
                  배송비
                </span>
                <span className="text-2xl font-bold text-white">
                  {shippingFee.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Grand Total Section */}
            <div className="mt-8 pt-8 border-t-2 border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="text-2xl font-bold">결제 예상 금액</span>
              <span className="text-3xl font-extrabold text-teal-400">
                {grandTotal.toLocaleString()}원
              </span>
            </div>

            {/* Purchase Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={goToBuyProductPage}
                className="w-full sm:w-2/3 px-8 py-4 text-lg font-bold bg-teal-500 hover:bg-teal-600 text-white transition-colors rounded-lg shadow-lg"
              >
                구매하기
              </Button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BasketPage;
