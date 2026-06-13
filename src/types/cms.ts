/** CMS contract — mirrors the main site API payload (keep in sync when adding fields). */

export interface Film {
  id: string;
  title: string;
  genre: string;
  year: number;
  image: string;
  description?: string;
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface Studio {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  step: number;
}

export interface BTSItem {
  id: string;
  title: string;
  image: string;
  duration: string;
  video: string;
}

export interface MegaMenuItem {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  items: MegaMenuItem[];
}

export interface MegaMenuConfig {
  label: string;
  href: string;
  columns: MegaMenuColumn[];
}

export interface SectionMeta {
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  linkText?: string;
  linkHref?: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  socialLinks: { href: string; label: string }[];
}

export interface HeroSection {
  enabled: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  video: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  scrollLabel: string;
}

export interface FeaturedFilmsSection extends SectionMeta {
  limit: number;
  filmIds: string[];
}

export interface TrendingSection extends SectionMeta {
  featuredFilmId: string;
  sideFilmIds: string[];
}

export interface NewsSectionConfig extends SectionMeta {
  homeLimit: number;
  recognition: {
    label: string;
    title: string;
    description: string;
  };
}

export interface CareersSectionConfig extends SectionMeta {
  spotlightTitle: string;
  spotlightDescription: string;
  spotlightCtaLabel: string;
  spotlightCtaHref: string;
  backgroundImage: string;
}

export interface TeamSectionConfig extends SectionMeta {
  limit: number;
  memberIds: string[];
  buttonLabel: string;
}

export interface AboutPage {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  storyLabel: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
}

export interface TeamPage {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionSubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  featured?: boolean;
  socialLinks?: { label: string; href: string }[];
}

export interface NavigationSettings {
  links: { href: string; label: string }[];
  megaMenus: MegaMenuConfig[];
}

export interface PageHeroesConfig {
  films: string;
  trending: string;
  news: string;
  studios: string;
  contact: string;
  careers: string;
}

export interface CmsData {
  version: number;
  updatedAt: string;
  site: SiteSettings;
  navigation: NavigationSettings;
  pageHeroes: PageHeroesConfig;
  hero: HeroSection;
  sections: {
    featuredFilms: FeaturedFilmsSection;
    trending: TrendingSection;
    creativeStudios: SectionMeta;
    process: SectionMeta;
    behindTheScenes: SectionMeta;
    news: NewsSectionConfig;
    careers: CareersSectionConfig;
    team: TeamSectionConfig;
    newsletter: SectionMeta & {
      successMessage: string;
      placeholder: string;
      buttonLabel: string;
    };
  };
  films: Film[];
  newsItems: NewsItem[];
  studios: Studio[];
  careers: Career[];
  processSteps: ProcessStep[];
  btsItems: BTSItem[];
  about: AboutPage;
  team: TeamPage;
  teamMembers: TeamMember[];
}
