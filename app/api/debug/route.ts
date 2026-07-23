export async function GET() {
  return Response.json({
    clientIdLoaded: !!process.env.GOOGLE_CLIENT_ID,
    secretLoaded: !!process.env.GOOGLE_CLIENT_SECRET,
    clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.slice(0, 20),
    secretPrefix: process.env.GOOGLE_CLIENT_SECRET?.slice(0, 8),
  });
}