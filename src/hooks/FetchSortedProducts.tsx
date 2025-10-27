import {
  collection,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UploadProduct } from '@/lib/product';
import { useQuery } from '@tanstack/react-query';

const fetchSortedProducts = async (
  sortField: string,
): Promise<UploadProduct[]> => {
  const productsCollection = collection(db, 'Product');
  const productsQuery = query(productsCollection, orderBy(sortField));
  const querySnapshot = await getDocs(productsQuery);
  const products: UploadProduct[] = querySnapshot.docs.map(
    (doc: QueryDocumentSnapshot) => {
      const docData = doc.data();
      return {
        id: doc.id,
        createdAt: docData.createdAt,
        productName: docData.productName,
        productPrice: docData.productPrice,
        imageUrl: docData.imageUrl,
        productCategory: docData.productCategory,
        productQuantity: docData.productQuantity,
      };
    },
  );
  return products;
};

export const useFetchSortedProducts = (sortField: string) => {
  return useQuery({
    queryKey: ['sortedProducts', sortField],
    queryFn: () => fetchSortedProducts(sortField),
  });
};
