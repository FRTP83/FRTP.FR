"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Edit3,
  FileText,
  FolderKanban,
  ImagePlus,
  LogIn,
  LogOut,
  Newspaper,
  Settings2,
  RefreshCw,
  Save,
  Star,
  Trash2,
  Upload
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import { defaultBeforeAfterItems, type BeforeAfterItem } from "@/lib/before-after";
import { defaultProjectHeroSettings, normalizeProjectHeroSettings, type ProjectHeroSettings, type ProjectHeroSettingsMap } from "@/lib/project-hero";
import { defaultStudioSettings, type StudioReview, type StudioSettings } from "@/lib/studio";

type AdminStatus = "checking" | "signed-out" | "signed-in";
type TabId = "studio" | "beforeAfter" | "projects" | "news" | "requests";
type ImageType = "before" | "during" | "after" | "gallery";

type Category = { id: string; name: string; slug: string };
type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  image_type: ImageType;
  caption: string | null;
  sort_order: number | null;
};
type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  initial_problem: string | null;
  works_done: string | null;
  client_type: string | null;
  work_date: string | null;
  duration: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  project_images?: ProjectImage[];
};
type NewsRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
};
type RequestRow = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  city: string | null;
  work_type: string | null;
  message: string;
  status: string;
  created_at: string;
};

const tabs: Array<{ id: TabId; label: string; icon: typeof FolderKanban }> = [
  { id: "studio", label: "Studio", icon: Settings2 },
  { id: "beforeAfter", label: "Avant / Apres", icon: ImagePlus },
  { id: "projects", label: "Chantiers", icon: FolderKanban },
  { id: "news", label: "Actualités", icon: Newspaper },
  { id: "requests", label: "Demandes", icon: FileText }
];

