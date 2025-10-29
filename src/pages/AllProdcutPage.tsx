import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MainProductCard from '@/components/ui/MainProductCard';
import { useInView } from 'react-intersection-observer';
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

  // const filteredProducts = useMemo(() => {
  //   if (!data?.pages) return [];
  //   const allProducts = data.pages.flatMap(page => page.products);

  //   // category 필터링
  //   const categoryFiltered =
  //     !category || category === 'all'
  //       ? allProducts
  //       : allProducts.filter(p => p.productCategory === category);

  //   // 정렬
  //   const sorted = [...categoryFiltered].sort((a, b) => {
  //     if (sortOption === 'productPrice') return b.productPrice - a.productPrice;
  //     if (sortOption === 'updatedAt')
  //       return b.createdAt.seconds - a.createdAt.seconds;
  //     return 0;
  //   });

  //   return sorted;
  // }, [data, category, sortOption]);

  // const handleCategoryChange = useCallback(
  //   (newCategory: string) => setCategory(newCategory),
  //   [setCategory],
  // );

  const filteredProducts = () => {
    if (!data?.pages) return [];
    const allProducts = data.pages.flatMap(page => page.products);

    // category 필터링
    const categoryFiltered =
      !category || category === 'all'
        ? allProducts
        : allProducts.filter(p => p.productCategory === category);

    // 정렬
    const sorted = [...categoryFiltered].sort((a, b) => {
      if (sortOption === 'productPrice') return b.productPrice - a.productPrice;
      if (sortOption === 'updatedAt')
        return b.createdAt.seconds - a.createdAt.seconds;
      return 0;
    });

    return sorted;
  };

  const handleCategoryChange = (newcategory: string) =>
    setCategory(newcategory);

  // 2️⃣ 정렬 옵션 변경용 콜백
  const handleSortChange = useCallback(
    (option: string) => setSortOption(option),
    [setSortOption],
  );

  const renderTitle = () => {
    if (category === null) return '전체 물품 확인하기';
    if (category === 'key') return 'KeyCap';
    if (category === 'keyboard') return 'Keyboard';
    if (category === 'accessory') return 'Accessory';
    return category;
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <main>
      <div className="p-20">
        <div>
          <h3 className="text-3xl"> {renderTitle()}</h3>

          <div className="flex justify-between">
            <div className="flex">
              <button
                onClick={() => handleSortChange('productPrice')}
                type="button"
                className="lg:hover:underline"
              >
                가격순
              </button>
              <h6> &nbsp;/&nbsp; </h6>
              <button
                onClick={() => handleSortChange('updatedAt')}
                className="lg:hover:underline"
                type="button"
              >
                날짜순
              </button>
            </div>
            <div className="flex">
              <div className="flex">
                <button
                  onClick={() => handleCategoryChange('keyboard')}
                  type="button"
                  className="lg:hover:underline"
                >
                  <h6>keyboard</h6>
                </button>
                <h6> &nbsp;/&nbsp; </h6>
                <button
                  onClick={() => handleCategoryChange('key')}
                  type="button"
                  className="lg:hover:underline"
                >
                  KeyCap
                </button>
                <h6> &nbsp;/&nbsp; </h6>
                <button
                  onClick={() => handleCategoryChange('accessory')}
                  className="lg:hover:underline"
                  type="button"
                >
                  Accessory
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {filteredProducts.map((product, idx) => (
            <MainProductCard key={`${product.id}`} product={product} />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-4">
          {filteredProducts().map(product => (
            <MainProductCard key={product.id} product={product} />
          ))}
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
