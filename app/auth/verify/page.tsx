import VerifyMagicLink from "./VerifyMagicLink";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{
    userId?: string;
    secret?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <VerifyMagicLink
      userId={params.userId}
      secret={params.secret}
    />
  );
}