export function AdminConsole() {
  const [status, setStatus] = useState<AdminStatus>("checking");
  const [activeTab, setActiveTab] = useState<TabId>("studio");
  const [notice, setNotice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [news, setNews] = useState<NewsRow[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [studioSettings, setStudioSettings] = useState<StudioSettings>(defaultStudioSettings);
  const [projectHeroSettings, setProjectHeroSettings] = useState<ProjectHeroSettingsMap>({});
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>(defaultBeforeAfterItems);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("new");
  const [selectedNewsId, setSelectedNewsId] = useState<string>("new");
  const [loading, setLoading] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );
  const selectedNews = useMemo(
    () => news.find((item) => item.id === selectedNewsId) ?? null,
    [news, selectedNewsId]
  );
  const selectedProjectHeroSettings = useMemo(
    () => selectedProject ? normalizeProjectHeroSettings(projectHeroSettings[selectedProject.id]) : defaultProjectHeroSettings,
    [projectHeroSettings, selectedProject]
  );

  useEffect(() => {
    if (!supabase) {
      setStatus("signed-out");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const signedIn = Boolean(data.session);
      setStatus(signedIn ? "signed-in" : "signed-out");
      if (signedIn) {
        refreshAdminData();
      }
    });
  }, []);

  async function refreshAdminData() {
    if (!supabase) return;
    setLoading(true);

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const [categoryResult, projectResult, newsResult, requestResult, studioResult, beforeAfterResult, projectHeroResult] = await Promise.all([
      supabase.from("project_categories").select("id,name,slug").order("name"),
      supabase
        .from("projects")
        .select("id,title,slug,city,category_id,short_description,description,initial_problem,works_done,client_type,work_date,duration,is_published,is_featured,created_at,project_images(id,project_id,image_url,image_type,caption,sort_order)")
        .order("created_at", { ascending: false }),
      supabase.from("news").select("id,title,slug,excerpt,content,cover_image_url,is_published,created_at").order("created_at", { ascending: false }),
      supabase.from("contact_requests").select("id,name,company,email,phone,city,work_type,message,status,created_at").order("created_at", { ascending: false }),
      token
        ? fetch("/api/admin/studio", { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => ({
            data: response.ok ? await response.json() : null,
            error: response.ok ? null : await response.json().catch(() => ({ error: "Studio non charge." }))
          }))
        : Promise.resolve({ data: null, error: null }),
      token
        ? fetch("/api/admin/before-after", { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => ({
            data: response.ok ? await response.json() : null,
            error: response.ok ? null : await response.json().catch(() => ({ error: "Avant / Apres non charge." }))
          }))
        : Promise.resolve({ data: null, error: null }),
      token
        ? fetch("/api/admin/project-hero-settings", { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => ({
            data: response.ok ? await response.json() : null,
            error: response.ok ? null : await response.json().catch(() => ({ error: "Bandeaux chantiers non charges." }))
          }))
        : Promise.resolve({ data: null, error: null })
    ]);

    if (categoryResult.data) setCategories(categoryResult.data as Category[]);
    if (projectResult.data) setProjects(projectResult.data as unknown as ProjectRow[]);
    if (newsResult.data) setNews(newsResult.data as NewsRow[]);
    if (requestResult.data) setRequests(requestResult.data as RequestRow[]);
    if (studioResult.data?.settings) {
      setStudioSettings(studioResult.data.settings as StudioSettings);
    }
    if (beforeAfterResult.data?.items) {
      setBeforeAfterItems(beforeAfterResult.data.items as BeforeAfterItem[]);
    }
    if (projectHeroResult.data?.settings) {
      setProjectHeroSettings(projectHeroResult.data.settings as ProjectHeroSettingsMap);
    }

    const firstError = categoryResult.error ?? projectResult.error ?? newsResult.error ?? requestResult.error;
    if (firstError) setNotice(firstError.message);
    if (studioResult.error?.error) setNotice(studioResult.error.error);
    if (beforeAfterResult.error?.error) setNotice(beforeAfterResult.error.error);
    if (projectHeroResult.error?.error) setNotice(projectHeroResult.error.error);
    setLoading(false);
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const form = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password"))
    });

    if (error) {
      setNotice(error.message);
      return;
    }

    setNotice("");
    setStatus("signed-in");
    refreshAdminData();
  }

  async function signOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
    setStatus("signed-out");
    setCategories([]);
    setProjects([]);
    setNews([]);
    setRequests([]);
    setNotice("");
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title"));
    const payload = {
      title,
      slug: String(formData.get("slug") || slugify(title)),
      city: nullable(formData.get("city")),
      category_id: nullable(formData.get("category_id")),
      short_description: nullable(formData.get("short_description")),
      description: nullable(formData.get("description")),
      initial_problem: nullable(formData.get("initial_problem")),
      works_done: nullable(formData.get("works_done")),
      client_type: nullable(formData.get("client_type")),
      duration: nullable(formData.get("duration")),
      work_date: nullable(formData.get("work_date")),
      is_featured: formData.get("is_featured") === "on",
      is_published: formData.get("is_published") === "on",
      updated_at: new Date().toISOString()
    };

    const result = selectedProject
      ? await supabase.from("projects").update(payload).eq("id", selectedProject.id).select("id").single()
      : await supabase.from("projects").insert(payload).select("id").single();

    if (result.error || !result.data) {
      setNotice(result.error?.message ?? "Chantier non enregistré.");
      setLoading(false);
      return;
    }

    const image = formData.get("image") as File | null;
    if (image && image.size > 0) {
      await uploadProjectImage(result.data.id, image, "gallery", title, 0);
    }

    await saveProjectHeroSettings(result.data.id, heroSettingsFromForm(formData));

    setSelectedProjectId(result.data.id);
    setNotice(selectedProject ? "Chantier modifié." : "Chantier ajouté.");
    await refreshAdminData();
  }

  async function uploadProjectImage(projectId: string, image: File, imageType: ImageType, caption: string, sortOrder: number) {
    if (!supabase) return;
    const filePath = `projects/${projectId}/${Date.now()}-${slugify(image.name)}`;
    const upload = await supabase.storage.from("project-images").upload(filePath, image);
    if (upload.error) {
      setNotice(upload.error.message);
      return;
    }

    const publicUrl = supabase.storage.from("project-images").getPublicUrl(filePath);
    const { error } = await supabase.from("project_images").insert({
      project_id: projectId,
      image_url: publicUrl.data.publicUrl,
      image_type: imageType,
      caption,
      sort_order: sortOrder
    });

    if (error) setNotice(error.message);
  }

  async function saveProjectHeroSettings(projectId: string, settings: ProjectHeroSettings) {
    if (!supabase) return;

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      setNotice("Session admin expiree. Reconnectez-vous.");
      return;
    }

    const response = await fetch("/api/admin/project-hero-settings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ projectId, settings })
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setNotice(data?.error ?? "Reglages bandeau non enregistres.");
      return;
    }

    if (data?.settings) {
      setProjectHeroSettings(data.settings as ProjectHeroSettingsMap);
    }
  }

  function updateLocalProjectHeroSettings(projectId: string, settings: ProjectHeroSettings) {
    setProjectHeroSettings((current) => ({
      ...current,
      [projectId]: settings
    }));
  }

  async function addProjectPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProject) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const image = formData.get("image") as File | null;

    if (!image || image.size === 0) {
      setNotice("Choisissez une photo.");
      return;
    }

    setLoading(true);
    await uploadProjectImage(
      selectedProject.id,
      image,
      String(formData.get("image_type")) as ImageType,
      String(formData.get("caption") || selectedProject.title),
      Number(formData.get("sort_order") || 0)
    );
    form.reset();
    setNotice("Photo ajoutee au chantier.");
    await refreshAdminData();
  }

  async function deleteProjectImage(imageId: string) {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("project_images").delete().eq("id", imageId);
    setNotice(error ? error.message : "Photo supprimée.");
    await refreshAdminData();
  }

  async function updateProjectImage(imageId: string, values: Partial<Pick<ProjectImage, "image_type" | "caption" | "sort_order">>) {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("project_images").update(values).eq("id", imageId);
    setNotice(error ? error.message : "Photo mise a jour.");
    await refreshAdminData();
  }

  async function reorderProjectImages(photos: ProjectImage[]) {
    if (!supabase) return;
    const supabaseClient = supabase;
    setLoading(true);
    const updates = await Promise.all(
      photos.map((photo, index) =>
        supabaseClient
          .from("project_images")
          .update({ sort_order: index })
          .eq("id", photo.id)
      )
    );
    const error = updates.find((result) => result.error)?.error;
    setNotice(error ? error.message : "Ordre des photos mis a jour.");
    await refreshAdminData();
  }

  async function deleteProject(projectId: string) {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    setNotice(error ? error.message : "Chantier supprimé.");
    setSelectedProjectId("new");
    await refreshAdminData();
  }

  async function saveNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title"));
    let coverImageUrl = selectedNews?.cover_image_url ?? null;
    const image = formData.get("image") as File | null;

    if (image && image.size > 0) {
      const filePath = `news/${Date.now()}-${slugify(image.name)}`;
      const upload = await supabase.storage.from("news-images").upload(filePath, image);
      if (upload.error) {
        setNotice(upload.error.message);
        setLoading(false);
        return;
      }
      coverImageUrl = supabase.storage.from("news-images").getPublicUrl(filePath).data.publicUrl;
    }

    const payload = {
      title,
      slug: String(formData.get("slug") || slugify(title)),
      excerpt: nullable(formData.get("excerpt")),
      content: nullable(formData.get("content")),
      cover_image_url: coverImageUrl,
      is_published: formData.get("is_published") === "on",
      updated_at: new Date().toISOString()
    };

    const result = selectedNews
      ? await supabase.from("news").update(payload).eq("id", selectedNews.id).select("id").single()
      : await supabase.from("news").insert(payload).select("id").single();

    if (result.error || !result.data) {
      setNotice(result.error?.message ?? "Actualité non enregistrée.");
      setLoading(false);
      return;
    }

    setSelectedNewsId(result.data.id);
    setNotice(selectedNews ? "Actualité modifiée." : "Actualité ajoutée.");
    await refreshAdminData();
  }

  async function deleteNews(newsId: string) {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("news").delete().eq("id", newsId);
    setNotice(error ? error.message : "Actualité supprimée.");
    setSelectedNewsId("new");
    await refreshAdminData();
  }

  async function updateRequestStatus(id: string, statusValue: string) {
    if (!supabase) return;
    await supabase.from("contact_requests").update({ status: statusValue }).eq("id", id);
    await refreshAdminData();
  }

  async function saveStudio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("current", JSON.stringify(studioSettings));

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      setNotice("Session admin expiree. Reconnectez-vous.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/studio", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setNotice(data?.error ?? "Studio non enregistré.");
      setLoading(false);
      return;
    }

    setStudioSettings(data.settings);
    setNotice("Studio enregistré. Les pages publiques utilisent maintenant ces réglages.");
    setLoading(false);
    await refreshAdminData();
  }

  async function saveBeforeAfter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const form = event.currentTarget;
    setLoading(true);
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      setNotice("Session admin expiree. Reconnectez-vous.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/before-after", {
      method: "POST",
      body: new FormData(form),
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setNotice(data?.error ?? "Avant / Apres non enregistre.");
      setLoading(false);
      return;
    }

    setBeforeAfterItems(data.items as BeforeAfterItem[]);
    setNotice("Avant / Apres enregistre.");
    setLoading(false);
    await refreshAdminData();
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="border-l-4 border-frtp-orange bg-white p-6">
        <h2 className="text-2xl font-black text-zinc-950">Supabase a connecter</h2>
        <p className="mt-3 leading-7 text-zinc-600">
          Créez .env.local avec les clés Supabase, exécutez le schéma SQL, puis créez un utilisateur dans Supabase Auth. L'admin sera ensuite utilisable pour modifier chantiers, actualités, photos et demandes.
        </p>
      </div>
    );
  }

  if (status !== "signed-in") {
    return (
      <form onSubmit={signIn} className="grid max-w-md gap-5 border border-zinc-200 bg-white p-6 shadow-technical">
        <h2 className="text-2xl font-black text-zinc-950">Connexion admin</h2>
        <Field label="Email" name="email" type="email" required />
        <Field label="Mot de passe" name="password" type="password" required />
        {notice ? <p className="text-sm font-semibold text-red-700">{notice}</p> : null}
        <button className="inline-flex items-center justify-center gap-2 bg-frtp-blue px-5 py-4 text-sm font-black text-white">
          <LogIn size={18} />
          Se connecter
        </button>
      </form>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 border border-zinc-200 bg-white p-4 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? "inline-flex items-center gap-2 bg-zinc-950 px-4 py-3 text-sm font-black text-white" : "inline-flex items-center gap-2 bg-frtp-gray px-4 py-3 text-sm font-black text-zinc-700"}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={refreshAdminData} className="inline-flex items-center justify-center gap-2 border border-zinc-200 px-4 py-3 text-sm font-black text-zinc-800">
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
          <button onClick={signOut} className="inline-flex items-center justify-center gap-2 border border-red-200 px-4 py-3 text-sm font-black text-red-700">
            <LogOut size={17} />
            Se deconnecter
          </button>
        </div>
      </div>

      {notice ? <p className="border-l-4 border-frtp-blue bg-white p-4 text-sm font-semibold text-zinc-700">{notice}</p> : null}

      {activeTab === "studio" ? (
        <StudioForm
          key={JSON.stringify(studioSettings)}
          settings={studioSettings}
          onSubmit={saveStudio}
          loading={loading}
        />
      ) : null}

      {activeTab === "beforeAfter" ? (
        <BeforeAfterForm
          items={beforeAfterItems}
          onSubmit={saveBeforeAfter}
          loading={loading}
        />
      ) : null}

      {activeTab === "projects" ? (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <EntityList
            title="Chantiers"
            newLabel="Nouveau chantier"
            selectedId={selectedProjectId}
            onNew={() => setSelectedProjectId("new")}
            rows={projects.map((project) => ({
              id: project.id,
              title: project.title,
              meta: `${project.city ?? "Sans commune"} - ${project.is_published ? "publié" : "brouillon"}`
            }))}
            onSelect={setSelectedProjectId}
          />
          <div className="grid gap-6">
            <ProjectForm
              key={selectedProject?.id ?? "new-project"}
              categories={categories}
              project={selectedProject}
              heroSettings={selectedProjectHeroSettings}
              onHeroSettingsChange={updateLocalProjectHeroSettings}
              onSubmit={saveProject}
              loading={loading}
              onDelete={deleteProject}
            />
            {selectedProject ? (
              <ProjectPhotos
                project={selectedProject}
                heroSettings={selectedProjectHeroSettings}
                onSubmit={addProjectPhoto}
                onDelete={deleteProjectImage}
                onUpdate={updateProjectImage}
                onSetHeroImage={(imageUrl) => {
                  const nextSettings = normalizeProjectHeroSettings({
                    ...selectedProjectHeroSettings,
                    imageUrl
                  });
                  updateLocalProjectHeroSettings(selectedProject.id, nextSettings);
                  saveProjectHeroSettings(selectedProject.id, nextSettings);
                }}
                onReorder={reorderProjectImages}
                loading={loading}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {activeTab === "news" ? (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <EntityList
            title="Actualités"
            newLabel="Nouvelle actualité"
            selectedId={selectedNewsId}
            onNew={() => setSelectedNewsId("new")}
            rows={news.map((item) => ({
              id: item.id,
              title: item.title,
              meta: item.is_published ? "publiée" : "brouillon"
            }))}
            onSelect={setSelectedNewsId}
          />
          <NewsForm key={selectedNews?.id ?? "new-news"} news={selectedNews} onSubmit={saveNews} loading={loading} onDelete={deleteNews} />
        </div>
      ) : null}

      {activeTab === "requests" ? (
        <RequestsList requests={requests} onStatusChange={updateRequestStatus} />
      ) : null}
    </div>
  );
}

function EntityList({
  title,
  newLabel,
  rows,
  selectedId,
  onSelect,
  onNew
}: {
  title: string;
  newLabel: string;
  rows: Array<{ id: string; title: string; meta: string }>;
  selectedId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <aside className="border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-zinc-950">{title}</h2>
        <button type="button" onClick={onNew} className="bg-frtp-blue px-3 py-2 text-xs font-black text-white">
          {newLabel}
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {rows.length ? rows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => onSelect(row.id)}
            className={selectedId === row.id ? "border-l-4 border-frtp-orange bg-frtp-gray p-3 text-left" : "border-l-4 border-transparent bg-white p-3 text-left hover:bg-frtp-gray"}
          >
            <span className="block font-black text-zinc-950">{row.title}</span>
            <span className="mt-1 block text-xs font-semibold text-zinc-500">{row.meta}</span>
          </button>
        )) : (
          <p className="bg-frtp-gray p-4 text-sm font-semibold text-zinc-600">Aucun element.</p>
        )}
      </div>
    </aside>
  );
}

