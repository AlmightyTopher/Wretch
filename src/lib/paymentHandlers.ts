import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: body.lineItems,
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("[CREATE_CHECKOUT_SESSION_ERROR]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
