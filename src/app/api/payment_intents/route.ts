export async function POST(req: Request) {
  const mod = await import('@/lib/payment_intentsHandlers');
  return mod.POST(req as any);
}