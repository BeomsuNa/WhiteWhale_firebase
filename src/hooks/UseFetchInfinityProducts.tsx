import {
  getDocs,
  collection,
  query,
  limit,
  startAfter,
  orderBy,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { FetchProductsResult, Product } from '@/lib/product';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

type PageCursor = QueryDocumentSnapshot | null;

const PAGE_SIZE = 10;

function mapDocToProduct(doc: QueryDocumentSnapshot): Product {
  const docData = doc.data();
  return {
    id: doc.id,
    createdAt: docData.createdAt,
    productCategory: docData.productCategory,
    productDescription: docData.productDescription,
    productName: docData.productName,
    productPrice: docData.productPrice,
    productQuantity: docData.productQuantity,
    sellerId: docData.sellerId,
    updatedAt: docData.updatedAt,
    imageUrl: docData.imageUrl,
  };
}

const FetchProducts = async ({
  pageParam,
}: {
  pageParam: PageCursor;
}): Promise<FetchProductsResult> => {
  const productsQuery = query(
    collection(db, 'Product'),
    orderBy('createdAt'),
    ...(pageParam ? [startAfter(pageParam)] : []),
    limit(PAGE_SIZE),
  );
  const querySnapshot = await getDocs(productsQuery);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  const productPromises = querySnapshot.docs.map(mapDocToProduct);
  const products = await Promise.all(productPromises);

  return {
    products,
    nextPage: lastVisible || null,
  };
};
export default FetchProducts;

export const useProducts = () => {
  return useInfiniteQuery<
    FetchProductsResult,
    Error,
    InfiniteData<FetchProductsResult>,
    ['products'],
    PageCursor
  >({
    queryKey: ['products'],
    queryFn: ({ pageParam }) => FetchProducts({ pageParam }),
    initialPageParam: null,
    getNextPageParam: lastPage => lastPage.nextPage ?? null,

    // ✅ staleTime 적용
    staleTime: 1000 * 60 * 3, // 3분 동안 캐시된 데이터는 신선(fresh)으로 간주
    gcTime: 1000 * 60 * 10, // 10분 후 캐시 제거 (옵션)
  });
};
