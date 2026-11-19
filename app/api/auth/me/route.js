import { getSession } from "@/lib/session";

export async function GET() {
  const user = await getSession();
  return Response.json({ user }, { headers: { "Cache-Control": "no-store" } });
}
