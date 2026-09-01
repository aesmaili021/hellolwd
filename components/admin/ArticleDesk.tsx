"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { translateDeskCopyAction } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/ImageField";
import {
  CONTENT_LOCALES,
  NEWS_CATEGORIES,
  type Article,
  type ContentLocale,
} from "@/lib/types";

const LANGS: { code: ContentLocale; name: string; dir: "ltr" | "rtl" }[] = [
  { code: "nl", name: "Nederlands", dir: "ltr" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "fa", name: "فارسی", dir: "rtl" },
];

function toLocalInput(iso?: string) {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function textToHtml(value: string) {
  const paras = value.split(/\n{2,}/).map((para) => para.trim()).filter(Boolean);
  if (!paras.length) return "<p><br></p>";
  return paras.map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br>")}</p>`).join("");
}

function htmlToText(root: HTMLElement) {
  const blocks = [...root.querySelectorAll("p, div")];
  if (!blocks.length) return root.innerText.replace(/\n{3,}/g, "\n\n").trim();
  return blocks
    .map((node) => node.textContent?.replace(/\s+/g, " ").trim() || "")
    .filter(Boolean)
    .join("\n\n");
}

function emptyCopy(article?: Article): Record<ContentLocale, { title: string; summary: string }> {
  return {
    nl: { title: article?.title_nl ?? "", summary: article?.summary_nl ?? "" },
    en: { title: article?.title_en ?? "", summary: article?.summary_en ?? "" },
    es: { title: article?.title_es ?? "", summary: article?.summary_es ?? "" },
    fa: { title: article?.title_fa ?? "", summary: article?.summary_fa ?? "" },
  };
}

function firstFilled(copy: Record<ContentLocale, { title: string; summary: string }>, enabled: ContentLocale[]) {
  return (
    enabled.find((code) => copy[code].title.trim() && copy[code].summary.trim()) ||
    enabled.find((code) => copy[code].title.trim()) ||
    enabled[0] ||
    "nl"
  );
}

export function ArticleDesk({
  action,
  article,
}: {
  action: (form: FormData) => void | Promise<void>;
  article?: Article;
}) {
  const [enabled, setEnabled] = useState<ContentLocale[]>(
    article?.locales?.length ? article.locales : [...CONTENT_LOCALES],
  );
  const [copy, setCopy] = useState(() => emptyCopy(article));
  const [tab, setTab] = useState<ContentLocale>(() =>
    firstFilled(emptyCopy(article), article?.locales?.length ? article.locales : [...CONTENT_LOCALES]),
  );
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();
  const current = copy[tab];
  const lang = LANGS.find((item) => item.code === tab) ?? LANGS[0];
  const missing = enabled.filter((code) => code !== tab && !copy[code].title.trim());

  function setLocaleCopy(locale: ContentLocale, next: { title?: string; summary?: string }) {
    setCopy((prev) => ({ ...prev, [locale]: { ...prev[locale], ...next } }));
  }

  function toggleLocale(code: ContentLocale) {
    setEnabled((prev) => {
      const next = prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code];
      const keep: ContentLocale[] = next.length ? next : ["en"];
      if (!keep.includes(tab)) setTab(keep[0]);
      return keep;
    });
  }

  function translateRest() {
    setNotice("");
    startTransition(async () => {
      const source = copy[tab].title.trim() ? tab : firstFilled(copy, enabled);
      const result = await translateDeskCopyAction({
        source,
        title: copy[source].title,
        summary: copy[source].summary,
        targets: enabled.filter((code) => code !== source && !copy[code].title.trim()),
      });
      if (!result.ok || !Object.keys(result.copy).length) {
        setNotice("Translation did not come back. Save anyway — empty languages stay empty.");
        return;
      }
      setCopy((prev) => {
        const next = { ...prev };
        for (const [locale, piece] of Object.entries(result.copy)) {
          if (!piece) continue;
          next[locale as ContentLocale] = piece;
        }
        return next;
      });
      setNotice("The other languages are filled. Check them before you save.");
    });
  }

  return (
    <form action={action} encType="multipart/form-data" className="flex flex-col gap-6">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      <input type="hidden" name="source_locale" value={tab} />
      {CONTENT_LOCALES.map((code) => (
        <span key={code}>
          {enabled.includes(code) ? <input type="hidden" name="locales" value={code} /> : null}
          <input type="hidden" name={`title_${code}`} value={copy[code].title} />
          <input type="hidden" name={`summary_${code}`} value={copy[code].summary} />
        </span>
      ))}

      <section className="grid gap-4 sm:grid-cols-2">
        <MetaField name="source_name" label="Source" defaultValue={article?.source_name} required />
        <MetaField
          name="source_url"
          label="Source URL"
          defaultValue={article?.source_url}
          required
        />
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase">
            Category
          </span>
          <select
            name="category"
            defaultValue={article?.category ?? "culture"}
            className="min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm text-navy outline-none"
          >
            {NEWS_CATEGORIES.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <MetaField
          name="published_at"
          label="Published"
          type="datetime-local"
          defaultValue={toLocalInput(article?.published_at)}
        />
        <ImageField currentUrl={article?.image_url} />
      </section>

      <section className="overflow-hidden rounded-[14px] border border-line bg-mist">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-4 py-3">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.12em] text-mute uppercase">
              Story desk
            </p>
            <p className="mt-0.5 text-[13px] text-muted">
              Write one language. The others fill from that.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((item) => {
              const on = enabled.includes(item.code);
              return (
                <label
                  key={item.code}
                  className={`inline-flex min-h-9 cursor-pointer items-center rounded-full px-3 text-[12px] font-extrabold tracking-[0.04em] uppercase ${
                    on ? "bg-ice text-navy" : "bg-wash text-mute"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleLocale(item.code)}
                    className="sr-only"
                  />
                  {item.code}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-line bg-paper px-2 pt-2">
          {LANGS.filter((item) => enabled.includes(item.code)).map((item) => {
            const filled = Boolean(copy[item.code].title.trim());
            const active = tab === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setTab(item.code)}
                className={`min-h-10 cursor-pointer rounded-t-lg px-3.5 text-[13px] font-bold ${
                  active
                    ? "bg-mist text-navy"
                    : "text-muted hover:text-navy"
                }`}
              >
                {item.name}
                <span className={`ms-2 inline-block h-1.5 w-1.5 rounded-full ${filled ? "bg-primary" : "bg-slate"}`} />
              </button>
            );
          })}
        </div>

        <div className="px-4 py-5 lg:px-6 lg:py-6" dir={lang.dir}>
          <input
            value={current.title}
            onChange={(event) => setLocaleCopy(tab, { title: event.target.value })}
            placeholder={tab === "fa" ? "عنوان خبر" : "Headline"}
            className="w-full border-0 bg-transparent text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] text-navy outline-none placeholder:text-slate lg:text-[34px]"
          />
          <SummaryEditor
            key={tab}
            value={current.summary}
            dir={lang.dir}
            placeholder={
              tab === "fa"
                ? "متن خبر را اینجا بنویس. اینتر پاراگراف جدید می‌سازد."
                : "Write the story here. Enter makes a new paragraph."
            }
            onChange={(summary) => setLocaleCopy(tab, { summary })}
          />
          <p className="mt-3 text-[12px] font-semibold text-mute">
            {current.summary.trim() ? `${current.summary.trim().split(/\s+/).length} words` : "Empty"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line bg-paper px-4 py-3">
          <button
            type="button"
            onClick={translateRest}
            disabled={pending || !current.title.trim() || missing.length === 0}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-primary px-4 text-[13px] font-extrabold text-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Translating…" : "Fill the other languages"}
          </button>
          <p className="text-[13px] text-muted">
            {missing.length
              ? `${missing.map((code) => code.toUpperCase()).join(", ")} still empty`
              : "Every selected language has a title"}
          </p>
        </div>
      </section>

      {notice ? (
        <p className="text-sm font-semibold text-navy" role="status">
          {notice}
        </p>
      ) : null}

      <button
        type="submit"
        className="min-h-11 cursor-pointer self-start rounded-full bg-brand px-5 text-sm font-extrabold text-paper"
      >
        Save story
      </button>
    </form>
  );
}

function SummaryEditor({
  value,
  dir,
  placeholder,
  onChange,
}: {
  value: string;
  dir: "ltr" | "rtl";
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef(value);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = textToHtml(value);
    last.current = value;
  }, []);

  useEffect(() => {
    if (!ref.current || document.activeElement === ref.current) return;
    if (value === last.current) return;
    ref.current.innerHTML = textToHtml(value);
    last.current = value;
  }, [value]);

  return (
    <div
      ref={ref}
      dir={dir}
      role="textbox"
      aria-multiline="true"
      aria-label="Story text"
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      data-empty={value.trim() ? "false" : "true"}
      className="story-desk mt-5 min-h-[280px] text-[17px] leading-[1.65] text-ink outline-none"
      onInput={() => {
        if (!ref.current) return;
        const text = htmlToText(ref.current);
        last.current = text;
        onChange(text);
      }}
    />
  );
}

function MetaField({
  name,
  label,
  defaultValue,
  type = "text",
  required,
  className,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-[11px] font-extrabold tracking-[0.08em] text-mute uppercase">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm text-navy outline-none"
      />
    </label>
  );
}
