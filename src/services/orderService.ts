// src/services/orderService.ts

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "../lib/firebase";

interface OrderDetails {
  userId: string;
  items: any[]; // Consider defining a more specific type for items
  total: number;
  currency: string;
  transactionId: string;
}

export const saveOrderToFirestore = async (orderDetails: OrderDetails) => {
  try {
    const db = await getFirebaseFirestore();
    const ordersCollectionRef = collection(db, "orders");

    await addDoc(ordersCollectionRef, {
      ...orderDetails,
      createdAt: Timestamp.now(),
    });

    console.log("Order saved to Firestore successfully!");
  } catch (error) {
    console.error("Error saving order to Firestore:", error);
  }
};
