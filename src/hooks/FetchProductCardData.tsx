import {
  getDocs,
  collection,
  QueryDocumentSnapshot,
  orderBy,
  query,
  FirestoreDataConverter,
  SnapshotOptions,
  DocumentData,
  where,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ProductCard, UploadProduct } from '@/lib/product';

const productCardConverter: FirestoreDataConverter<UploadProduct> = {
  toFirestore(product: ProductCard): DocumentData {
    return { ...product };
  },
  fromFirestore(snapshot, options): UploadProduct {
    const data = snapshot.data(options)!;
    return {
      id: snapshot.id,
      updatedAt: data.updatedAt,
      productName: data.productName,
      productPrice: data.productPrice,
      imageUrl: data.imageUrl,
      productCategory: data.productCategory,
      productQuantity: data.productQuantity,
    };
  },
};

export const fetchProductCardData = async (
  sortOption: string,
  category: string,
): Promise<UploadProduct[]> => {
  let IndexOption;
  const productRef = collection(db, 'Product');
  // 🧩 동적 쿼리 구성
  if (category && category !== 'all') {
    if (sortOption === 'price') {
      IndexOption = query(
        productRef,
        where('productCategory', '==', category),
        orderBy('productPrice', 'desc'),
      );
    } else if (sortOption === 'date') {
      IndexOption = query(
        productRef,
        where('productCategory', '==', category),
        orderBy('updatedAt', 'desc'),
      );
    } else {
      IndexOption = query(productRef, where('productCategory', '==', category));
    }
  }

  // 카테고리 전체 보기
  if (sortOption === 'price') {
    IndexOption = query(productRef, orderBy('productPrice', 'desc'));
  } else if (sortOption === 'date') {
    IndexOption = query(productRef, orderBy('updatedAt', 'desc'));
  } else {
    IndexOption = productRef;
  }

  const querySnapshot = await getDocs(IndexOption!);
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
