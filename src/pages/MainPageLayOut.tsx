import MainProductCard from '@/components/ui/MainProductCard';
import { UploadProduct } from '@/lib/product';
import { useFetchProductCardData } from '@/hooks/UseFetchData';
import React, { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import MenuBarWithButton from '@/components/ui/menuBarWithButton';
import SearchBar from '@/components/ui/searchBar';
import Autoplay from 'embla-carousel-autoplay';
import {
  leftSlide1,
  leftSlide2,
  leftSlide3,
  leftSlide4,
  rightSlide1,
  rightSlide2,
  rightSlide3,
  keyboard,
  keycap,
  accsessory,
  HOT,
  best,
} from '@/assets/logo';

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
    const [openMenu, setOpenMenu] = useState(false);
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
    const plugin = React.useRef(
      Autoplay({ delay: 2000, stopOnInteraction: true }),
    );

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
          <div className="flex justify-between items-center mt-4 mb-6">
            <MenuBarWithButton openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <SearchBar />
          </div>
          <div className="flex w-full justify-between items-center gap-5">
            <Carousel
              opts={{ loop: true }}
              plugins={[
                Autoplay({
                  delay: 2000,
                }) as any,
              ]}
              orientation="horizontal"
              setApi={() => {}}
              className="w-2/3 flex min-h-[400px] border rounded-2xl items-center justify-center overflow-hidden"
            >
              <CarouselContent>
                <CarouselItem>
                  <img src={leftSlide1} alt="" />
                </CarouselItem>
                <CarouselItem>
                  <img src={leftSlide2} alt="" />
                </CarouselItem>
                <CarouselItem>
                  <img src={leftSlide3} alt="" />
                </CarouselItem>
                <CarouselItem>
                  <img src={leftSlide4} alt="" />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
            <Carousel
              opts={{ loop: true }}
              plugins={[
                Autoplay({
                  delay: 6000,
                }) as any,
              ]}
              orientation="horizontal"
              setApi={() => {}}
              className="w-1/3 flex items-center justify-center min-h-[400px] border rounded-2xl overflow-hidden"
            >
              <CarouselContent>
                <CarouselItem>
                  <img src={rightSlide1} alt="" />
                </CarouselItem>
                <CarouselItem>
                  <img src={rightSlide2} alt="" />
                </CarouselItem>
                <CarouselItem>
                  <img src={rightSlide3} alt="" />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
          <div className="flex flex-col">
            <div
              className="w-full  flex flex-wrap items-stretch justify-around p-4 mt-4 gap-4"
              id="selectsection"
            >
              {/* ✅ Hot 세일 카드 (grid 기반 말풍선 포함) */}
              <div className="group flex flex-col gap-3 items-center transition-all duration-300 hover:font-bold">
                <div
                  className="relative w-60 h-60 border rounded-3xl overflow-hidden
      shadow-md transition-all duration-500
      hover:shadow-xl hover:brightness-75
      flex items-center justify-center"
                >
                  {/* 이미지 */}
                  <img
                    src={HOT}
                    alt="HOT 세일"
                    className="w-full h-full object-cover cursor-pointer"
                  />

                  {/* ✅ 말풍선 */}
                  <p
                    className="
            absolute top-10 left-1/2 bottom-[calc(100% + 15px)] -translate-x-1/2
        text-xs bg-black/80 text-white px-3 py-1
        rounded-full shadow-md
        transition-all duration-300
          "
                  >
                    올 여름 핫세일 구경가기!
                  </p>
                </div>

                <h2 className="text-lg transition-all duration-300 group-hover:font-bold">
                  HOT세일
                </h2>
              </div>

              {/* 🔹 다른 카드들 (기존 그대로 유지) */}
              {[keyboard, keycap, accsessory, best].map((img, i) => {
                const titles = ['키보드', '키캡', '악세서리', '베스트'];
                const title = titles[i];
                return (
                  <div
                    key={`section-${title}`}
                    className="group flex flex-col gap-3 items-center transition-all duration-300 hover:font-bold"
                  >
                    <div
                      className="
              w-60 h-60 border rounded-3xl overflow-hidden
              shadow-md transition-all duration-500
              hover:shadow-xl hover:brightness-75
            "
                    >
                      <img
                        src={img}
                        alt={titles[i]}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                    <h2 className="text-lg transition-all duration-300 group-hover:font-bold">
                      {titles[i]}
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>

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
          <section className="grid grid-cols-3 grid-rows-3 gap-4 p-8 max-w-6xl mx-auto">
            <div className="col-span-2 row-span-2 bg-gray-100 rounded-2xl p-6 flex flex-col justify-between">
              <h2 className="text-2xl font-bold text-red-600">
                WhiteWhale의 A to Z
              </h2>
              <p className="text-gray-600">
                WhiteWhale은 CJ배송을 통해 운송됩니다!
              </p>
              <img src="/pig.png" alt="" className="w-40 " />
            </div>
            <div className="bg-red-500 col-span-1 text-white rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">공지사항</h3>
                <p>업데이트 소식, 여기서 확인!</p>
              </div>
              <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center">
                →
              </span>
            </div>
            <div className="bg-yellow-400 text-black rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">FAQ</h3>
                <p>주요 FAQ는 이쪽으로</p>
              </div>
              <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                →
              </span>
            </div>
            <div className="col-span-3  bg-blue-100 rounded-2xl p-6 mt-2 flex items-center justify-center">
              <h3 className="text-xl  font-bold text-blue-800 ">
                개성있는 커스텀 키보드는? WHITEWHALE
              </h3>
            </div>
          </section>
        </div>
      </main>
    );
  },
);

export default MainPageLayOut;