function BeforeAfterForm({
  items,
  onSubmit,
  loading
}: {
  items: BeforeAfterItem[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  const [localItems, setLocalItems] = useState<BeforeAfterItem[]>(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  function addItem() {
    setLocalItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: "",
        city: "",
        category: "Travaux publics",
        before: "/chantier/bastide-jessica.jpeg",
        after: "/chantier/park-sainte-estelle.jpg",
        sortOrder: current.length,
        isPublished: true
      }
    ]);
  }

  function removeItem(index: number) {
    setLocalItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setLocalItems((current) => {
      const next = [...current];
      const target = index + direction;

      if (target < 0 || target >= next.length) return current;

      [next[index], next[target]] = [next[target], next[index]];
      return next.map((item, itemIndex) => ({ ...item, sortOrder: itemIndex }));
    });
  }

  function updateItem(index: number, key: keyof BeforeAfterItem, value: string | boolean | number) {
    setLocalItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [key]: value } : item
    )));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <section className="border border-zinc-200 bg-white p-6 shadow-technical">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <FormTitle icon={ImagePlus} title="Avant / Apres" />
            <p className="mt-3 max-w-3xl leading-7 text-zinc-600">
              Ajoutez les comparaisons visibles sur la page Avant / Apres. Chaque bloc contient une photo avant, une photo apres, une commune et une categorie.
            </p>
          </div>
          <button type="button" onClick={addItem} className="bg-frtp-blue px-4 py-3 text-sm font-black text-white">
            Ajouter un avant / apres
          </button>
        </div>
      </section>

      <input type="hidden" name="itemsLength" value={localItems.length} />

      <div className="grid gap-6">
        {localItems.map((item, index) => (
          <section key={item.id} className="border border-zinc-200 bg-white p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-frtp-blue">Comparaison {index + 1}</p>
                <h3 className="mt-2 text-xl font-black text-zinc-950">{item.title || "Nouveau avant / apres"}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} className="border border-zinc-300 px-3 py-2 text-xs font-black text-zinc-700 disabled:opacity-40">
                  Monter
                </button>
                <button type="button" onClick={() => moveItem(index, 1)} disabled={index === localItems.length - 1} className="border border-zinc-300 px-3 py-2 text-xs font-black text-zinc-700 disabled:opacity-40">
                  Descendre
                </button>
                <button type="button" onClick={() => removeItem(index)} className="border border-red-200 px-3 py-2 text-xs font-black text-red-700">
                  Supprimer
                </button>
              </div>
            </div>

            <input type="hidden" name={`itemId${index}`} value={item.id} />
            <input type="hidden" name={`itemBeforeCurrent${index}`} value={item.before} />
            <input type="hidden" name={`itemAfterCurrent${index}`} value={item.after} />
            <input type="hidden" name={`itemSortOrder${index}`} value={index} />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Titre
                <input name={`itemTitle${index}`} value={item.title} onChange={(event) => updateItem(index, "title", event.target.value)} className="h-12 border border-zinc-300 px-3 font-normal outline-none focus:border-frtp-blue" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Commune
                <input name={`itemCity${index}`} value={item.city} onChange={(event) => updateItem(index, "city", event.target.value)} className="h-12 border border-zinc-300 px-3 font-normal outline-none focus:border-frtp-blue" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Categorie
                <input name={`itemCategory${index}`} value={item.category} onChange={(event) => updateItem(index, "category", event.target.value)} className="h-12 border border-zinc-300 px-3 font-normal outline-none focus:border-frtp-blue" />
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input name={`itemPublished${index}`} type="checkbox" checked={item.isPublished} onChange={(event) => updateItem(index, "isPublished", event.target.checked)} className="h-4 w-4" />
                Publier sur le site
              </label>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <BeforeAfterImageField label="Photo avant" name={`itemBefore${index}`} src={item.before} />
              <BeforeAfterImageField label="Photo apres" name={`itemAfter${index}`} src={item.after} />
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <SubmitButton loading={loading} label="Enregistrer les avant / apres" />
      </div>
    </form>
  );
}

