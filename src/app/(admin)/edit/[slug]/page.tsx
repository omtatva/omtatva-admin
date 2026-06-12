import SectionEditor from "@/components/SectionEditor";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <SectionEditor slug={slug} />;
}
