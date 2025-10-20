import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Product } from '@/lib/product';

/**
 * Firestore 문서를 Product 객체로 변환
 */
export function mapDocToProduct(doc: QueryDocumentSnapshot): Product {
  const docData = doc.data();
  return {
    id: doc.id,
    createdAt: docData.createdAt,
    productCategory: docData.productCategory,
    productDescription: docData.productDescription,
    productName: docData.productName,
    productPrice: docData.productPrice,
    productQuantity: docData.productQuantity,
    imageUrl: docData.imageUrl,
  };
}
