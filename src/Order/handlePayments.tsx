import { requestPayment, type PaymentRequest } from '@portone/browser-sdk/v2';
import type { PaymentProduct } from '../lib/payments';

// 에러 응답 타입
type PortOneError = { code: string; message: string };

// 간편결제 AUTHENTICATED 응답 타입
type AuthenticatedResp = {
  paymentId: string;
  status: 'AUTHENTICATED';
  approvalRedirectParams: { pgToken: string; paymentMethodType?: string };
};

// 성공 결제(PAID) 응답 타입 (간단 예시)
type PaidResp = {
  paymentId: string;
  status: 'PAID';
  amount: { total: number };
};

// 타입가드 함수들
function isError(r: unknown): r is PortOneError {
  return !!r && typeof (r as any).code !== 'undefined';
}
function isAuthenticated(r: unknown): r is AuthenticatedResp {
  const a = r as any;
  return (
    a?.status === 'AUTHENTICATED' &&
    typeof a?.approvalRedirectParams?.pgToken === 'string'
  );
}
function isPaid(r: unknown): r is PaidResp {
  return (r as any)?.status === 'PAID';
}

export async function handlePayment(cart: PaymentProduct) {
  const paymentRequest: PaymentRequest = {
    storeId: import.meta.env.VITE_STORE_ID!,
    channelKey: import.meta.env.VITE_CHANNEL_KEY!,
    paymentId: `payment-${crypto.randomUUID()}`,
    orderName: cart.productName,
    totalAmount: cart.productPrice * cart.productQuantity,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD', // 혹은 'EASY_PAY',
  };

  const response = await requestPayment(paymentRequest);

  if (!response) {
    throw new Error('응답 없음');
  }

  // 에러 처리
  if (isError(response)) {
    alert(response.message);
    return;
  }

  // AUTHENTICATED → Cloud Functions 승인 단계
  if (isAuthenticated(response)) {
    await fetch(
      `https://us-central1/YOUR_PROJECT.cloudfunctions.net/paymentComplete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: response.paymentId,
          pgToken: response.approvalRedirectParams.pgToken,
          product: cart,
        }),
      },
    );
  }

  // PAID → 즉시 결제 완료
  if (isPaid(response)) {
    alert('결제가 즉시 완료되었습니다.');
  }
}
