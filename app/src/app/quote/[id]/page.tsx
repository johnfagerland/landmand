import QuoteWorkspace from "./QuoteWorkspace";

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuoteWorkspace id={id} />;
}
