export async function POST(req: Request) {
  const mod = await import('@/lib/paymentHandlers');
  return mod.POST(req);
}
