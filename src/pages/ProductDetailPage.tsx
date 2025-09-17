import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '@/lib/utils';
import { useFetchProductCardData } from '@/hooks/UseFetchData';
import MainProductCard from '@/components/ui/MainProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { useCart } from '@/components/context/CartContext';

interface MainProductCardProps {
  sortOption: string;
  onClose: () => void;
}

const ProductDetailPage: React.FC<MainProductCardProps> = ({
  sortOption,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const { productId } = useParams<{ productId: string }>();
  const { data: products } = useFetchProductCardData(sortOption);
  const { addToCart } = useCart();
  const [orderProductCount, setOrderProductCount] = useState<number>(1);
  const [finishiCart, setFinishiCart] = useState(false);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);

  const incrementCount = () => {
    setOrderProductCount(prevCount => prevCount + 1);
  };

  const decrementCount = () => {
    setOrderProductCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
  };

  if (!product) {
    return <div>정보를 받아오지 못했습니다.</div>;
  }
  const currentProduct = products?.find(
    curproduct => curproduct.id === productId,
  );
  if (!currentProduct) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  const sameCategoryProducts = products?.filter(
    sameproduct =>
      sameproduct.productCategory === currentProduct.productCategory &&
      sameproduct.id !== currentProduct.id,
  );

  const handleAddToCart = () => {
    if (orderProductCount === 0) {
      alert('개수를 선택해주세요!');
    } else {
      addToCart({ ...product, quantity: orderProductCount });
      alert('선택하신 상품을 장바구니에 담았습니다!');
      setFinishiCart(true);
    }
  };

  const goToBaseketPagae = () => {
    navigate('/basket');
  };
  return (
    <article className="h-full w-[80%] ">
      <div className="flex justify-center gap-52">
        <div className="mt-12 items-center justify-center" id="figureSection">
          <figure className="w-240 h-240 border ">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
            <figcaption className="sr-only">{product.productName}</figcaption>
          </figure>
        </div>
        <div className="mt-12 flex flex-col justify-between" id="infoSection">
          {/* 상품명 */}
          <h1 className="text-2xl font-bold text-gray-900">
            {product.productName}
          </h1>
          <div className="space-y-6 mt-auto">
            {/* 구매 수량 */}
            <div className="flex items-center justify-between">
              <span className="text-lg text-black">구매수량</span>
              <div className="flex items-center space-x-2">
                <button
                  className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 bg-gray-50 text-lg font-bold hover:bg-gray-100"
                  onClick={decrementCount}
                  type="button"
                >
                  −
                </button>
                <span className="text-lg font-semibold">
                  {orderProductCount}
                </span>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 bg-gray-50 text-lg font-bold hover:bg-gray-100"
                  onClick={incrementCount}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="space-y-2 text-left">
            <p className="text-black">
              배송비 : <span className="font-medium">3,000원</span>
            </p>
            <p className="text-2xl font-bold ">
              총 금액 :{' '}
              {(product.productPrice * orderProductCount + 3000)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              원
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 py-3 text-lg bg-green-500 hover:bg-green-600">
              구매하기
            </Button>
            {finishiCart ? (
              <Button
                className="flex-1 py-3 text-lg bg-gray-700 hover:bg-gray-800"
                onClick={goToBaseketPagae}
              >
                장바구니보기
              </Button>
            ) : (
              <Button
                className="flex-1 py-3 text-lg bg-blue-600 hover:bg-blue-700"
                onClick={handleAddToCart}
              >
                장바구니담기
              </Button>
            )}
          </div>
        </div>
      </div>

      <footer className="flex flex-col justify-center items-center mt-12 ">
        <h3 className="text-lg font-semibold mb-12">
          같은 카테고리의 다른 상품들
        </h3>
        <div className="w-[80%] mb-24">
          <Carousel
            opts={{ loop: true }}
            plugins={[]}
            setApi={setEmblaApi}
            orientation="horizontal"
            className="flex justify-center"
          >
            <CarouselContent className="">
              {sameCategoryProducts?.map(sameproduct => (
                <CarouselItem key={sameproduct.id} className="basis-1/3">
                  <MainProductCard product={sameproduct} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </footer>
    </article>
  );
};

export default ProductDetailPage;