function BeforeAfterImageField({ label, name, src }: { label: string; name: string; src: string }) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-bold text-zinc-800">{label}</p>
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} className="h-full w-full object-cover" />
      </div>
      <input name={name} type="file" accept="image/*" className="border border-zinc-300 bg-white px-3 py-3 text-sm file:mr-3 file:border-0 file:bg-frtp-gray file:px-3 file:py-2 file:text-sm file:font-bold" />
    </div>
  );
}

function StudioForm({
  settings,
  onSubmit,
  loading
}: {
  settings: StudioSettings;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  const [reviewFields, setReviewFields] = useState<StudioReview[]>(settings.reviews);

  useEffect(() => {
    setReviewFields(settings.reviews);
  }, [settings.reviews]);

  function addReview() {
    setReviewFields((current) => [
      ...current,
      {
        author: "",
        rating: "5",
        text: "",
        source: "Google"
      }
    ]);
  }

  function removeReview(index: number) {
    setReviewFields((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveReview(index: number, direction: -1 | 1) {
    setReviewFields((current) => {
      const next = [...current];
      const target = index + direction;

      if (target < 0 || target >= next.length) return current;

      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateReview(index: number, key: keyof StudioReview, value: string) {
    setReviewFields((current) => current.map((review, itemIndex) => (
      itemIndex === index ? { ...review, [key]: value } : review
    )));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <section className="border border-zinc-200 bg-white p-6 shadow-technical">
        <FormTitle icon={Settings2} title="Studio du site" />
        <p className="mt-3 max-w-3xl leading-7 text-zinc-600">
          Ces réglages pilotent les textes et les images globales des pages principales. Les chantiers, actualités et photos détaillées restent gérés dans leurs onglets dédiés.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="border border-zinc-200 bg-white p-6">
          <h3 className="text-xl font-black text-zinc-950">Accueil - Hero</h3>
          <div className="mt-5 grid gap-5">
            <Field label="Surtitre" name="heroEyebrow" defaultValue={settings.heroEyebrow} />
            <Field label="Titre principal" name="heroTitle" defaultValue={settings.heroTitle} />
            <TextArea label="Sous-titre" name="heroSubtitle" defaultValue={settings.heroSubtitle} />
            <Field label="Surtitre du panneau de droite" name="heroPanelEyebrow" defaultValue={settings.heroPanelEyebrow} />
            <Field label="Texte du panneau de droite" name="heroPanelTitle" defaultValue={settings.heroPanelTitle} />
            <TextArea label="Liste du panneau de droite" name="heroPanelItems" defaultValue={settings.heroPanelItems.join("\n")} />
            <ImageField label="Image hero" name="heroImage" src={settings.heroImage} />
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-6">
          <h3 className="text-xl font-black text-zinc-950">Entreprise</h3>
          <div className="mt-5 grid gap-5">
            <Field label="Titre page entreprise" name="companyTitle" defaultValue={settings.companyTitle} />
            <TextArea label="Texte de presentation" name="companyIntro" defaultValue={settings.companyIntro} />
            <ImageField label="Image entreprise" name="companyImage" src={settings.companyImage} />
            {settings.companyCards.map((card, index) => (
              <div key={index} className="grid gap-3 border border-zinc-200 bg-frtp-gray p-4">
                <Field label={`Bloc entreprise ${index + 1} - titre`} name={`companyCardTitle${index}`} defaultValue={card.title} />
                <TextArea label={`Bloc entreprise ${index + 1} - texte`} name={`companyCardText${index}`} defaultValue={card.text} />
              </div>
            ))}
            <TextArea label="Piliers entreprise" name="companyPillars" defaultValue={settings.companyPillars.join("\n")} />
            <TextArea label="Zones d'intervention" name="serviceArea" defaultValue={settings.serviceArea.join("\n")} />
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-6">
          <h3 className="text-xl font-black text-zinc-950">Méthode terrain</h3>
          <div className="mt-5 grid gap-5">
            <Field label="Titre" name="methodTitle" defaultValue={settings.methodTitle} />
            <TextArea label="Texte" name="methodText" defaultValue={settings.methodText} />
            {settings.methodSteps.map((step, index) => (
              <div key={index} className="grid gap-3 border border-zinc-200 bg-frtp-gray p-4">
                <Field label={`Étape ${index + 1} - numéro`} name={`methodStepNumber${index}`} defaultValue={step.number} />
                <Field label={`Etape ${index + 1} - titre`} name={`methodStepTitle${index}`} defaultValue={step.title} />
                <TextArea label={`Etape ${index + 1} - texte`} name={`methodStepText${index}`} defaultValue={step.text} />
              </div>
            ))}
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-6">
          <h3 className="text-xl font-black text-zinc-950">Avant / Après</h3>
          <div className="mt-5 grid gap-5">
            <Field label="Titre" name="beforeAfterTitle" defaultValue={settings.beforeAfterTitle} />
            <TextArea label="Texte" name="beforeAfterText" defaultValue={settings.beforeAfterText} />
            <ImageField label="Image avant" name="beforeImage" src={settings.beforeImage} />
            <ImageField label="Image après" name="afterImage" src={settings.afterImage} />
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-6 xl:col-span-2">
          <h3 className="text-xl font-black text-zinc-950">Accueil - sections et chiffres</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {settings.stats.map((stat, index) => (
              <div key={index} className="grid gap-3 border border-zinc-200 bg-frtp-gray p-4">
                <Field label={`Chiffre ${index + 1}`} name={`statValue${index}`} defaultValue={stat.value} />
                <Field label={`Libelle ${index + 1}`} name={`statLabel${index}`} defaultValue={stat.label} />
              </div>
            ))}
            <Field label="Titre section activités accueil" name="homeActivitiesTitle" defaultValue={settings.homeActivitiesTitle} />
            <TextArea label="Texte section activités accueil" name="homeActivitiesText" defaultValue={settings.homeActivitiesText} />
            <Field label="Titre section réalisations accueil" name="homeProjectsTitle" defaultValue={settings.homeProjectsTitle} />
            <TextArea label="Texte section réalisations accueil" name="homeProjectsText" defaultValue={settings.homeProjectsText} />
            <Field label="Surtitre section avis" name="reviewsEyebrow" defaultValue={settings.reviewsEyebrow} />
            <Field label="Titre section avis" name="reviewsTitle" defaultValue={settings.reviewsTitle} />
            <TextArea label="Texte section avis" name="reviewsText" defaultValue={settings.reviewsText} />
            <Field label="Note globale affichee a gauche, ex : 4,5" name="reviewsRating" defaultValue={settings.reviewsRating} />
            <Field label="Libelle affiche sous la note" name="reviewsCount" defaultValue={settings.reviewsCount} />
            <Field label="Lien Google avis" name="reviewsGoogleUrl" defaultValue={settings.reviewsGoogleUrl} />
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3 border border-zinc-200 bg-white p-4">
                <div>
                  <p className="font-black text-zinc-950">Avis affiches sur l'accueil</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-500">La note globale reste manuelle. Les avis ci-dessous sont affiches dans cet ordre.</p>
                </div>
                <button type="button" onClick={addReview} className="bg-frtp-blue px-4 py-3 text-sm font-black text-white">
                  Ajouter un avis
                </button>
              </div>
            </div>
            <input type="hidden" name="reviewsLength" value={reviewFields.length} />
            <div className="grid gap-5 md:col-span-2 md:grid-cols-2 xl:grid-cols-3">
              {reviewFields.map((review, index) => (
                <div key={`${index}-${review.author}-${review.text.slice(0, 24)}`} className="grid gap-3 border border-zinc-200 bg-frtp-gray p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-frtp-blue">Avis {index + 1}</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => moveReview(index, -1)} disabled={index === 0} className="border border-zinc-300 bg-white px-2 py-1 text-xs font-black text-zinc-700 disabled:opacity-40">
                        Monter
                      </button>
                      <button type="button" onClick={() => moveReview(index, 1)} disabled={index === reviewFields.length - 1} className="border border-zinc-300 bg-white px-2 py-1 text-xs font-black text-zinc-700 disabled:opacity-40">
                        Descendre
                      </button>
                    </div>
                  </div>
                  <label className="grid gap-2 text-sm font-bold">
                    Nom
                    <input name={`reviewAuthor${index}`} value={review.author} onChange={(event) => updateReview(index, "author", event.target.value)} className="h-12 border border-zinc-300 px-3 font-normal outline-none focus:border-frtp-blue" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold">
                    Note, ex : 4,5
                    <input name={`reviewRating${index}`} value={review.rating} onChange={(event) => updateReview(index, "rating", event.target.value)} className="h-12 border border-zinc-300 px-3 font-normal outline-none focus:border-frtp-blue" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold">
                    Texte de l'avis
                    <textarea name={`reviewText${index}`} rows={4} value={review.text} onChange={(event) => updateReview(index, "text", event.target.value)} className="resize-none border border-zinc-300 px-3 py-3 font-normal outline-none focus:border-frtp-blue" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold">
                    Source
                    <input name={`reviewSource${index}`} value={review.source} onChange={(event) => updateReview(index, "source", event.target.value)} className="h-12 border border-zinc-300 px-3 font-normal outline-none focus:border-frtp-blue" />
                  </label>
                  <button type="button" onClick={() => removeReview(index)} className="border border-red-200 bg-white px-4 py-3 text-sm font-black text-red-700">
                    Supprimer cet avis
                  </button>
                </div>
              ))}
            </div>
            <div className="md:col-span-2">
              <Field label="Titre appel a l'action bas de page" name="homeCtaTitle" defaultValue={settings.homeCtaTitle} />
            </div>
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-6 xl:col-span-2">
          <h3 className="text-xl font-black text-zinc-950">Pages Activités</h3>
          <div className="mt-5 grid gap-5">
            <Field label="Titre page Activités" name="activitiesPageTitle" defaultValue={settings.activitiesPageTitle} />
            <TextArea label="Texte page Activités" name="activitiesPageText" defaultValue={settings.activitiesPageText} />
            <div className="grid gap-5 md:grid-cols-2">
              {settings.activities.map((activity) => (
                <div key={activity.slug} className="grid gap-3 border border-zinc-200 bg-frtp-gray p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-frtp-blue">{activity.slug}</p>
                  <Field label="Titre" name={`activityTitle-${activity.slug}`} defaultValue={activity.title} />
                  <TextArea label="Description" name={`activityDescription-${activity.slug}`} defaultValue={activity.description} />
                  <TextArea label="Prestations" name={`activityServices-${activity.slug}`} defaultValue={activity.services.join("\n")} />
                  <TextArea label="Exemple d'intervention" name={`activityIntervention-${activity.slug}`} defaultValue={activity.interventionExample} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-6 xl:col-span-2">
          <h3 className="text-xl font-black text-zinc-950">Pages Réalisations et Actualités</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Titre page Réalisations" name="projectsPageTitle" defaultValue={settings.projectsPageTitle} />
            <TextArea label="Texte page Réalisations" name="projectsPageText" defaultValue={settings.projectsPageText} />
            <Field label="Titre page Actualités" name="newsPageTitle" defaultValue={settings.newsPageTitle} />
            <TextArea label="Texte page Actualités" name="newsPageText" defaultValue={settings.newsPageText} />
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-6 xl:col-span-2">
          <h3 className="text-xl font-black text-zinc-950">Page Contact et coordonnées</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Titre contact" name="contactTitle" defaultValue={settings.contactTitle} />
            <TextArea label="Texte d'intro de la page contact" name="contactPageText" defaultValue={settings.contactPageText} />
            <Field label="Téléphone" name="phone" defaultValue={settings.phone} />
            <Field label="Email" name="email" defaultValue={settings.email} />
            <Field label="Adresse / implantation" name="address" defaultValue={settings.address} />
            <div className="md:col-span-2">
            <TextArea label="Texte contact" name="contactText" defaultValue={settings.contactText} richHint />
            </div>
            <div className="md:col-span-2">
              <TextArea label="Texte du pied de page" name="footerText" defaultValue={settings.footerText} />
            </div>
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-6 xl:col-span-2">
          <h3 className="text-xl font-black text-zinc-950">Pages legales</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Titre mentions legales" name="legalTitle" defaultValue={settings.legalTitle} />
            <Field label="Titre confidentialite" name="privacyTitle" defaultValue={settings.privacyTitle} />
            <TextArea label="Texte mentions legales" name="legalText" defaultValue={settings.legalText} rows={12} richHint />
            <TextArea label="Texte confidentialite" name="privacyText" defaultValue={settings.privacyText} rows={12} richHint />
          </div>
        </section>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <SubmitButton loading={loading} label="Enregistrer le studio" />
      </div>
    </form>
  );
}

function ImageField({ label, name, src }: { label: string; name: string; src: string }) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-bold text-zinc-800">{label}</p>
      <div className="relative aspect-[16/8] overflow-hidden bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={src} src={src} alt={label} className="h-full w-full object-cover" />
      </div>
      <p className="break-all bg-frtp-gray p-2 text-xs font-semibold text-zinc-600">
        Image actuellement enregistrée : {src}
      </p>
      <input name={name} type="file" accept="image/*" className="border border-zinc-300 bg-white px-3 py-3 text-sm file:mr-3 file:border-0 file:bg-frtp-gray file:px-3 file:py-2 file:text-sm file:font-bold" />
    </div>
  );
}

function ProjectForm({
  categories,
  project,
  heroSettings,
  onHeroSettingsChange,
  onSubmit,
  loading,
  onDelete
}: {
  categories: Category[];
  project: ProjectRow | null;
  heroSettings: ProjectHeroSettings;
  onHeroSettingsChange: (projectId: string, settings: ProjectHeroSettings) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-5 border border-zinc-200 bg-white p-6 shadow-technical">
      <FormTitle icon={project ? Edit3 : FolderKanban} title={project ? "Modifier le chantier" : "Ajouter un chantier"} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Titre" name="title" defaultValue={project?.title} required />
        <Field label="Slug" name="slug" defaultValue={project?.slug} />
        <Field label="Commune" name="city" defaultValue={project?.city} required />
        <label className="grid gap-2 text-sm font-bold">
          Catégorie
          <select name="category_id" defaultValue={project?.category_id ?? ""} className="h-12 border border-zinc-300 bg-white px-3 font-normal outline-none focus:border-frtp-blue">
            <option value="">Sans catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <Field label="Date chantier" name="work_date" type="date" defaultValue={project?.work_date ?? ""} />
        <Field label="Duree" name="duration" defaultValue={project?.duration} />
        <Field label="Type de client" name="client_type" defaultValue={project?.client_type} />
        <Field label="Ajouter une photo principale" name="image" type="file" />
      </div>
      <TextArea label="Description courte" name="short_description" defaultValue={project?.short_description} />
      <TextArea label="Description détaillée" name="description" defaultValue={project?.description} />
      <TextArea label="Problematique initiale" name="initial_problem" defaultValue={project?.initial_problem} />
      <TextArea
        label="Travaux realises"
        name="works_done"
        placeholder={"Une intervention par ligne\nEx : Pose des regards AEP\nEx : Creation des tranchees techniques"}
        defaultValue={project?.works_done}
        richHint
      />
      {project ? (
        <ProjectHeroEditor
          project={project}
          settings={heroSettings}
          onSettingsChange={(settings) => onHeroSettingsChange(project.id, settings)}
        />
      ) : null}
      <PublishControls published={project?.is_published} featured={project?.is_featured} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton loading={loading} label={project ? "Enregistrer les modifications" : "Créer le chantier"} />
        {project ? <DangerButton label="Supprimer le chantier" onClick={() => onDelete(project.id)} /> : null}
      </div>
    </form>
  );
}

function ProjectHeroEditor({
  project,
  settings,
  onSettingsChange
}: {
  project: ProjectRow;
  settings: ProjectHeroSettings;
  onSettingsChange: (settings: ProjectHeroSettings) => void;
}) {
  const photos = useMemo(
    () => [...(project.project_images ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [project.project_images]
  );
  const fallbackImage = settings.imageUrl || photos[0]?.image_url || "";
  const [draft, setDraft] = useState<ProjectHeroSettings>(() => normalizeProjectHeroSettings({
    ...settings,
    imageUrl: fallbackImage
  }));

  useEffect(() => {
    setDraft(normalizeProjectHeroSettings({
      ...settings,
      imageUrl: settings.imageUrl || photos[0]?.image_url || ""
    }));
  }, [project.id, settings, photos]);

  function updateDraft(values: Partial<ProjectHeroSettings>) {
    const nextSettings = normalizeProjectHeroSettings({
      ...draft,
      ...values
    });
    setDraft(nextSettings);
    onSettingsChange(nextSettings);
  }

  return (
    <section className="grid gap-5 border border-zinc-200 bg-frtp-gray p-4 md:p-5">
      <div>
        <h3 className="text-lg font-black text-zinc-950">Image principale du chantier</h3>
        <p className="mt-1 text-sm font-semibold text-zinc-600">
          Reglez ici le bandeau visible quand on ouvre la page du chantier. Le rendu ci-dessous se met a jour immediatement.
        </p>
      </div>

      <input type="hidden" name="hero_image_url" value={draft.imageUrl} />
      <input type="hidden" name="hero_position_x" value={draft.positionX} />
      <input type="hidden" name="hero_position_y" value={draft.positionY} />
      <input type="hidden" name="hero_zoom" value={draft.zoom} />
      <input type="hidden" name="hero_overlay" value={draft.overlay} />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-zinc-950 text-white">
          {draft.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.imageUrl}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: `${draft.positionX}% ${draft.positionY}%`,
                transform: `scale(${draft.zoom})`,
                transformOrigin: `${draft.positionX}% ${draft.positionY}%`
              }}
            />
          ) : null}
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(9, 9, 11, ${draft.overlay / 100})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/35 via-zinc-950/10 to-transparent" />
          <div className="relative flex min-h-[320px] flex-col justify-center p-6 drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-frtp-orange">Apercu bandeau</p>
            <p className="mt-3 max-w-xl text-4xl font-black leading-tight md:text-5xl">{project.title}</p>
            <p className="mt-4 text-sm font-black">{project.city ?? "Commune"} - {project.work_date ? new Date(project.work_date).getFullYear() : "Date"}</p>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <RangeField label="Position gauche / droite" min={0} max={100} step={1} value={draft.positionX} onChange={(value) => updateDraft({ positionX: value })} />
          <RangeField label="Position haut / bas" min={0} max={100} step={1} value={draft.positionY} onChange={(value) => updateDraft({ positionY: value })} />
          <RangeField label="Zoom image" min={1} max={2.2} step={0.05} value={draft.zoom} onChange={(value) => updateDraft({ zoom: value })} />
          <RangeField label="Assombrissement" min={0} max={75} step={1} value={draft.overlay} onChange={(value) => updateDraft({ overlay: value })} suffix="%" />
          <button
            type="button"
            onClick={() => updateDraft({ ...defaultProjectHeroSettings, imageUrl: draft.imageUrl })}
            className="h-11 border border-zinc-300 bg-white px-4 text-sm font-black text-zinc-800 transition hover:border-frtp-orange hover:text-frtp-orange"
          >
            Reinitialiser le cadrage
          </button>
        </div>
      </div>

      {photos.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => updateDraft({ imageUrl: photo.image_url })}
              className={draft.imageUrl === photo.image_url
                ? "border-2 border-frtp-orange bg-white p-2 text-left"
                : "border border-zinc-200 bg-white p-2 text-left transition hover:border-frtp-blue"}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-zinc-200">
                <Image src={photo.image_url} alt={photo.caption ?? project.title} fill sizes="25vw" className="object-cover" />
              </span>
              <span className="mt-2 block text-xs font-black uppercase tracking-[0.14em] text-frtp-blue">
                {draft.imageUrl === photo.image_url ? "Image principale" : "Utiliser en bandeau"}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="bg-white p-3 text-sm font-semibold text-zinc-600">
          Ajoutez d'abord des photos au chantier pour pouvoir choisir l'image principale.
        </p>
      )}
    </section>
  );
}

function ProjectPhotos({
  project,
  heroSettings,
  onSubmit,
  onDelete,
  onUpdate,
  onSetHeroImage,
  onReorder,
  loading
}: {
  project: ProjectRow;
  heroSettings: ProjectHeroSettings;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, values: Partial<Pick<ProjectImage, "image_type" | "caption" | "sort_order">>) => void;
  onSetHeroImage: (imageUrl: string) => void;
  onReorder: (photos: ProjectImage[]) => void;
  loading: boolean;
}) {
  const photos = [...(project.project_images ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function dropPhoto(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const fromIndex = photos.findIndex((photo) => photo.id === draggedId);
    const toIndex = photos.findIndex((photo) => photo.id === targetId);

    if (fromIndex < 0 || toIndex < 0) {
      setDraggedId(null);
      return;
    }

    const nextPhotos = [...photos];
    const [movedPhoto] = nextPhotos.splice(fromIndex, 1);
    nextPhotos.splice(toIndex, 0, movedPhoto);
    setDraggedId(null);
    onReorder(nextPhotos);
  }

  return (
    <section className="border border-zinc-200 bg-white p-6">
      <FormTitle icon={ImagePlus} title="Photos du chantier" />
      <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-[1fr_180px_1fr_120px_auto] md:items-end">
        <Field label="Photo" name="image" type="file" required />
        <label className="grid gap-2 text-sm font-bold">
          Type
          <select name="image_type" className="h-12 border border-zinc-300 bg-white px-3 font-normal">
            <option value="before">Avant</option>
            <option value="during">Pendant</option>
            <option value="after">Après</option>
            <option value="gallery">Galerie</option>
          </select>
        </label>
        <Field label="Legende" name="caption" />
        <Field label="Ordre" name="sort_order" type="number" defaultValue="0" />
        <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 bg-frtp-blue px-4 text-sm font-black text-white">
          <Upload size={17} />
          Ajouter
        </button>
      </form>
      {photos.length ? (
        <p className="mt-5 border-l-4 border-frtp-blue bg-frtp-gray p-3 text-sm font-semibold text-zinc-700">
          Glissez une photo pour changer son ordre. Cliquez sur Avant, Pendant, Après ou Galerie pour changer son type.
        </p>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {photos.length ? photos.map((photo) => (
          <article
            key={photo.id}
            draggable
            onDragStart={() => setDraggedId(photo.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dropPhoto(photo.id)}
            onDragEnd={() => setDraggedId(null)}
            className={`cursor-grab border bg-frtp-gray p-3 active:cursor-grabbing ${draggedId === photo.id ? "border-frtp-orange opacity-60" : "border-zinc-200"}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
              <Image src={photo.image_url} alt={photo.caption ?? project.title} fill sizes="33vw" className="object-cover" />
              <div className="absolute left-3 top-3 bg-white/95 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-frtp-blue">
                #{photos.findIndex((item) => item.id === photo.id) + 1}
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSetHeroImage(photo.image_url);
                }}
                disabled={loading}
                className={heroSettings.imageUrl === photo.image_url
                  ? "absolute right-3 top-3 inline-flex size-10 items-center justify-center bg-frtp-orange text-white shadow-lg"
                  : "absolute right-3 top-3 inline-flex size-10 items-center justify-center bg-white/95 text-zinc-700 shadow-lg transition hover:bg-frtp-orange hover:text-white"}
                aria-label="Choisir comme image principale"
                title="Choisir comme image principale"
              >
                <Star size={19} fill={heroSettings.imageUrl === photo.image_url ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="mt-3 grid gap-3">
              {heroSettings.imageUrl === photo.image_url ? (
                <p className="inline-flex w-fit items-center gap-2 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-frtp-orange">
                  <Star size={13} fill="currentColor" />
                  Image principale
                </p>
              ) : null}
              <div className="grid grid-cols-2 gap-2">
                {imageTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onUpdate(photo.id, { image_type: option.value })}
                    disabled={loading || photo.image_type === option.value}
                    className={photo.image_type === option.value
                      ? "bg-frtp-blue px-2 py-2 text-xs font-black uppercase tracking-[0.14em] text-white"
                      : "border border-zinc-300 bg-white px-2 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-700 hover:border-frtp-blue hover:text-frtp-blue"}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-frtp-blue">
                Legende
                <input
                  defaultValue={photo.caption ?? ""}
                  onBlur={(event) => {
                    const nextCaption = event.currentTarget.value.trim() || null;
                    if (nextCaption !== photo.caption) {
                      onUpdate(photo.id, { caption: nextCaption });
                    }
                  }}
                  className="h-10 border border-zinc-300 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-zinc-800 outline-none focus:border-frtp-blue"
                />
              </label>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-zinc-500">Glisser pour déplacer</p>
                <button type="button" onClick={() => onDelete(photo.id)} className="text-red-700" aria-label="Supprimer la photo">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </article>
        )) : (
          <p className="bg-frtp-gray p-4 text-sm font-semibold text-zinc-600 md:col-span-3">Aucune photo pour ce chantier.</p>
        )}
      </div>
    </section>
  );
}

const imageTypeOptions: Array<{ value: ImageType; label: string }> = [
  { value: "before", label: "Avant" },
  { value: "during", label: "Pendant" },
  { value: "after", label: "Apres" },
  { value: "gallery", label: "Galerie" }
];

function NewsForm({
  news,
  onSubmit,
  loading,
  onDelete
}: {
  news: NewsRow | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-5 border border-zinc-200 bg-white p-6 shadow-technical">
      <FormTitle icon={news ? Edit3 : Newspaper} title={news ? "Modifier l'actualité" : "Ajouter une actualité"} />
      {news?.cover_image_url ? (
        <div className="relative aspect-[16/7] overflow-hidden bg-zinc-100">
          <Image src={news.cover_image_url} alt={news.title} fill sizes="100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Titre" name="title" defaultValue={news?.title} required />
        <Field label="Slug" name="slug" defaultValue={news?.slug} />
        <Field label="Image principale" name="image" type="file" />
      </div>
      <TextArea label="Extrait" name="excerpt" defaultValue={news?.excerpt} />
      <TextArea label="Contenu" name="content" defaultValue={news?.content} />
      <PublishControls published={news?.is_published} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton loading={loading} label={news ? "Enregistrer les modifications" : "Créer l'actualité"} />
        {news ? <DangerButton label="Supprimer l'actualité" onClick={() => onDelete(news.id)} /> : null}
      </div>
    </form>
  );
}

function RequestsList({ requests, onStatusChange }: { requests: RequestRow[]; onStatusChange: (id: string, status: string) => void }) {
  return (
    <div className="grid gap-4">
      {requests.length ? requests.map((request) => (
        <article key={request.id} className="border border-zinc-200 bg-white p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-frtp-orange">{request.status}</p>
              <h3 className="mt-2 text-xl font-black text-zinc-950">{request.name}{request.company ? ` - ${request.company}` : ""}</h3>
              <p className="mt-2 text-sm font-semibold text-zinc-600">{request.phone} - {request.email}</p>
              <p className="mt-1 text-sm text-zinc-600">{request.city ?? "Commune non precisee"} - {request.work_type ?? "Travaux non precises"}</p>
              <p className="mt-4 leading-7 text-zinc-700">{request.message}</p>
            </div>
            <select value={request.status} onChange={(event) => onStatusChange(request.id, event.target.value)} className="h-11 border border-zinc-300 bg-white px-3 text-sm font-bold">
              <option value="nouveau">nouveau</option>
              <option value="traite">traite</option>
              <option value="archive">archive</option>
            </select>
          </div>
        </article>
      )) : <p className="border border-zinc-200 bg-white p-5 font-semibold text-zinc-600">Aucune demande pour le moment.</p>}
    </div>
  );
}

function FormTitle({ icon: Icon, title }: { icon: typeof FolderKanban; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={23} className="text-frtp-orange" />
      <h2 className="text-2xl font-black text-zinc-950">{title}</h2>
    </div>
  );
}

function PublishControls({ published, featured }: { published?: boolean; featured?: boolean }) {
  return (
    <div className="flex flex-wrap gap-5">
      <label className="flex items-center gap-2 text-sm font-bold">
        <input name="is_published" type="checkbox" defaultChecked={published} className="h-4 w-4" />
        Publier
      </label>
      {featured !== undefined ? (
        <label className="flex items-center gap-2 text-sm font-bold">
          <input name="is_featured" type="checkbox" defaultChecked={featured} className="h-4 w-4" />
          Mettre en avant
        </label>
      ) : null}
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button disabled={loading} className="inline-flex items-center justify-center gap-2 bg-frtp-orange px-5 py-4 text-sm font-black text-white disabled:opacity-60">
      <Save size={18} />
      {loading ? "Enregistrement" : label}
    </button>
  );
}

function DangerButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center justify-center gap-2 border border-red-200 px-5 py-4 text-sm font-black text-red-700">
      <Trash2 size={18} />
      {label}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | null;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className="h-12 border border-zinc-300 px-3 font-normal outline-none focus:border-frtp-blue file:mr-3 file:border-0 file:bg-frtp-gray file:px-3 file:py-2 file:text-sm file:font-bold" />
    </label>
  );
}

function RangeField({
  label,
  min,
  max,
  step,
  value,
  suffix = "",
  onChange
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-zinc-800">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="bg-white px-2 py-1 text-xs font-black text-frtp-blue">{value}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="w-full accent-frtp-orange"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  defaultValue,
  rows = 4,
  richHint = false
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string | null;
  rows?: number;
  richHint?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyFormat(format: TextFormat) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    const selectedText = currentValue.slice(start, end) || "texte";
    const before = currentValue.slice(0, start);
    const after = currentValue.slice(end);
    const formattedText = formatText(selectedText, format);

    textarea.value = `${before}${formattedText}${after}`;
    textarea.focus();
    textarea.setSelectionRange(start, start + formattedText.length);
  }

  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <div className="flex flex-wrap gap-1 border border-zinc-200 bg-frtp-gray p-2">
        {textFormatButtons.map((button) => (
          <button
            key={button.format}
            type="button"
            onClick={() => applyFormat(button.format)}
            className="min-h-9 border border-zinc-300 bg-white px-3 text-xs font-black text-zinc-800 transition hover:border-frtp-blue hover:text-frtp-blue"
            title={button.title}
          >
            {button.label}
          </button>
        ))}
      </div>
      <textarea ref={textareaRef} name={name} rows={rows} placeholder={placeholder} defaultValue={defaultValue ?? ""} className="resize-none border border-zinc-300 px-3 py-3 font-normal outline-none focus:border-frtp-blue" />
      {richHint ? (
        <span className="text-xs font-semibold leading-5 text-zinc-500">
          Mise en forme : une ligne courte devient un titre, une ligne vide sépare les blocs, "- texte" crée une liste, **texte** met en gras.
        </span>
      ) : null}
    </label>
  );
}

type TextFormat = "bold" | "underline" | "bullet" | "left" | "center" | "right" | "justify";

const textFormatButtons: Array<{ format: TextFormat; label: string; title: string }> = [
  { format: "bold", label: "Gras", title: "Mettre en gras" },
  { format: "underline", label: "Soul.", title: "Souligner" },
  { format: "bullet", label: "Puces", title: "Transformer en liste a puces" },
  { format: "left", label: "Gauche", title: "Aligner a gauche" },
  { format: "center", label: "Centre", title: "Centrer" },
  { format: "right", label: "Droite", title: "Aligner a droite" },
  { format: "justify", label: "Justifie", title: "Justifier" }
];

function formatText(text: string, format: TextFormat) {
  const cleanText = text.trim() || "texte";

  if (format === "bold") return `**${cleanText}**`;
  if (format === "underline") return `__${cleanText}__`;
  if (format === "bullet") {
    return cleanText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.startsWith("- ") ? line : `- ${line}`)
      .join("\n");
  }

  return `[align=${format}]\n${cleanText}\n[/align]`;
}

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function heroSettingsFromForm(formData: FormData) {
  return normalizeProjectHeroSettings({
    imageUrl: String(formData.get("hero_image_url") ?? ""),
    positionX: Number(formData.get("hero_position_x") ?? defaultProjectHeroSettings.positionX),
    positionY: Number(formData.get("hero_position_y") ?? defaultProjectHeroSettings.positionY),
    zoom: Number(formData.get("hero_zoom") ?? defaultProjectHeroSettings.zoom),
    overlay: Number(formData.get("hero_overlay") ?? defaultProjectHeroSettings.overlay)
  });
}
