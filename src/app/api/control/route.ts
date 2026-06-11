export async function GET() {
  return Response.json({ status: 'ok' });
}

export async function POST(request: Request) {
  return Response.json({ status: 'received' });
}
