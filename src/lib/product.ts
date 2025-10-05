import { type ClassValue, clsx } from 'clsx';
import { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface User {
  nickname: string;
  isSeller: boolean;
}

export interface UploadProduct {
  id: string;
  productCategory: string;
  productName: string;
  productPrice: number;
  imageUrl: string;
  productQuantity?: number;
  updatedAt?: Timestamp;
}

export interface Product extends UploadProduct {
  createdAt: Timestamp;
  productDescription: string;
  sellerId: number;
}

export interface FetchProductsResult {
  products: Product[];
  nextPage: QueryDocumentSnapshot | null;
}

export interface postInfo {
  postcodeData: string;
}

export interface ProductCard extends UploadProduct {
  email: string; // 파생 정보
}

export interface CartProduct extends Omit<UploadProduct, 'quantity'> {
  quantity: number;
}

// 특정 키를 Optional(선택적)로 바꾸는 유틸리티
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 특정 키를 Required(필수)로 바꾸는 유틸리티
type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
