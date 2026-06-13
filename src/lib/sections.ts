export interface AdminSection {
  slug: string;
  title: string;
  description: string;
  group: "Homepage" | "Content" | "Site";
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    slug: "site",
    title: "Site Settings",
    description: "Name, tagline, description, social links",
    group: "Site",
  },
  {
    slug: "navigation",
    title: "Navigation",
    description: "Menu links and mega menus",
    group: "Site",
  },
  {
    slug: "page-heroes",
    title: "Page Hero Images",
    description: "Hero banner images for Films, Trending, News, Studios, Contact, Careers",
    group: "Site",
  },
  {
    slug: "hero",
    title: "Hero Banner",
    description: "Homepage hero — headline, image, CTAs",
    group: "Homepage",
  },
  {
    slug: "featured-films",
    title: "Featured Films",
    description: "Portfolio section on homepage",
    group: "Homepage",
  },
  {
    slug: "trending",
    title: "Trending",
    description: "Trending films layout on homepage",
    group: "Homepage",
  },
  {
    slug: "creative-studios",
    title: "Creative Studios",
    description: "Studios capabilities section",
    group: "Homepage",
  },
  {
    slug: "process",
    title: "Process Timeline",
    description: "Pipeline section headings",
    group: "Homepage",
  },
  {
    slug: "behind-the-scenes",
    title: "Behind The Scenes",
    description: "BTS section headings",
    group: "Homepage",
  },
  {
    slug: "news-section",
    title: "News Section",
    description: "Homepage news block + recognition",
    group: "Homepage",
  },
  {
    slug: "careers-section",
    title: "Careers Section",
    description: "Homepage careers spotlight",
    group: "Homepage",
  },
  {
    slug: "team-section",
    title: "Team Section",
    description: "Homepage team spotlight",
    group: "Homepage",
  },
  {
    slug: "newsletter",
    title: "Newsletter",
    description: "Subscribe section copy",
    group: "Homepage",
  },
  {
    slug: "about",
    title: "About Page",
    description: "About page hero and story",
    group: "Site",
  },
  {
    slug: "team",
    title: "Team Page",
    description: "Team page hero, section copy, and CTA",
    group: "Site",
  },
  {
    slug: "films",
    title: "Films Library",
    description: "All films — used across site",
    group: "Content",
  },
  {
    slug: "news-items",
    title: "News Library",
    description: "All news articles",
    group: "Content",
  },
  {
    slug: "studios",
    title: "Studios Library",
    description: "Studio cards content",
    group: "Content",
  },
  {
    slug: "careers-list",
    title: "Careers Library",
    description: "Job listings",
    group: "Content",
  },
  {
    slug: "process-steps",
    title: "Process Steps",
    description: "Timeline steps",
    group: "Content",
  },
  {
    slug: "bts",
    title: "BTS Videos",
    description: "Behind the scenes items",
    group: "Content",
  },
  {
    slug: "team-members",
    title: "Team Members",
    description: "Leadership and staff profiles",
    group: "Content",
  },
];

export function getSection(slug: string) {
  return ADMIN_SECTIONS.find((s) => s.slug === slug);
}
