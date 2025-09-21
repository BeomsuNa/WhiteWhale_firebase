import { ProductCard } from './product';

export interface PaymentProduct {
  id: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  imageUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  data?: ProductCard[];
  error?: string;
  paymentId: string;
  code: number;
  message: string;
  postcodeData: string;
  productImg: string;
  payState: boolean;
}
