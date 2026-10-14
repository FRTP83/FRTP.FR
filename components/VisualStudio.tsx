"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, Monitor, MousePointer2, PanelRightClose, PanelRightOpen, Smartphone } from "lucide-react";
import type { StudioSettings } from "@/lib/studio";
import { createRoot, type Root } from "react-dom/client";
import { RichText } from "@/components/RichText";

type Tab = "studio" | "beforeAfter" | "projects" | "news" | "requests";
export const studioGroups = [
  { id: "hero", label: "Bannière d’accueil", page: "/", prefixes: ["hero"] },
  { id: "method", label: "Méthode terrain", page: "/", prefixes: ["method"] },
  { id: "homeActivities", label: "Activités à l’accueil", page: "/", prefixes: ["homeActivities"] },
  { id: "homeProjects", label: "Réalisations à l’accueil", page: "/", prefixes: ["homeProjects"] },
  { id: "beforeAfter", label: "Avant / Après", page: "/avant-apres", prefixes: ["beforeAfter", "beforeImage", "afterImage"] },
  { id: "reviews", label: "Avis clients", page: "/", prefixes: ["review"] },
  { id: "cta", label: "Appel à l’action", page: "/", prefixes: ["homeCta"] },
  { id: "company", label: "Entreprise", page: "/entreprise", prefixes: ["company", "serviceArea"] },
  { id: "activities", label: "Activités et schéma interactif", page: "/activites", prefixes: ["activit"] },
  { id: "listing", label: "Titres des pages", page: "/realisations", prefixes: ["projectsPage", "newsPage"] },
  { id: "contact", label: "Contact et pied de page", page: "/contact", prefixes: ["contact", "phone", "email", "address", "footer"] },
  { id: "legal", label: "Informations légales", page: "/mentions-legales", prefixes: ["legal", "privacy"] },
  { id: "stats", label: "Chiffres clés", page: "/", prefixes: ["stat"] }
];
const pages = [
  ["/", "Accueil"], ["/entreprise", "Entreprise"], ["/activites", "Activités"],
  ["/realisations", "Réalisations"], ["/avant-apres", "Avant / Après"],
  ["/actualites", "Actualités"], ["/contact", "Contact"],
  ["/mentions-legales", "Mentions légales"], ["/politique-confidentialite", "Confidentialité"]
];

