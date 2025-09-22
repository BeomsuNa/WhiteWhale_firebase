import MainProductCard from '@/components/ui/MainProductCard';
import { UploadProduct } from '@/lib/product';
import { useFetchProductCardData } from '@/hooks/UseFetchData';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductCategory } from '@/components/context/ProductCategoryContext';
import { v4 as uuidv4 } from 'uuid';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Label } from '@radix-ui/react-label';
import Skeleton from '../components/ui/Skele';
import { Button } from '@/components/ui/button';

interface CategorizedProducts {
  [category: string]: UploadProduct[];
}

interface MainPageLayOutProps {
  sortOption: string;
}

const MainPageLayOut: React.FC<MainPageLayOutProps> = ({ sortOption }) => {
  const {
    data: products,
    isLoading,
    error,
  } = useFetchProductCardData(sortOption || '');
  const { setCategory } = useProductCategory();
  const navigate = useNavigate();
  const categorizedProducts = products?.reduce<CategorizedProducts>(
    (acc, product) => {
      const category = product.productCategory;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {},
  );
  const handleCategoryClick = (category: string | null) => {
    if (category) {
      setCategory(category);
      navigate('/Products');
    }
    navigate('/Products');
  };

  if (isLoading) {
    const skeletonCount = 5;
    return (
      <main>
        <div className="p-20" id="main-page-layout ">
          <Label className="flex text-lg font-bold">신상품</Label>
          {[...Array(skeletonCount)].map(() => (
            <div key={uuidv4()} className="category-section">
              <Label className="mt-4 font-bold">keyboard</Label>
              <Label className="absolute right-64 mb-5 text-sm hover:text-white">
                전체보기
              </Label>
              <hr className="border-t border-gray-300 m-5" />
              <Carousel
                opts={{ loop: true }}
                plugins={[]}
                orientation="horizontal"
                setApi={() => {}}
              >
                <CarouselContent>
                  {[...Array(skeletonCount)].map(() => (
                    <CarouselItem key={uuidv4()} className="basis-1/4">
                      <Skeleton />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <main className="w-full flex items-center justify-center">
      <div className="w-full max-w-screen-2xl px-4" id="mainpage">
        <div className="flex justify-between border-b-2 border-gray-300 pb-3 mb-5">
          <Label className="text-lg font-bold mb-5">신상품</Label>
          <Button
            className="absolute right-64 text-sm cursor-pointer hover:underline hover:text-white"
            onClick={() => handleCategoryClick(null)}
            type="button"
          >
            전체보기
          </Button>
        </div>
        {categorizedProducts &&
          Object.entries(categorizedProducts).map(
            ([category, productsIndex]) => (
              <div key={category} className="category-section">
                <Label className="m-10 font-bold">{category}</Label>
                <Button
                  className="font-samll absolute right-64 text-sm cursor-pointer hover:underline hover:text-white "
                  onClick={() => handleCategoryClick(category)}
                  type="button"
                >
                  {' '}
                  전체보기
                </Button>
                <hr className="border-t border-gray-300 mt-8" />
                <Carousel
                  opts={{ loop: true }}
                  plugins={[]}
                  orientation="horizontal"
                  setApi={() => {}}
                >
                  <CarouselContent className="flex gpa-4 mb-12 ">
                    {productsIndex.map(product => (
                      <CarouselItem
                        key={product.id}
                        className="flex-shrink-0 basis-1/5 "
                      >
                        <MainProductCard product={product} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            ),
          )}
      </div>
    </main>
  );
};

export default MainPageLayOut;
