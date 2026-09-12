import { articleImage, eventImage } from "@/lib/data/placeholders";
import { SITE_URL, absUrl, absoluteImage, localeUrl } from "@/lib/seo";
import { articleSummary, articleTitle, type Article, type EventRow } from "@/lib/types";

export const ORG_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationJson() {
  return {
    "@type": "NewsMediaOrganization",
    "@id": ORG_ID,
    name: "HelloLWD",
    url: SITE_URL,
    email: "info@hellolwd.com",
    logo: {
      "@type": "ImageObject",
      url: absUrl("/favicon.svg"),
    },
    image: absUrl("/placeholders/news.jpg"),
    areaServed: {
      "@type": "City",
      name: "Leeuwarden",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Friesland",
      },
    },
    knowsLanguage: ["nl", "en", "es", "fa"],
  };
}

export function websiteJson() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "HelloLWD",
    url: SITE_URL,
    inLanguage: ["nl", "en", "es", "fa"],
    publisher: { "@id": ORG_ID },
  };
}

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJson(), websiteJson()],
  };
}

export function newsArticleJson(article: Article, locale: string) {
  const path = `/article/${article.id}`;
  const url = localeUrl(locale, path);
  const title = articleTitle(article, locale);
  const description = articleSummary(article, locale);
  return {
    "@type": "NewsArticle",
    headline: title.slice(0, 110),
    description,
    image: [absoluteImage(articleImage(article.image_url, article.category))],
    datePublished: article.published_at,
    dateModified: article.created_at || article.published_at,
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: "HelloLWD",
      url: SITE_URL,
    },
    publisher: { "@id": ORG_ID },
    isBasedOn: article.source_url,
    articleSection: article.category,
    url,
  };
}

export function articleGraph(article: Article, locale: string, homeLabel: string) {
  const path = `/article/${article.id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJson(),
      newsArticleJson(article, locale),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: homeLabel,
            item: localeUrl(locale, "/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: articleTitle(article, locale),
            item: localeUrl(locale, path),
          },
        ],
      },
    ],
  };
}

export function eventJson(event: EventRow) {
  const data: Record<string, unknown> = {
    "@type": "Event",
    name: event.name,
    startDate: event.event_datetime,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: absoluteImage(eventImage(event.image_url)),
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Leeuwarden",
        addressRegion: "Friesland",
        addressCountry: "NL",
      },
    },
  };
  const description =
    event.description_en ||
    event.description_nl ||
    event.description_es ||
    event.description_fa;
  if (description) data.description = description;
  if (event.ticket_link) data.url = event.ticket_link;
  return data;
}

export function eventsGraph(events: EventRow[], locale: string, name: string, description: string) {
  const url = localeUrl(locale, "/events");
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJson(),
      {
        "@type": "CollectionPage",
        name,
        description,
        url,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: events.length,
          itemListElement: events.map((event, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: eventJson(event),
          })),
        },
      },
    ],
  };
}
