import { NextResponse } from "next/server";
import { pay, type OrderData } from "@/lib/paymentService";

// Simple wrapper around the dummy payment service.
// Accepts order details in the request body and returns a fake
// successful payment response.
export async function POST(req: Request) {
  try {
    const orderData = (await req.json()) as OrderData;
    const result = await pay(orderData);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[payment_intents]", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
