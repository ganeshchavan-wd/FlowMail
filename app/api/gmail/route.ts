import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Fix issue #4: getServerSession requires authOptions in Next.js App Router,
// otherwise it always returns null.
export async function GET() {
  const session = await getServerSession(authOptions);

  return Response.json({
    authenticated: !!session,
    user: session?.user,
  });
}
