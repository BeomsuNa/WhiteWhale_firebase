import React, { useEffect, useRef, useState } from 'react';
import MainProductCard from '@/components/ui/MainProductCard';
import { useInView } from 'react-intersection-observer';
import { useProductCategory } from '@/components/context/ProductCategoryContext';
import { ProductCard } from '@/lib/product';
import { useFetchSortedProducts } from '@/hooks/FetchSortedProducts';
import { v4 as uuidv4 } from 'uuid';
import Skele from '@/components/ui/Skele';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UseProducts } from '@/hooks/UseFetchInfinityProducts';
import { useCategoryStore } from '@/stores/categoryStore';

const AllProductPage: React.FC = () => {
  const { category, setCategory } = useCategoryStore();
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = UseProducts();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  const [sortOption, setSortOption] = useState('productPrice');
  const [sortedProducts, setSortedProducts] = useState<ProductCard[]>([]);

  const handleSortByPrice = () => {
    setSortOption('productPrice');
  };

  const hanldeAllProduct = () => {
    setCategory('noob');
  };
  const hanldeKeyboard = () => {
    setCategory('keyboard');
  };
  const hanldeKey = () => {
    setCategory('key');
  };
  const hanldeaccessory = () => {
    setCategory('accessory');
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <main>
      <div className="p-20">
        <div>
          {category === null ? (
            <h3 className="text-3xl mb-12"> 전체물품 확인하기</h3>
          ) : (
            <h3 className="text-3xl"> {category}</h3>
          )}
          <div className="flex justify-between">
            <div className="flex">
              <button
                onClick={hanldeAllProduct}
                type="button"
                className="lg:hover:underline"
              >
                <h6>전체</h6>
              </button>
              <h6> &nbsp;/&nbsp; </h6>
              <button
                onClick={handleSortByPrice}
                type="button"
                className="lg:hover:underline"
              >
                가격순
              </button>
              <h6> &nbsp;/&nbsp; </h6>
              <button
                onClick={() => setSortOption('updatedAt')}
                className="lg:hover:underline"
                type="button"
              >
                날짜순
              </button>
            </div>
            <div className="flex">
              <div className="flex">
                <button
                  onClick={hanldeKeyboard}
                  type="button"
                  className="lg:hover:underline"
                >
                  <h6>keyboard</h6>
                </button>
                <h6> &nbsp;/&nbsp; </h6>
                <button
                  onClick={hanldeKey}
                  type="button"
                  className="lg:hover:underline"
                >
                  key
                </button>
                <h6> &nbsp;/&nbsp; </h6>
                <button
                  onClick={hanldeaccessory}
                  className="lg:hover:underline"
                  type="button"
                >
                  accessory
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {data?.pages.flatMap((page, pageIndex) =>
            page.products
              .filter(
                product =>
                  !category ||
                  category === 'all' ||
                  product.productCategory === category,
              )
              .map(product => (
                <MainProductCard key={product.id} product={product} />
              )),
          )}
        </div>

        {/* 무한 스크롤 트리거 */}
        <div ref={ref} className="h-20 flex items-center justify-center">
          {isFetchingNextPage && (
            <h1 className="text-center">현재 로딩중입니다...</h1>
          )}
        </div>
      </div>
    </main>
  );
};

export default AllProductPage;
