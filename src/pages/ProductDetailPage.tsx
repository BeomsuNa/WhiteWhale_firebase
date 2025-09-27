import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '@/lib/product';
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
import { Label } from '@radix-ui/react-label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';

interface MainProductCardProps {
  sortOption: string;
  onClose: () => void;
}
type OptionType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

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
  const [selectedOption, setSelectedOption] = useState<OptionType[]>([]);
  const [orderProductCount, setOrderProductCount] = useState<number>(1);
  const [finishiCart, setFinishiCart] = useState(false);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [sold, setSold] = useState(true);
  const updateQuantity = (id: number, delta: number) => {
    setSelectedOption(prev =>
      prev.map(opt =>
        opt.id === id
          ? { ...opt, quantity: Math.max(1, opt.quantity + delta) }
          : opt,
      ),
    );
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

  const handleAddOption = () => {
    const newOption: OptionType = {
      id: Date.now(),
      name: '크라이톡스105 오일(5g)',
      price: 8500,
      quantity: 1,
    };
    setSelectedOption(prev => [...prev, newOption]);
  };

  const handleRemoveOption = (id: number) => {
    setSelectedOption(prev => prev.filter(opt => opt.id !== id));
  };

  const handleAddToCart = () => {
    if (orderProductCount === 0) {
      alert('개수를 선택해주세요!');
    } else {
      addToCart({ ...product, quantity: orderProductCount });
      alert('선택하신 상품을 장바구니에 담았습니다!');
      setFinishiCart(true);
    }
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
          <h1 className="text-2xl font-bold w-full max-w-xl min-h-[200px] text-gray-900">
            {product.productName}
          </h1>
          <div className="space-y-4">
            <div className="flex flex-col justify-center items-start gap-4">
              <Label className="text-xl font-semibold">
                {product.productName}
              </Label>
              <Select onValueChange={val => console.log(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={`${product.productCategory} 필수!!`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 선택된 옵션 박스들 */}
            {selectedOption.map(option => (
              <div
                key={option.id}
                className="relative border rounded-md p-4 bg-gray-50"
              >
                {/* 삭제 버튼 */}
                <Button
                  onClick={() => handleRemoveOption(option.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-black"
                >
                  x
                </Button>

                {/* 옵션명 */}
                <div className="text-sm font-medium max-w-sm min-h-[400px] text-gray-700 mb-3">
                  {option.name}
                </div>

                {/* 수량 & 가격 */}
                <div className="flex items-center justify-between">
                  {/* 수량 컨트롤 */}
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => updateQuantity(option.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-gray-50 text-lg font-bold hover:bg-gray-100"
                    >
                      −
                    </Button>
                    <span className="text-lg font-semibold">
                      {option.quantity}
                    </span>
                    <Button
                      onClick={() => updateQuantity(option.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-gray-50 text-lg font-bold hover:bg-gray-100"
                    >
                      +
                    </Button>
                  </div>

                  {/* 가격 */}
                  <div className="text-sm font-semibold">
                    {(option.price * option.quantity).toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
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
            {/* <Button className="flex-1 py-3 text-lg bg-green-500 hover:bg-green-600">
              구매하기
            </Button> */}

            {product.productQuantity > 0 ? (
              <Button
                className="flex-1 py-3 text-lg bg-blue-600 hover:bg-blue-700"
                onClick={handleAddToCart}
              >
                장바구니담기
              </Button>
            ) : (
              <Button className="bg-gray-400 text-white px-4 py-2 cursor-not-allowed">
                매진
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
