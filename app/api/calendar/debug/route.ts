import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session: any = await getServerSession(authOptions);

  return Response.json({
    authenticated: !!session,
    accessTokenExists: !!session?.accessToken,
    email: session?.user?.email,
  });
}