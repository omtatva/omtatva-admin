"use client";

import type { CmsData, PageHeroesConfig } from "@/types/cms";
import { useCms } from "@/components/CmsProvider";
import {
  Field,
  Input,
  Textarea,
  Checkbox,
  SectionMetaFields,
  ImageUrlField,
} from "@/components/ui";
import {
  CollectionTable,
  EditPanel,
  TableThumb,
  TruncateCell,
  type TableColumn,
} from "@/components/CollectionTable";
import { cn } from "@/lib/utils";
import { newId } from "@/lib/utils";
import { getSection } from "@/lib/sections";

export default function SectionEditor({ slug }: { slug: string }) {
  const { cms, setCms, loading } = useCms();
  const meta = getSection(slug);

  if (loading || !cms) {
    return <p className="text-zinc-500">Loading content…</p>;
  }

  if (!meta) {
    return <p className="text-red-400">Unknown section</p>;
  }

  const patch = (fn: (draft: CmsData) => CmsData) => setCms(fn(structuredClone(cms)));

  const isContentLibrary = [
    "films",
    "news-items",
    "studios",
    "careers-list",
    "process-steps",
    "bts",
    "team-members",
  ].includes(slug);

  return (
    <div className={cn(isContentLibrary ? "max-w-6xl" : "max-w-3xl")}>
      <h2 className="text-2xl font-bold text-white">{meta.title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{meta.description}</p>
      <div className="mt-8 space-y-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        {slug === "site" && <SiteEditor cms={cms} patch={patch} />}
        {slug === "navigation" && <NavigationEditor cms={cms} patch={patch} />}
        {slug === "page-heroes" && <PageHeroesEditor cms={cms} patch={patch} />}
        {slug === "hero" && <HeroEditor cms={cms} patch={patch} />}
        {slug === "featured-films" && <FeaturedFilmsEditor cms={cms} patch={patch} />}
        {slug === "trending" && <TrendingEditor cms={cms} patch={patch} />}
        {slug === "creative-studios" && (
          <SectionMetaFields
            value={cms.sections.creativeStudios}
            onChange={(v) =>
              patch((d) => ({ ...d, sections: { ...d.sections, creativeStudios: v } }))
            }
          />
        )}
        {slug === "process" && (
          <SectionMetaFields
            value={cms.sections.process}
            onChange={(v) =>
              patch((d) => ({ ...d, sections: { ...d.sections, process: v } }))
            }
            showLink={false}
          />
        )}
        {slug === "behind-the-scenes" && (
          <SectionMetaFields
            value={cms.sections.behindTheScenes}
            onChange={(v) =>
              patch((d) => ({ ...d, sections: { ...d.sections, behindTheScenes: v } }))
            }
          />
        )}
        {slug === "news-section" && <NewsSectionEditor cms={cms} patch={patch} />}
        {slug === "careers-section" && <CareersSectionEditor cms={cms} patch={patch} />}
        {slug === "team-section" && <TeamSectionEditor cms={cms} patch={patch} />}
        {slug === "newsletter" && <NewsletterEditor cms={cms} patch={patch} />}
        {slug === "about" && <AboutEditor cms={cms} patch={patch} />}
        {slug === "team" && <TeamEditor cms={cms} patch={patch} />}
        {slug === "films" && <FilmsEditor cms={cms} patch={patch} />}
        {slug === "news-items" && <NewsEditor cms={cms} patch={patch} />}
        {slug === "studios" && <StudiosEditor cms={cms} patch={patch} />}
        {slug === "careers-list" && <CareersListEditor cms={cms} patch={patch} />}
        {slug === "process-steps" && <ProcessEditor cms={cms} patch={patch} />}
        {slug === "bts" && <BtsEditor cms={cms} patch={patch} />}
        {slug === "team-members" && <TeamMembersEditor cms={cms} patch={patch} />}
      </div>
    </div>
  );
}

type PatchFn = (fn: (draft: CmsData) => CmsData) => void;

function SiteEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const s = cms.site;
  const set = (site: CmsData["site"]) => patch((d) => ({ ...d, site }));
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Site name">
        <Input value={s.name} onChange={(e) => set({ ...s, name: e.target.value })} />
      </Field>
      <Field label="Tagline">
        <Input value={s.tagline} onChange={(e) => set({ ...s, tagline: e.target.value })} />
      </Field>
      <Field label="Description" className="sm:col-span-2">
        <Textarea rows={3} value={s.description} onChange={(e) => set({ ...s, description: e.target.value })} />
      </Field>
      <div className="sm:col-span-2 space-y-3">
        <p className="text-xs font-semibold uppercase text-zinc-400">Social links</p>
        {s.socialLinks.map((link, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Label"
              value={link.label}
              onChange={(e) => {
                const socialLinks = [...s.socialLinks];
                socialLinks[i] = { ...link, label: e.target.value };
                set({ ...s, socialLinks });
              }}
            />
            <Input
              placeholder="URL"
              value={link.href}
              onChange={(e) => {
                const socialLinks = [...s.socialLinks];
                socialLinks[i] = { ...link, href: e.target.value };
                set({ ...s, socialLinks });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function NavigationEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const nav = cms.navigation;
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Edit nav links as JSON (mega menus are complex — edit in raw CMS file if needed).
      </p>
      <Field label="Nav links JSON">
        <Textarea
          rows={12}
          className="font-mono text-xs"
          value={JSON.stringify(nav.links, null, 2)}
          onChange={(e) => {
            try {
              const links = JSON.parse(e.target.value);
              patch((d) => ({ ...d, navigation: { ...nav, links } }));
            } catch {
              /* ignore invalid json while typing */
            }
          }}
        />
      </Field>
    </div>
  );
}

const PAGE_HERO_FIELDS: { key: keyof PageHeroesConfig; label: string }[] = [
  { key: "films", label: "Films page" },
  { key: "trending", label: "Trending page" },
  { key: "news", label: "News page" },
  { key: "studios", label: "Studios page" },
  { key: "contact", label: "Contact page" },
  { key: "careers", label: "Careers page" },
];

const EMPTY_PAGE_HEROES: PageHeroesConfig = {
  films: "",
  trending: "",
  news: "",
  studios: "",
  contact: "",
  careers: "",
};

function PageHeroesEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const heroes = { ...EMPTY_PAGE_HEROES, ...cms.pageHeroes };
  const set = (key: keyof PageHeroesConfig, value: string) =>
    patch((d) => ({
      ...d,
      pageHeroes: { ...EMPTY_PAGE_HEROES, ...d.pageHeroes, [key]: value },
    }));
  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Set the hero banner image shown at the top of each page.
      </p>
      {PAGE_HERO_FIELDS.map(({ key, label }) => (
        <ImageUrlField
          key={key}
          label={label}
          value={heroes[key]}
          onChange={(value) => set(key, value)}
        />
      ))}
    </div>
  );
}

function HeroEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const h = cms.hero;
  const set = (hero: CmsData["hero"]) => patch((d) => ({ ...d, hero }));
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Checkbox label="Show hero" checked={h.enabled} onChange={(enabled) => set({ ...h, enabled })} />
      </div>
      <Field label="Eyebrow">
        <Input value={h.eyebrow} onChange={(e) => set({ ...h, eyebrow: e.target.value })} />
      </Field>
      <Field label="Scroll label">
        <Input value={h.scrollLabel} onChange={(e) => set({ ...h, scrollLabel: e.target.value })} />
      </Field>
      <Field label="Headline" className="sm:col-span-2">
        <Input value={h.title} onChange={(e) => set({ ...h, title: e.target.value })} />
      </Field>
      <Field label="Subtitle" className="sm:col-span-2">
        <Textarea rows={3} value={h.subtitle} onChange={(e) => set({ ...h, subtitle: e.target.value })} />
      </Field>
      <Field label="Background image URL" className="sm:col-span-2">
        <Input value={h.image} onChange={(e) => set({ ...h, image: e.target.value })} />
      </Field>
      <Field label="Background video URL" className="sm:col-span-2">
        <Input
          value={h.video ?? ""}
          onChange={(e) => set({ ...h, video: e.target.value })}
          placeholder="https://… (.webm / .mp4)"
        />
      </Field>
      <Field label="Primary CTA label">
        <Input value={h.primaryCta.label} onChange={(e) => set({ ...h, primaryCta: { ...h.primaryCta, label: e.target.value } })} />
      </Field>
      <Field label="Primary CTA link">
        <Input value={h.primaryCta.href} onChange={(e) => set({ ...h, primaryCta: { ...h.primaryCta, href: e.target.value } })} />
      </Field>
      <Field label="Secondary CTA label">
        <Input value={h.secondaryCta.label} onChange={(e) => set({ ...h, secondaryCta: { ...h.secondaryCta, label: e.target.value } })} />
      </Field>
      <Field label="Secondary CTA link">
        <Input value={h.secondaryCta.href} onChange={(e) => set({ ...h, secondaryCta: { ...h.secondaryCta, href: e.target.value } })} />
      </Field>
    </div>
  );
}

function FeaturedFilmsEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const sec = cms.sections.featuredFilms;
  return (
    <div className="space-y-6">
      <SectionMetaFields
        value={sec}
        onChange={(v) => patch((d) => ({ ...d, sections: { ...d.sections, featuredFilms: { ...sec, ...v } } }))}
      />
      <Field label="Number of films on homepage">
        <Input
          type="number"
          value={sec.limit}
          onChange={(e) =>
            patch((d) => ({
              ...d,
              sections: {
                ...d.sections,
                featuredFilms: { ...sec, limit: Number(e.target.value) },
              },
            }))
          }
        />
      </Field>
      <Field label="Film IDs (comma-separated, order matters)">
        <Input
          value={sec.filmIds.join(", ")}
          onChange={(e) =>
            patch((d) => ({
              ...d,
              sections: {
                ...d.sections,
                featuredFilms: {
                  ...sec,
                  filmIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                },
              },
            }))
          }
        />
      </Field>
      <p className="text-xs text-zinc-500">Available IDs: {cms.films.map((f) => f.id).join(", ")}</p>
    </div>
  );
}

function TrendingEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const sec = cms.sections.trending;
  return (
    <div className="space-y-6">
      <SectionMetaFields
        value={sec}
        onChange={(v) => patch((d) => ({ ...d, sections: { ...d.sections, trending: { ...sec, ...v } } }))}
      />
      <Field label="Featured film ID">
        <Input
          value={sec.featuredFilmId}
          onChange={(e) =>
            patch((d) => ({
              ...d,
              sections: { ...d.sections, trending: { ...sec, featuredFilmId: e.target.value } },
            }))
          }
        />
      </Field>
      <Field label="Side film IDs (comma-separated)">
        <Input
          value={sec.sideFilmIds.join(", ")}
          onChange={(e) =>
            patch((d) => ({
              ...d,
              sections: {
                ...d.sections,
                trending: {
                  ...sec,
                  sideFilmIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                },
              },
            }))
          }
        />
      </Field>
    </div>
  );
}

function NewsSectionEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const sec = cms.sections.news;
  const set = (news: typeof sec) => patch((d) => ({ ...d, sections: { ...d.sections, news } }));
  return (
    <div className="space-y-6">
      <SectionMetaFields value={sec} onChange={(v) => set({ ...sec, ...v })} />
      <Field label="Articles on homepage">
        <Input
          type="number"
          value={sec.homeLimit}
          onChange={(e) => set({ ...sec, homeLimit: Number(e.target.value) })}
        />
      </Field>
      <Field label="Recognition label">
        <Input value={sec.recognition.label} onChange={(e) => set({ ...sec, recognition: { ...sec.recognition, label: e.target.value } })} />
      </Field>
      <Field label="Recognition title">
        <Input value={sec.recognition.title} onChange={(e) => set({ ...sec, recognition: { ...sec.recognition, title: e.target.value } })} />
      </Field>
      <Field label="Recognition description">
        <Textarea rows={2} value={sec.recognition.description} onChange={(e) => set({ ...sec, recognition: { ...sec.recognition, description: e.target.value } })} />
      </Field>
    </div>
  );
}

function TeamSectionEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const sec = cms.sections.team;
  const set = (team: typeof sec) => patch((d) => ({ ...d, sections: { ...d.sections, team } }));
  return (
    <div className="space-y-6">
      <SectionMetaFields value={sec} onChange={(v) => set({ ...sec, ...v })} />
      <Field label="Members shown on homepage">
        <Input
          type="number"
          value={sec.limit}
          onChange={(e) => set({ ...sec, limit: Number(e.target.value) })}
        />
      </Field>
      <Field label="Member IDs (comma-separated, order matters)">
        <Input
          value={sec.memberIds.join(", ")}
          onChange={(e) =>
            set({
              ...sec,
              memberIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </Field>
      <p className="text-xs text-zinc-500">
        Available IDs: {cms.teamMembers.map((m) => m.id).join(", ")}
      </p>
      <Field label="Button label">
        <Input value={sec.buttonLabel} onChange={(e) => set({ ...sec, buttonLabel: e.target.value })} />
      </Field>
    </div>
  );
}

function CareersSectionEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const sec = cms.sections.careers;
  const set = (careers: typeof sec) => patch((d) => ({ ...d, sections: { ...d.sections, careers } }));
  return (
    <div className="space-y-6">
      <SectionMetaFields value={sec} onChange={(v) => set({ ...sec, ...v })} />
      <Field label="Spotlight title">
        <Input value={sec.spotlightTitle} onChange={(e) => set({ ...sec, spotlightTitle: e.target.value })} />
      </Field>
      <Field label="Spotlight description">
        <Textarea rows={2} value={sec.spotlightDescription} onChange={(e) => set({ ...sec, spotlightDescription: e.target.value })} />
      </Field>
      <Field label="CTA label">
        <Input value={sec.spotlightCtaLabel} onChange={(e) => set({ ...sec, spotlightCtaLabel: e.target.value })} />
      </Field>
      <Field label="CTA link">
        <Input value={sec.spotlightCtaHref} onChange={(e) => set({ ...sec, spotlightCtaHref: e.target.value })} />
      </Field>
      <Field label="Background image URL">
        <Input value={sec.backgroundImage} onChange={(e) => set({ ...sec, backgroundImage: e.target.value })} />
      </Field>
    </div>
  );
}

function NewsletterEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const sec = cms.sections.newsletter;
  const set = (newsletter: typeof sec) => patch((d) => ({ ...d, sections: { ...d.sections, newsletter } }));
  return (
    <div className="space-y-4">
      <SectionMetaFields value={sec} onChange={(v) => set({ ...sec, ...v })} showLink={false} />
      <Field label="Input placeholder">
        <Input value={sec.placeholder} onChange={(e) => set({ ...sec, placeholder: e.target.value })} />
      </Field>
      <Field label="Button label">
        <Input value={sec.buttonLabel} onChange={(e) => set({ ...sec, buttonLabel: e.target.value })} />
      </Field>
      <Field label="Success message">
        <Textarea rows={2} value={sec.successMessage} onChange={(e) => set({ ...sec, successMessage: e.target.value })} />
      </Field>
    </div>
  );
}

function AboutEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const a = cms.about;
  const set = (about: CmsData["about"]) => patch((d) => ({ ...d, about }));
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Hero title">
        <Input value={a.heroTitle} onChange={(e) => set({ ...a, heroTitle: e.target.value })} />
      </Field>
      <Field label="Hero subtitle">
        <Input value={a.heroSubtitle} onChange={(e) => set({ ...a, heroSubtitle: e.target.value })} />
      </Field>
      <Field label="Hero image URL" className="sm:col-span-2">
        <Input value={a.heroImage} onChange={(e) => set({ ...a, heroImage: e.target.value })} />
      </Field>
      <Field label="Story label">
        <Input value={a.storyLabel} onChange={(e) => set({ ...a, storyLabel: e.target.value })} />
      </Field>
      <Field label="Story title">
        <Input value={a.storyTitle} onChange={(e) => set({ ...a, storyTitle: e.target.value })} />
      </Field>
      <Field label="Story paragraphs (one per line)" className="sm:col-span-2">
        <Textarea
          rows={5}
          value={a.storyParagraphs.join("\n\n")}
          onChange={(e) =>
            set({ ...a, storyParagraphs: e.target.value.split("\n\n").filter(Boolean) })
          }
        />
      </Field>
      <Field label="Story image URL" className="sm:col-span-2">
        <Input value={a.storyImage} onChange={(e) => set({ ...a, storyImage: e.target.value })} />
      </Field>
    </div>
  );
}

function TeamEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const t = cms.team;
  const set = (team: CmsData["team"]) => patch((d) => ({ ...d, team }));
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Hero title">
        <Input value={t.heroTitle} onChange={(e) => set({ ...t, heroTitle: e.target.value })} />
      </Field>
      <Field label="Hero subtitle">
        <Input value={t.heroSubtitle} onChange={(e) => set({ ...t, heroSubtitle: e.target.value })} />
      </Field>
      <ImageUrlField
        className="sm:col-span-2"
        label="Hero image"
        value={t.heroImage}
        onChange={(heroImage) => set({ ...t, heroImage })}
      />
      <Field label="Section label">
        <Input value={t.sectionLabel} onChange={(e) => set({ ...t, sectionLabel: e.target.value })} />
      </Field>
      <Field label="Section title">
        <Input value={t.sectionTitle} onChange={(e) => set({ ...t, sectionTitle: e.target.value })} />
      </Field>
      <Field label="Section subtitle" className="sm:col-span-2">
        <Textarea
          rows={2}
          value={t.sectionSubtitle}
          onChange={(e) => set({ ...t, sectionSubtitle: e.target.value })}
        />
      </Field>
      <Field label="CTA title">
        <Input value={t.ctaTitle} onChange={(e) => set({ ...t, ctaTitle: e.target.value })} />
      </Field>
      <Field label="CTA button label">
        <Input value={t.ctaLabel} onChange={(e) => set({ ...t, ctaLabel: e.target.value })} />
      </Field>
      <Field label="CTA description" className="sm:col-span-2">
        <Textarea
          rows={2}
          value={t.ctaDescription}
          onChange={(e) => set({ ...t, ctaDescription: e.target.value })}
        />
      </Field>
      <Field label="CTA link" className="sm:col-span-2">
        <Input value={t.ctaHref} onChange={(e) => set({ ...t, ctaHref: e.target.value })} />
      </Field>
    </div>
  );
}

function FilmsEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const updateFilm = (id: string, fn: (f: CmsData["films"][0]) => CmsData["films"][0]) =>
    patch((d) => ({ ...d, films: d.films.map((f) => (f.id === id ? fn(f) : f)) }));

  const columns: TableColumn<CmsData["films"][0]>[] = [
    {
      id: "num",
      header: "#",
      cellClassName: "w-10 text-zinc-500",
      cell: (_, __, globalIndex) => globalIndex + 1,
    },
    {
      id: "image",
      header: "Image",
      cell: (film) => <TableThumb src={film.image} />,
    },
    {
      id: "title",
      header: "Title",
      cell: (film) => <TruncateCell text={film.title} maxWidth="max-w-[200px]" />,
    },
    {
      id: "genre",
      header: "Genre",
      cell: (film) => <span className="text-zinc-400">{film.genre}</span>,
    },
    {
      id: "year",
      header: "Year",
      cell: (film) => <span className="text-zinc-400">{film.year}</span>,
    },
    {
      id: "featured",
      header: "Featured",
      cell: (film) => (
        <span className={film.featured ? "text-blue-400" : "text-zinc-600"}>
          {film.featured ? "Yes" : "—"}
        </span>
      ),
    },
  ];

  return (
    <CollectionTable
      title="Films"
      items={cms.films}
      columns={columns}
      onAdd={() =>
        patch((d) => ({
          ...d,
          films: [
            ...d.films,
            {
              id: newId(),
              title: "New Film",
              genre: "Drama",
              year: 2026,
              image: "",
              description: "",
              featured: false,
            },
          ],
        }))
      }
      onRemove={(id) => patch((d) => ({ ...d, films: d.films.filter((f) => f.id !== id) }))}
      renderEdit={(film) => (
        <EditPanel>
          <Field label="Title" className="sm:col-span-2">
            <Input
              value={film.title}
              onChange={(e) => updateFilm(film.id, (f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
          <Field label="Genre">
            <Input
              value={film.genre}
              onChange={(e) => updateFilm(film.id, (f) => ({ ...f, genre: e.target.value }))}
            />
          </Field>
          <Field label="Year">
            <Input
              type="number"
              value={film.year}
              onChange={(e) =>
                updateFilm(film.id, (f) => ({ ...f, year: Number(e.target.value) }))
              }
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={film.description}
              onChange={(e) =>
                updateFilm(film.id, (f) => ({ ...f, description: e.target.value }))
              }
            />
          </Field>
          <ImageUrlField
            className="sm:col-span-2"
            value={film.image}
            onChange={(image) => updateFilm(film.id, (f) => ({ ...f, image }))}
          />
          <div className="sm:col-span-2 flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">ID: {film.id}</span>
            <Checkbox
              label="Featured on site"
              checked={!!film.featured}
              onChange={(featured) => updateFilm(film.id, (f) => ({ ...f, featured }))}
            />
          </div>
        </EditPanel>
      )}
    />
  );
}

function NewsEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const updateItem = (id: string, fn: (n: CmsData["newsItems"][0]) => CmsData["newsItems"][0]) =>
    patch((d) => ({
      ...d,
      newsItems: d.newsItems.map((n) => (n.id === id ? fn(n) : n)),
    }));

  const columns: TableColumn<CmsData["newsItems"][0]>[] = [
    {
      id: "num",
      header: "#",
      cellClassName: "w-10 text-zinc-500",
      cell: (_, __, globalIndex) => globalIndex + 1,
    },
    {
      id: "image",
      header: "Image",
      cell: (item) => <TableThumb src={item.image} />,
    },
    {
      id: "title",
      header: "Title",
      cell: (item) => <TruncateCell text={item.title} maxWidth="max-w-[200px]" />,
    },
    {
      id: "category",
      header: "Category",
      cell: (item) => <span className="text-zinc-400">{item.category}</span>,
    },
    {
      id: "date",
      header: "Date",
      cell: (item) => <span className="whitespace-nowrap text-zinc-400">{item.date}</span>,
    },
    {
      id: "excerpt",
      header: "Excerpt",
      cell: (item) => <TruncateCell text={item.excerpt} maxWidth="max-w-[180px]" />,
    },
  ];

  return (
    <CollectionTable
      title="News articles"
      items={cms.newsItems}
      columns={columns}
      onAdd={() =>
        patch((d) => ({
          ...d,
          newsItems: [
            ...d.newsItems,
            {
              id: newId(),
              title: "New Article",
              excerpt: "",
              date: "May 20, 2026",
              category: "News",
              image: "",
            },
          ],
        }))
      }
      onRemove={(id) =>
        patch((d) => ({ ...d, newsItems: d.newsItems.filter((n) => n.id !== id) }))
      }
      renderEdit={(item) => (
        <EditPanel>
          <Field label="Title" className="sm:col-span-2">
            <Input
              value={item.title}
              onChange={(e) => updateItem(item.id, (n) => ({ ...n, title: e.target.value }))}
            />
          </Field>
          <Field label="Excerpt" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={item.excerpt}
              onChange={(e) => updateItem(item.id, (n) => ({ ...n, excerpt: e.target.value }))}
            />
          </Field>
          <Field label="Date">
            <Input
              value={item.date}
              onChange={(e) => updateItem(item.id, (n) => ({ ...n, date: e.target.value }))}
            />
          </Field>
          <Field label="Category">
            <Input
              value={item.category}
              onChange={(e) => updateItem(item.id, (n) => ({ ...n, category: e.target.value }))}
            />
          </Field>
          <ImageUrlField
            className="sm:col-span-2"
            value={item.image}
            onChange={(image) => updateItem(item.id, (n) => ({ ...n, image }))}
          />
        </EditPanel>
      )}
    />
  );
}

function StudiosEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const updateStudio = (id: string, fn: (s: CmsData["studios"][0]) => CmsData["studios"][0]) =>
    patch((d) => ({ ...d, studios: d.studios.map((s) => (s.id === id ? fn(s) : s)) }));

  const columns: TableColumn<CmsData["studios"][0]>[] = [
    {
      id: "num",
      header: "#",
      cellClassName: "w-10 text-zinc-500",
      cell: (_, __, globalIndex) => globalIndex + 1,
    },
    {
      id: "title",
      header: "Title",
      cell: (s) => <TruncateCell text={s.title} />,
    },
    {
      id: "icon",
      header: "Icon",
      cell: (s) => <span className="font-mono text-xs text-zinc-400">{s.icon}</span>,
    },
    {
      id: "description",
      header: "Description",
      cell: (s) => <TruncateCell text={s.description} maxWidth="max-w-[320px]" />,
    },
  ];

  return (
    <CollectionTable
      title="Studios"
      items={cms.studios}
      columns={columns}
      onAdd={() =>
        patch((d) => ({
          ...d,
          studios: [
            ...d.studios,
            { id: newId(), title: "New Studio", description: "", icon: "film" },
          ],
        }))
      }
      onRemove={(id) => patch((d) => ({ ...d, studios: d.studios.filter((s) => s.id !== id) }))}
      renderEdit={(studio) => (
        <EditPanel>
          <Field label="Title" className="sm:col-span-2">
            <Input
              value={studio.title}
              onChange={(e) => updateStudio(studio.id, (s) => ({ ...s, title: e.target.value }))}
            />
          </Field>
          <Field label="Icon key">
            <Input
              value={studio.icon}
              onChange={(e) => updateStudio(studio.id, (s) => ({ ...s, icon: e.target.value }))}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={studio.description}
              onChange={(e) =>
                updateStudio(studio.id, (s) => ({ ...s, description: e.target.value }))
              }
            />
          </Field>
        </EditPanel>
      )}
    />
  );
}

function CareersListEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const updateCareer = (id: string, fn: (c: CmsData["careers"][0]) => CmsData["careers"][0]) =>
    patch((d) => ({ ...d, careers: d.careers.map((c) => (c.id === id ? fn(c) : c)) }));

  const columns: TableColumn<CmsData["careers"][0]>[] = [
    {
      id: "num",
      header: "#",
      cellClassName: "w-10 text-zinc-500",
      cell: (_, __, globalIndex) => globalIndex + 1,
    },
    {
      id: "title",
      header: "Title",
      cell: (c) => <TruncateCell text={c.title} maxWidth="max-w-[200px]" />,
    },
    {
      id: "department",
      header: "Department",
      cell: (c) => <span className="text-zinc-400">{c.department}</span>,
    },
    {
      id: "location",
      header: "Location",
      cell: (c) => <span className="text-zinc-400">{c.location}</span>,
    },
    {
      id: "type",
      header: "Type",
      cell: (c) => <span className="text-zinc-400">{c.type}</span>,
    },
  ];

  return (
    <CollectionTable
      title="Careers"
      items={cms.careers}
      columns={columns}
      onAdd={() =>
        patch((d) => ({
          ...d,
          careers: [
            ...d.careers,
            {
              id: newId(),
              title: "New Role",
              department: "Production",
              location: "Remote",
              type: "Full-time",
            },
          ],
        }))
      }
      onRemove={(id) => patch((d) => ({ ...d, careers: d.careers.filter((c) => c.id !== id) }))}
      renderEdit={(career) => (
        <EditPanel>
          <Field label="Title" className="sm:col-span-2">
            <Input
              value={career.title}
              onChange={(e) => updateCareer(career.id, (c) => ({ ...c, title: e.target.value }))}
            />
          </Field>
          <Field label="Department">
            <Input
              value={career.department}
              onChange={(e) =>
                updateCareer(career.id, (c) => ({ ...c, department: e.target.value }))
              }
            />
          </Field>
          <Field label="Location">
            <Input
              value={career.location}
              onChange={(e) =>
                updateCareer(career.id, (c) => ({ ...c, location: e.target.value }))
              }
            />
          </Field>
          <Field label="Type">
            <Input
              value={career.type}
              onChange={(e) => updateCareer(career.id, (c) => ({ ...c, type: e.target.value }))}
            />
          </Field>
        </EditPanel>
      )}
    />
  );
}

function ProcessEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const updateStep = (id: string, fn: (s: CmsData["processSteps"][0]) => CmsData["processSteps"][0]) =>
    patch((d) => ({
      ...d,
      processSteps: d.processSteps.map((s) => (s.id === id ? fn(s) : s)),
    }));

  const columns: TableColumn<CmsData["processSteps"][0]>[] = [
    {
      id: "step",
      header: "Step",
      cellClassName: "w-14 text-zinc-400",
      cell: (s) => s.step,
    },
    {
      id: "title",
      header: "Title",
      cell: (s) => <TruncateCell text={s.title} maxWidth="max-w-[200px]" />,
    },
    {
      id: "description",
      header: "Description",
      cell: (s) => <TruncateCell text={s.description} maxWidth="max-w-[360px]" />,
    },
  ];

  return (
    <CollectionTable
      title="Process steps"
      items={cms.processSteps}
      columns={columns}
      onAdd={() =>
        patch((d) => ({
          ...d,
          processSteps: [
            ...d.processSteps,
            {
              id: newId(),
              step: d.processSteps.length + 1,
              title: "New Step",
              description: "",
            },
          ],
        }))
      }
      onRemove={(id) =>
        patch((d) => ({ ...d, processSteps: d.processSteps.filter((s) => s.id !== id) }))
      }
      renderEdit={(step) => (
        <EditPanel>
          <Field label="Step #">
            <Input
              type="number"
              value={step.step}
              onChange={(e) =>
                updateStep(step.id, (s) => ({ ...s, step: Number(e.target.value) }))
              }
            />
          </Field>
          <Field label="Title">
            <Input
              value={step.title}
              onChange={(e) => updateStep(step.id, (s) => ({ ...s, title: e.target.value }))}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea
              rows={2}
              value={step.description}
              onChange={(e) =>
                updateStep(step.id, (s) => ({ ...s, description: e.target.value }))
              }
            />
          </Field>
        </EditPanel>
      )}
    />
  );
}

function TeamMembersEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const updateMember = (
    id: string,
    fn: (m: CmsData["teamMembers"][0]) => CmsData["teamMembers"][0]
  ) => patch((d) => ({ ...d, teamMembers: d.teamMembers.map((m) => (m.id === id ? fn(m) : m)) }));

  const columns: TableColumn<CmsData["teamMembers"][0]>[] = [
    {
      id: "num",
      header: "#",
      cellClassName: "w-10 text-zinc-500",
      cell: (_, __, globalIndex) => globalIndex + 1,
    },
    {
      id: "image",
      header: "Image",
      cell: (member) => <TableThumb src={member.image} />,
    },
    {
      id: "name",
      header: "Name",
      cell: (member) => <TruncateCell text={member.name} maxWidth="max-w-[160px]" />,
    },
    {
      id: "role",
      header: "Role",
      cell: (member) => <TruncateCell text={member.role} maxWidth="max-w-[160px]" />,
    },
    {
      id: "department",
      header: "Department",
      cell: (member) => <span className="text-zinc-400">{member.department}</span>,
    },
    {
      id: "featured",
      header: "Featured",
      cell: (member) => (
        <span className={member.featured ? "text-blue-400" : "text-zinc-600"}>
          {member.featured ? "Yes" : "—"}
        </span>
      ),
    },
  ];

  return (
    <CollectionTable
      title="Team members"
      items={cms.teamMembers}
      columns={columns}
      onAdd={() =>
        patch((d) => ({
          ...d,
          teamMembers: [
            ...d.teamMembers,
            {
              id: newId(),
              name: "New Member",
              role: "",
              department: "Leadership",
              bio: "",
              image: "",
              featured: false,
              socialLinks: [],
            },
          ],
        }))
      }
      onRemove={(id) =>
        patch((d) => ({ ...d, teamMembers: d.teamMembers.filter((m) => m.id !== id) }))
      }
      renderEdit={(member) => (
        <EditPanel>
          <Field label="Name" className="sm:col-span-2">
            <Input
              value={member.name}
              onChange={(e) => updateMember(member.id, (m) => ({ ...m, name: e.target.value }))}
            />
          </Field>
          <Field label="Role">
            <Input
              value={member.role}
              onChange={(e) => updateMember(member.id, (m) => ({ ...m, role: e.target.value }))}
            />
          </Field>
          <Field label="Department">
            <Input
              value={member.department}
              onChange={(e) =>
                updateMember(member.id, (m) => ({ ...m, department: e.target.value }))
              }
            />
          </Field>
          <Field label="Bio" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={member.bio}
              onChange={(e) => updateMember(member.id, (m) => ({ ...m, bio: e.target.value }))}
            />
          </Field>
          <ImageUrlField
            className="sm:col-span-2"
            value={member.image}
            onChange={(image) => updateMember(member.id, (m) => ({ ...m, image }))}
          />
          <div className="sm:col-span-2 flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">ID: {member.id}</span>
            <Checkbox
              label="Featured (leadership spotlight)"
              checked={!!member.featured}
              onChange={(featured) => updateMember(member.id, (m) => ({ ...m, featured }))}
            />
          </div>
          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-zinc-400">Social links</p>
              <button
                type="button"
                className="text-xs text-blue-400 hover:text-blue-300"
                onClick={() =>
                  updateMember(member.id, (m) => ({
                    ...m,
                    socialLinks: [...(m.socialLinks ?? []), { label: "LinkedIn", href: "" }],
                  }))
                }
              >
                + Add link
              </button>
            </div>
            {(member.socialLinks ?? []).map((link, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <Input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) =>
                    updateMember(member.id, (m) => {
                      const socialLinks = [...(m.socialLinks ?? [])];
                      socialLinks[i] = { ...link, label: e.target.value };
                      return { ...m, socialLinks };
                    })
                  }
                />
                <Input
                  placeholder="URL"
                  value={link.href}
                  onChange={(e) =>
                    updateMember(member.id, (m) => {
                      const socialLinks = [...(m.socialLinks ?? [])];
                      socialLinks[i] = { ...link, href: e.target.value };
                      return { ...m, socialLinks };
                    })
                  }
                />
                <button
                  type="button"
                  className="rounded border border-zinc-700 px-2 text-xs text-zinc-400 hover:border-red-800 hover:text-red-400"
                  onClick={() =>
                    updateMember(member.id, (m) => ({
                      ...m,
                      socialLinks: (m.socialLinks ?? []).filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </EditPanel>
      )}
    />
  );
}

function BtsEditor({ cms, patch }: { cms: CmsData; patch: PatchFn }) {
  const updateItem = (id: string, fn: (b: CmsData["btsItems"][0]) => CmsData["btsItems"][0]) =>
    patch((d) => ({ ...d, btsItems: d.btsItems.map((b) => (b.id === id ? fn(b) : b)) }));

  const columns: TableColumn<CmsData["btsItems"][0]>[] = [
    {
      id: "num",
      header: "#",
      cellClassName: "w-10 text-zinc-500",
      cell: (_, __, globalIndex) => globalIndex + 1,
    },
    {
      id: "image",
      header: "Image",
      cell: (item) => <TableThumb src={item.image} />,
    },
    {
      id: "title",
      header: "Title",
      cell: (item) => <TruncateCell text={item.title} maxWidth="max-w-[220px]" />,
    },
    {
      id: "duration",
      header: "Duration",
      cell: (item) => <span className="text-zinc-400">{item.duration}</span>,
    },
    {
      id: "video",
      header: "Video",
      cell: (item) =>
        item.video ? (
          <span className="text-emerald-400">✓ Linked</span>
        ) : (
          <span className="text-zinc-600">—</span>
        ),
    },
  ];

  return (
    <CollectionTable
      title="BTS videos"
      items={cms.btsItems}
      columns={columns}
      onAdd={() =>
        patch((d) => ({
          ...d,
          btsItems: [
            ...d.btsItems,
            { id: newId(), title: "New BTS", image: "", duration: "0:00", video: "" },
          ],
        }))
      }
      onRemove={(id) => patch((d) => ({ ...d, btsItems: d.btsItems.filter((b) => b.id !== id) }))}
      renderEdit={(item) => (
        <EditPanel>
          <Field label="Title" className="sm:col-span-2">
            <Input
              value={item.title}
              onChange={(e) => updateItem(item.id, (b) => ({ ...b, title: e.target.value }))}
            />
          </Field>
          <Field label="Duration">
            <Input
              value={item.duration}
              onChange={(e) => updateItem(item.id, (b) => ({ ...b, duration: e.target.value }))}
            />
          </Field>
          <ImageUrlField
            className="sm:col-span-2"
            value={item.image}
            onChange={(image) => updateItem(item.id, (b) => ({ ...b, image }))}
          />
          <Field label="Video URL" className="sm:col-span-2">
            <div className="flex flex-col gap-3">
              <Input
                value={item.video}
                onChange={(e) => updateItem(item.id, (b) => ({ ...b, video: e.target.value }))}
                placeholder="https://…/video.mp4"
                className="text-xs"
              />
              {item.video && (
                <video
                  src={item.video}
                  controls
                  className="max-h-48 w-full rounded-md border border-zinc-700 bg-black"
                />
              )}
            </div>
          </Field>
        </EditPanel>
      )}
    />
  );
}
