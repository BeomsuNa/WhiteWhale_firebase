import React, { useEffect, useRef, useState } from 'react';
import { useFetchInfiniteProducts } from '@/hooks/UseFetchData';
import MainProductCard from '@/components/ui/MainProductCard';
import { useInView } from 'react-intersection-observer';
import { useProductCategory } from '@/components/context/ProductCategoryContext';
import { ProductCard } from '@/lib/product';
import { useFetchSortedProducts } from '@/hooks/FetchSortedProducts';
import { v4 as uuidv4 } from 'uuid';
import Skele from '@/components/ui/Skele';
import { useFetchAllProducts } from '@/hooks/useFetchAllProducts';

const AllProductPage: React.FC = () => {
  const { category, setCategory } = useProductCategory();
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  //   useFetchInfiniteProducts();
  const { data, isLoading, error } = useFetchAllProducts();
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  const [sortOption, setSortOption] = useState('productPrice');
  const [sortedProducts, setSortedProducts] = useState<ProductCard[]>([]);

  const lastFetchedPage = useRef<number>(0);
  // useEffect(() => {
  //   if (inView && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //     const nextPage = data?.pages?.length ?? 0;
  //     if (lastFetchedPage.current < nextPage) {
  //       fetchNextPage();
  //       lastFetchedPage.current = nextPage;
  //     }
  //   }
  // }, [inView, hasNextPage, isFetchingNextPage]);

  // useEffect(() => {
  //   if (data) {
  //     const allProducts = data.pages.flatMap(page => page.products);
  //     const filteredProducts = category
  //       ? allProducts.filter(product => product.productCategory === category)
  //       : allProducts;
  //     const sortedArray = [...filteredProducts];
  //     if (sortOption === 'updatedAt') {
  //       sortedArray.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  //     } else if (sortOption === 'productPrice') {
  //       sortedArray.sort((a, b) => b.productPrice - a.productPrice);
  //     }

  //     setSortedProducts(sortedArray);
  //   }
  // }, [sortOption, data, category]);

  // useEffect(() => {
  //   if (data) {
  //     performance.mark('first-product-rendered');

  //     performance.measure(
  //       'TTFP', // Time To First Product
  //       'navigationStart',
  //       'first-product-rendered',
  //     );

  //     const ttfp = performance.getEntriesByName('TTFP')[0].duration;

  //     console.log('TTFP (첫 상품 렌더링까지 걸린 시간):', ttfp, 'ms');
  //   }
  // }, [data]);

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

  return (
    <main>
      <div className="p-20">
        <div>
          {category === null ? (
            <h3 className="text-3xl mb-12"> 전체물품입니다</h3>
          ) : (
            <h3 className="text-3xl"> {category}의 물품입니다</h3>
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
        {/* <div className="grid grid-cols-3 gap-4">
          {sortedProducts.map(product => (
            <MainProductCard key={product.id} product={product} />
          ))}
          <div ref={ref} className="h-20 background-transparent">
            {isFetchingNextPage && (
              <div className="w-full h-full min-h-0.5">
                <h1 className="w-full h-full">현재 로딩중입니다.</h1>
              </div>
            )}
          </div>
        </div> */}
        <div className="flex flex-wrap justify-start">
          {data?.map(product => (
            <MainProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default AllProductPage;
