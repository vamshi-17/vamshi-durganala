import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Site } from "@/components/site";
import { isSection, routedSections, sectionTitle } from "@/lib/sections";

type Props = { params: Promise<{ section: string }> };

// Only the known sections exist; everything else is a 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return routedSections.map((section) => ({ section }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  if (!isSection(section)) return {};
  return { title: sectionTitle(section) }; // canonical → home page, inherited from the root layout
}

export default async function SectionPage({ params }: Props) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  return <Site initial={section} />;
}
