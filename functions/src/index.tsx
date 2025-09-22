// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();
const db = admin.firestore();

export const paymentComplete = functions.https.onRequest(async (req, res) => {
  try {
    const {paymentId, pgToken, product} = req.body;

    // ✅ 1. 승인 요청 (PortOne API)
    const portoneRes = await fetch(
      `https://api.portone.io/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          "Authorization": `PortOne ${functions.config().portone.secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({pgToken}),
      },
    );
    const data = await portoneRes.json();

    // ✅ 2. 금액 검증
    const expectedAmount = product.productPrice * product.productQuantity;
    const approvedAmount = data.amount?.total;

    if (expectedAmount !== approvedAmount) {
      res.status(400).json({
        success: false,
        error: "금액 불일치: 승인 거부",
        expectedAmount,
        approvedAmount,
      });
    }

    // ✅ 3. Firestore 기록
    await db.collection("purchases").add({
      paymentId,
      productId: product.id,
      productName: product.productName,
      totalAmount: approvedAmount,
      payMethod: data.method,
      payState: data.status, // 보통 "PAID"
      createdAt: new Date(),
      imageUrl: product.imageUrl,
    });

    res.json({success: true, data});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, error: "서버 오류"});
  }
});