export function VisualStudio({ children, settings, activeTab, onTab, projects, news, onProject, onNews, selectedProject, selectedNews, loading }: {
  children: ReactNode; settings: StudioSettings; activeTab: Tab; onTab: (tab: Tab) => void;
  projects: Array<{ id: string; slug: string }>; news: Array<{ id: string; slug: string }>;
  onProject: (id: string) => void; onNews: (id: string) => void;
  selectedProject: string; selectedNews: string; loading: boolean;
}) {
  const [path, setPath] = useState("/");
  const [mobile, setMobile] = useState(false);
  const [editing, setEditing] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [group, setGroup] = useState("hero");
  const [dirty, setDirty] = useState(false);
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cleanup = useRef<() => void>(() => {});
  const attachedDocument = useRef<Document | null>(null);
  const urls = useRef<Record<string, string>>({});
  const drafts = useRef<Record<string, string>>({});
  const richRoots = useRef<Map<HTMLElement, Root>>(new Map());
  const latest = useRef({ settings, activeTab, editing, projects, news, onTab, onProject, onNews });
  const previousTab = useRef(activeTab);
  useEffect(() => { latest.current = { settings, activeTab, editing, projects, news, onTab, onProject, onNews }; });

  const selectField = useCallback((name: string) => {
    const match = studioGroups.find(item => item.prefixes.some(prefix => name.startsWith(prefix)));
    setPanelOpen(true);
    if (match) {
      setGroup(match.id);
      latest.current.onTab("studio");
    }
    requestAnimationFrame(() => {
      const control = panel.current?.querySelector<HTMLElement>(`[name="${name}"]`);
      control?.focus({ preventScroll: true });
      control?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, []);

  const applyDrafts = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    for (const [name, value] of Object.entries(drafts.current)) {
      doc.querySelectorAll<HTMLElement>(`[data-studio-field="${name}"]`).forEach(node => {
        if (node.tagName === "IMG") {
          node.removeAttribute("srcset");
          node.setAttribute("src", value);
        } else if (node.dataset.studioPlain === "true" && node.textContent !== value) {
          node.textContent = value;
        } else if ((node.matches(".rich-text") || node.querySelector(".rich-text")) && node.dataset.studioDraft !== value) {
          const rich = node.matches(".rich-text") ? node : node.querySelector<HTMLElement>(".rich-text")!;
          const className = rich.className;
          let root = richRoots.current.get(node);
          if (!root) { root = createRoot(node); richRoots.current.set(node, root); }
          node.dataset.studioDraft = value;
          root.render(<RichText content={value} className={className} />);
        }
      });
    }
  }, []);

  const attach = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc?.body || !doc.defaultView) return;
    const requested = new URL(frame.current!.src);
    const displayed = new URL(doc.URL);
    if (requested.pathname !== displayed.pathname || requested.search !== displayed.search) return;
    if (doc.documentElement.dataset.studioHydrated !== "true") return;
    if (attachedDocument.current === doc) return;
    cleanup.current();
    attachedDocument.current = doc;
    richRoots.current.clear();
    setReady(true);
    const style = doc.createElement("style");
    style.textContent = `html[data-studio-edit] [data-studio-field]:hover { outline: 2px solid #ef6b25; outline-offset: 5px; cursor: pointer; } html[data-studio-edit] [data-studio-selected] { outline: 2px solid #ef6b25; outline-offset: 5px; } html[data-studio-edit] [data-studio-field] { scroll-margin-top: 100px; }`;
    doc.head.append(style);
    doc.documentElement.toggleAttribute("data-studio-edit", latest.current.editing);
    const annotate = () => {
      // Fallback for existing repeatable fields. Explicit markers handle page headings.
      const values: Record<string, string> = {};
      for (const [key, value] of Object.entries(latest.current.settings)) {
        if (typeof value === "string" && value.trim().length > 3 && !key.endsWith("Image")) values[value.trim()] = key;
      }
      latest.current.settings.methodSteps.forEach((step, i) => {
        values[step.title.trim()] = `methodStepTitle${i}`;
        values[step.text.trim()] = `methodStepText${i}`;
      });
      latest.current.settings.companyCards.forEach((card, i) => {
        values[card.title.trim()] = `companyCardTitle${i}`;
        values[card.text.trim()] = `companyCardText${i}`;
      });
      latest.current.settings.reviews.forEach((review, i) => {
        values[review.author.trim()] = `reviewAuthor${i}`;
        values[`"${review.text}"`] = `reviewText${i}`;
      });
      latest.current.settings.activities.forEach(activity => {
        values[activity.title.trim()] = `activityTitle-${activity.slug}`;
        values[activity.description.trim()] = `activityDescription-${activity.slug}`;
      });
      if (latest.current.activeTab === "projects" || latest.current.activeTab === "news") {
        panel.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[name],textarea[name]").forEach(input => {
          if (input.type !== "hidden" && input.type !== "file" && input.value.trim().length > 3) values[input.value.trim()] = input.name;
        });
      }
      doc.querySelectorAll<HTMLElement>("h1,h2,h3,p,span,strong,blockquote").forEach(node => {
        if (node.childElementCount === 0 && !node.hasAttribute("data-studio-field")) {
          const field = values[node.textContent?.trim() ?? ""];
          if (field) node.dataset.studioField = field;
        }
      });
      doc.querySelectorAll<HTMLElement>("[data-studio-field]").forEach(node => {
        if (node.childElementCount === 0 && node.tagName !== "IMG") node.dataset.studioPlain = "true";
      });
      applyDrafts();
    };
    annotate();
    const observer = new doc.defaultView.MutationObserver(annotate);
    observer.observe(doc.body, { childList: true, subtree: true });
    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      const field = target.closest<HTMLElement>("[data-studio-field]");
      if (latest.current.editing && field) {
        event.preventDefault(); event.stopPropagation();
        doc.querySelectorAll("[data-studio-selected]").forEach(node => node.removeAttribute("data-studio-selected"));
        field.setAttribute("data-studio-selected", "");
        selectField(field.dataset.studioField!);
        return;
      }
      if (link) {
        const url = new URL(link.href);
        event.preventDefault(); event.stopPropagation();
        if (url.origin !== window.location.origin || url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) return;
        if (url.pathname === new URL(frame.current!.src).pathname && url.hash) {
          doc.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: "smooth" });
          return;
        }
        const project = latest.current.projects.find(item => url.pathname === `/realisations/${item.slug}`);
        const article = latest.current.news.find(item => url.pathname === `/actualites/${item.slug}`);
        if (latest.current.editing && project) { latest.current.onTab("projects"); latest.current.onProject(project.id); setPanelOpen(true); }
        if (latest.current.editing && article) { latest.current.onTab("news"); latest.current.onNews(article.id); setPanelOpen(true); }
        setReady(false); setPath(url.pathname + url.hash);
      }
    };
    // A preview never submits public contact forms.
    const submit = (event: Event) => { event.preventDefault(); event.stopPropagation(); };
    doc.addEventListener("click", click, true);
    doc.addEventListener("submit", submit, true);
    cleanup.current = () => { observer.disconnect(); style.remove(); doc.removeEventListener("click", click, true); doc.removeEventListener("submit", submit, true); };
  }, [applyDrafts, selectField]);

  useEffect(() => {
    const ready = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === "frtp:preview-ready") attach();
    };
    window.addEventListener("message", ready);
    return () => window.removeEventListener("message", ready);
  }, [attach]);

  useEffect(() => {
    frame.current?.contentDocument?.documentElement.toggleAttribute("data-studio-edit", editing);
  }, [editing]);
  useEffect(() => { setReady(false); }, [path, revision]);
  useEffect(() => {
    drafts.current = {}; setDirty(false);
    Object.values(urls.current).forEach(URL.revokeObjectURL); urls.current = {};
    setRevision(value => value + 1); setReady(false);
  }, [settings]);
  useEffect(() => () => { cleanup.current(); Object.values(urls.current).forEach(URL.revokeObjectURL); }, []);
  useEffect(() => {
    if (activeTab === "studio" && previousTab.current !== "studio") {
      setPath(studioGroups.find(item => item.id === group)?.page ?? "/");
    }
    previousTab.current = activeTab;
    if (activeTab === "projects") {
      const item = projects.find(item => item.id === selectedProject);
      setPath(item ? `/realisations/${item.slug}` : "/realisations");
    } else if (activeTab === "news") {
      const item = news.find(item => item.id === selectedNews);
      setPath(item ? `/actualites/${item.slug}` : "/actualites");
    } else if (activeTab === "beforeAfter") setPath("/avant-apres");
  }, [activeTab, selectedProject, selectedNews, projects, news, group]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function change(event: React.FormEvent<HTMLDivElement>) {
    setDirty(true);
    const input = event.target as HTMLInputElement;
    if (!input.name) return;
    if (input.type === "file" && input.files?.[0]) {
      if (urls.current[input.name]) URL.revokeObjectURL(urls.current[input.name]);
      urls.current[input.name] = URL.createObjectURL(input.files[0]);
      drafts.current[input.name] = urls.current[input.name];
    } else if (input.type !== "file") drafts.current[input.name] = input.value;
    applyDrafts();
  }

  const selectedGroup = studioGroups.find(item => item.id === group)!;
  const pageLabel = pages.find(([route]) => route === path)?.[1] ?? "Détail";
  return (
    <div className={`visual-studio ${panelOpen && editing ? "has-editor" : ""}`}>
      <div className="studio-viewbar">
        <label className="studio-page-select">Page
          <select aria-label="Page à afficher" value={pages.some(([route]) => route === path) ? path : "detail"} onChange={event => { setPath(event.target.value); setReady(false); }}>
            {!pages.some(([route]) => route === path) && <option value="detail">Détail du contenu</option>}
            {pages.map(([route, label]) => <option key={route} value={route}>{label}</option>)}
          </select>
        </label>
        <div className="studio-device-switch" role="group" aria-label="Format d’aperçu">
          <button type="button" aria-label="Ordinateur" aria-pressed={!mobile} onClick={() => setMobile(false)}><Monitor size={17} /></button>
          <button type="button" aria-label="Téléphone" aria-pressed={mobile} onClick={() => setMobile(true)}><Smartphone size={17} /></button>
        </div>
        <span className="studio-save-state" role="status">{loading ? "En cours…" : dirty ? "Modifications à enregistrer" : "Version enregistrée"}</span>
        <button type="button" className="studio-mode-button" aria-pressed={editing} onClick={() => setEditing(value => !value)}><MousePointer2 size={15} />{editing ? "Modifier" : "Prévisualiser"}</button>
        <button type="button" aria-label={panelOpen ? "Masquer le panneau" : "Afficher le panneau"} onClick={() => { setPanelOpen(value => !value); setEditing(true); }}>{panelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}</button>
        <a href={path} target="_blank" rel="noopener noreferrer" aria-label="Ouvrir la page dans un nouvel onglet"><ArrowUpRight size={18} /></a>
      </div>
      <div className="studio-workspace">
        <div className="studio-canvas">
          <div className="studio-canvas-caption"><span>FRTP / {pageLabel}</span><span>{editing ? "Cliquez sur un élément pour le modifier" : "Aperçu du site"}</span></div>
          <div className={`studio-frame-wrap ${mobile ? "is-mobile" : ""}`}>
            {!ready && <div className="studio-frame-loading" role="status">Chargement de la page…</div>}
            <iframe ref={frame} title={`Aperçu du site — ${pageLabel}`} src={`${path.split("#")[0]}?studioPreview=${revision}${path.includes("#") ? `#${path.split("#")[1]}` : ""}`} onLoad={attach} />
          </div>
        </div>
        <aside className="studio-inspector" hidden={!editing || !panelOpen} aria-label="Panneau de modification">
          <div className="studio-inspector-heading"><span>MODIFICATION</span><h2>{activeTab === "studio" ? selectedGroup.label : activeTab === "projects" ? "Chantiers" : activeTab === "news" ? "Actualités" : activeTab === "requests" ? "Demandes reçues" : "Comparaisons avant / après"}</h2></div>
          {activeTab === "studio" && <label className="studio-section-select">Section à modifier<select aria-label="Section à modifier" value={group} onChange={event => {
            const selected = studioGroups.find(item => item.id === event.target.value)!;
            setGroup(selected.id); setPath(selected.page);
            const doc = frame.current?.contentDocument;
            const field = Array.from(doc?.querySelectorAll<HTMLElement>("[data-studio-field]") ?? []).find(node => selected.prefixes.some(prefix => node.dataset.studioField?.startsWith(prefix)));
            field?.scrollIntoView({ block: "center", behavior: "smooth" });
          }}>{studioGroups.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>}
          <div ref={panel} className="studio-editor-content" data-group={group} onChange={change} onInput={change} onClickCapture={event => {
            const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button");
            if (!button || button.type === "submit") return;
            const form = button.closest("form");
            if (!form) return;
            setDirty(true);
            requestAnimationFrame(() => {
              form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[name],textarea[name]").forEach(input => {
                if (input.type !== "file" && input.type !== "checkbox" && input.type !== "hidden") drafts.current[input.name] = input.value;
              });
              applyDrafts();
            });
          }}>{children}</div>
          <button type="button" className="studio-panel-back" onClick={() => setPanelOpen(false)}><ChevronLeft size={15} />Revenir à la page</button>
        </aside>
      </div>
    </div>
  );
}
