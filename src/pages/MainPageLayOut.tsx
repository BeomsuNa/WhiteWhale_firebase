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

const MainPageLayOut: React.FC<MainPageLayOutProps> = React.memo(
  ({ sortOption }) => {
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
        <main className="w-full flex items-center justify-center">
          <div className="w-full max-w-screen-2xl px-4" id="mainpage">
            {/* 헤더 영역 */}
            <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
              <Label className="text-xl font-semibold text-slate-300 tracking-tight mb-5">
                신상품
              </Label>
              <Button
                disabled
                className="text-sm font-medium text-slate-400 cursor-default"
              >
                전체보기
              </Button>
            </div>

            {/* 카테고리별 섹션 (스켈레톤) */}
            {[...Array(2)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="category-section mb-12">
                {/* 카테고리 타이틀 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 flex justify-center">
                    <div className="h-6 w-32 bg-slate-700 rounded-md animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-slate-700 rounded-md animate-pulse" />
                </div>

                {/* 구분선 */}
                <hr className="border-t border-gray-700 mb-6" />

                {/* 캐러셀 스켈레톤 */}
                <Carousel
                  opts={{ loop: true }}
                  plugins={[]}
                  orientation="horizontal"
                  setApi={() => {}}
                >
                  <CarouselContent>
                    {[...Array(skeletonCount)].map(() => (
                      <CarouselItem
                        key={uuidv4()}
                        className="flex-shrink-0 basis-1/5"
                      >
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
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6 ">
            <Label className="text-xl font-semibold text-slate-100 tracking-tight mb-5">
              신상품
            </Label>
            <Button
              className="text-sm font-medium text-slate-50 hover:text-[#B1A7A7] transition-colors"
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 flex justify-center">
                      <Label className="text-xl font-semibold text-slate-50 tracking-tight">
                        {category}
                      </Label>
                    </div>
                    <Button
                      className="text-sm font-medium text-slate-50 hover:text-[#B1A7A7] transition-colors "
                      onClick={() => handleCategoryClick(category)}
                      type="button"
                    >
                      {' '}
                      전체보기
                    </Button>
                    <hr className="border-t border-gray-300 mt-8" />
                  </div>
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
  },
);

export default MainPageLayOut;
