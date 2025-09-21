import {
  getDocs,
  collection,
  query,
  limit,
  startAfter,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { FetchProductsResult } from '@/lib/product';
import { mapDocToProduct } from './productUtill';

const PAGE_SIZE = 10;

const FetchProducts = async ({
  pageParam = null,
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

export { FetchProducts };
