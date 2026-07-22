"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  // Hero State
  const [heroPlaybackId, setHeroPlaybackId] = useState("");

  // Photos & Videos State
  const [photos, setPhotos] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  // New Photo form state
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [photoForm, setPhotoForm] = useState({ titleTr: "", titleEn: "", categoryTr: "", categoryEn: "", color: "bg-sapphire" });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // New Video form state
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoForm, setVideoForm] = useState({ titleTr: "", titleEn: "", categoryTr: "", categoryEn: "", color: "bg-deepAnchor-alt1", playbackId: "" });
  const [videoError, setVideoError] = useState<string | null>(null);

  // Delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [confirmDeleteInquiryId, setConfirmDeleteInquiryId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHeroSettings();
      fetchProjects();
      fetchInquiries();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "muso2026") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const fetchHeroSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (data) {
      setHeroPlaybackId(data.hero_video_playback_id || "");
    }
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) {
      setPhotos(data.filter((p) => p.media_type === "photo"));
      setVideos(data.filter((p) => p.media_type === "video"));
    }
  };

  const saveHeroSettings = async () => {
    await supabase.from("site_settings").update({ hero_video_playback_id: heroPlaybackId }).eq("id", 1);
    alert("Hero settings saved!");
  };

  const handlePhotoFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingPhotoFile(file);
    setPhotoForm({ titleTr: "", titleEn: "", categoryTr: "", categoryEn: "", color: "bg-sapphire" });
    e.target.value = ""; // allow re-selecting the same file later
  };

  const submitPhotoUpload = async () => {
    if (!pendingPhotoFile) return;
    if (!photoForm.titleTr.trim() && !photoForm.titleEn.trim()) {
      setPhotoError("A title in at least one language is required.");
      return;
    }

    setUploadingPhoto(true);
    setPhotoError(null);

    const fileName = `${Date.now()}-${pendingPhotoFile.name}`;
    const { error: uploadError } = await supabase.storage.from("media").upload(fileName, pendingPhotoFile);

    if (uploadError) {
      setPhotoError("Upload failed: " + uploadError.message);
      setUploadingPhoto(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("projects").insert({
      title_tr: photoForm.titleTr.trim() || null,
      title_en: photoForm.titleEn.trim() || null,
      category_tr: photoForm.categoryTr.trim() || null,
      category_en: photoForm.categoryEn.trim() || null,
      color: photoForm.color.trim() || "bg-sapphire",
      media_type: "photo",
      media_url: urlData.publicUrl,
      is_featured: true,
    });

    setUploadingPhoto(false);

    if (insertError) {
      setPhotoError("Saving project failed: " + insertError.message);
      return;
    }

    setPendingPhotoFile(null);
    fetchProjects();
  };

  const submitVideo = async () => {
    if (!videoForm.titleTr.trim() && !videoForm.titleEn.trim()) {
      setVideoError("A title in at least one language is required.");
      return;
    }
    if (!videoForm.playbackId.trim()) {
      setVideoError("Mux Playback ID is required.");
      return;
    }

    const { error } = await supabase.from("projects").insert({
      title_tr: videoForm.titleTr.trim() || null,
      title_en: videoForm.titleEn.trim() || null,
      category_tr: videoForm.categoryTr.trim() || null,
      category_en: videoForm.categoryEn.trim() || null,
      color: videoForm.color.trim() || "bg-deepAnchor-alt1",
      media_type: "video",
      media_url: videoForm.playbackId.trim(),
      is_featured: true,
    });

    if (error) {
      setVideoError("Saving project failed: " + error.message);
      return;
    }

    setVideoError(null);
    setShowVideoForm(false);
    setVideoForm({ titleTr: "", titleEn: "", categoryTr: "", categoryEn: "", color: "bg-deepAnchor-alt1", playbackId: "" });
    fetchProjects();
  };

  const toggleFeatured = async (id: string, currentVal: boolean) => {
    await supabase.from("projects").update({ is_featured: !currentVal }).eq("id", id);
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setConfirmDeleteId(null);
    fetchProjects();
  };

  const fetchInquiries = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (data) {
      setInquiries(data);
    }
  };

  const toggleInquiryRead = async (id: string, currentVal: boolean) => {
    await supabase.from("inquiries").update({ is_read: !currentVal }).eq("id", id);
    fetchInquiries();
  };

  const deleteInquiry = async (id: string) => {
    await supabase.from("inquiries").delete().eq("id", id);
    setConfirmDeleteInquiryId(null);
    fetchInquiries();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-muted p-8 rounded-lg shadow-2xl">
          <h1 className="text-3xl font-heading text-neutral-cream mb-6 text-center">Admin Login</h1>
          <div className="space-y-4 mb-6">
            <input
              type="password"
              placeholder="Password (muso2026)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-deepAnchor-alt1 p-3 text-white rounded outline-none focus:border-brass"
              required
            />
          </div>
          <Button type="submit" className="w-full h-12 uppercase tracking-widest text-sm rounded">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-12 pt-32 max-w-6xl mx-auto">
      <header className="mb-12 flex justify-between items-center border-b border-muted pb-6">
        <h1 className="text-4xl font-heading text-neutral-cream">CMS Dashboard</h1>
        <Button variant="ghost" onClick={() => setIsAuthenticated(false)} className="text-brass">Sign Out</Button>
      </header>

      <div className="flex gap-4 mb-8">
        <Button variant={activeTab === 'hero' ? 'default' : 'outline'} onClick={() => setActiveTab('hero')}>Hero Video</Button>
        <Button variant={activeTab === 'photos' ? 'default' : 'outline'} onClick={() => setActiveTab('photos')}>Photos</Button>
        <Button variant={activeTab === 'videos' ? 'default' : 'outline'} onClick={() => setActiveTab('videos')}>Videos</Button>
        <Button variant={activeTab === 'inquiries' ? 'default' : 'outline'} onClick={() => setActiveTab('inquiries')}>
          Inquiries
          {inquiries.filter((i) => !i.is_read).length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-brass text-background text-xs font-bold">
              {inquiries.filter((i) => !i.is_read).length}
            </span>
          )}
        </Button>
      </div>

      {activeTab === 'hero' && (
        <section className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-heading text-neutral-cream mb-6">Hero Video Settings</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm text-neutral-grayBeige mb-2">Mux Playback ID</label>
              <input
                type="text"
                value={heroPlaybackId}
                onChange={(e) => setHeroPlaybackId(e.target.value)}
                className="w-full bg-background border border-deepAnchor-alt1 p-3 text-white rounded outline-none focus:border-brass"
              />
            </div>
            <Button onClick={saveHeroSettings} className="w-full h-12 uppercase tracking-widest text-sm rounded">
              Save Hero Settings
            </Button>
          </div>
        </section>
      )}

      {activeTab === 'photos' && (
        <section className="bg-muted p-8 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading text-neutral-cream">Photos Manager</h2>
            <div className="relative">
              <input type="file" onChange={handlePhotoFileSelected} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
              <Button>Upload New Photo</Button>
            </div>
          </div>

          {pendingPhotoFile && (
            <div className="mb-6 p-4 border border-brass/50 rounded bg-background space-y-3">
              <p className="text-xs text-neutral-grayBeige">Selected file: <span className="text-neutral-cream">{pendingPhotoFile.name}</span></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title (Turkish)"
                  value={photoForm.titleTr}
                  onChange={(e) => setPhotoForm({ ...photoForm, titleTr: e.target.value })}
                  className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
                />
                <input
                  type="text"
                  placeholder="Title (English)"
                  value={photoForm.titleEn}
                  onChange={(e) => setPhotoForm({ ...photoForm, titleEn: e.target.value })}
                  className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
                />
                <input
                  type="text"
                  placeholder="Category (Turkish, e.g. Reklam Filmi)"
                  value={photoForm.categoryTr}
                  onChange={(e) => setPhotoForm({ ...photoForm, categoryTr: e.target.value })}
                  className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
                />
                <input
                  type="text"
                  placeholder="Category (English, e.g. Commercial)"
                  value={photoForm.categoryEn}
                  onChange={(e) => setPhotoForm({ ...photoForm, categoryEn: e.target.value })}
                  className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Hover color (e.g. bg-sapphire)"
                value={photoForm.color}
                onChange={(e) => setPhotoForm({ ...photoForm, color: e.target.value })}
                className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
              />
              <p className="text-xs text-neutral-grayBeige/60">Leave a language blank to fall back to the other one on the public site.</p>
              {photoError && <p className="text-xs text-destructive">{photoError}</p>}
              <div className="flex gap-2">
                <Button size="sm" onClick={submitPhotoUpload} disabled={uploadingPhoto}>
                  {uploadingPhoto ? "Uploading..." : "Save Photo"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setPendingPhotoFile(null); setPhotoError(null); }}
                  disabled={uploadingPhoto}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {photos.map(p => (
              <div key={p.id} className="p-4 border border-deepAnchor-alt1 rounded flex justify-between items-center bg-background">
                <div className="flex items-center gap-4">
                  <img src={p.media_url} alt="" className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="text-neutral-cream font-medium">
                      {p.title_tr || p.title_en} <span className="text-xs text-brass ml-2">{p.category_tr || p.category_en}</span>
                    </p>
                    <p className="text-xs text-neutral-grayBeige/70 mt-1">TR: {p.title_tr || "—"} · EN: {p.title_en || "—"}</p>
                    <p className="text-xs text-neutral-grayBeige mt-1">Featured on homepage: {p.is_featured ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {confirmDeleteId === p.id ? (
                    <>
                      <span className="text-xs text-neutral-grayBeige">Delete this project?</span>
                      <Button variant="destructive" size="sm" onClick={() => deleteProject(p.id)}>Confirm</Button>
                      <Button variant="outline" size="sm" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => toggleFeatured(p.id, p.is_featured)}>Toggle Featured</Button>
                      <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteId(p.id)}>Delete</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {photos.length === 0 && <p className="text-neutral-grayBeige text-sm">No photos added yet.</p>}
          </div>
        </section>
      )}

      {activeTab === 'videos' && (
        <section className="bg-muted p-8 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading text-neutral-cream">Videos Manager</h2>
            <Button onClick={() => { setShowVideoForm(true); setVideoError(null); }}>Add New Video</Button>
          </div>

          {showVideoForm && (
            <div className="mb-6 p-4 border border-brass/50 rounded bg-background space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title (Turkish)"
                  value={videoForm.titleTr}
                  onChange={(e) => setVideoForm({ ...videoForm, titleTr: e.target.value })}
                  className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
                />
                <input
                  type="text"
                  placeholder="Title (English)"
                  value={videoForm.titleEn}
                  onChange={(e) => setVideoForm({ ...videoForm, titleEn: e.target.value })}
                  className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
                />
                <input
                  type="text"
                  placeholder="Category (Turkish, e.g. Kısa Film)"
                  value={videoForm.categoryTr}
                  onChange={(e) => setVideoForm({ ...videoForm, categoryTr: e.target.value })}
                  className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
                />
                <input
                  type="text"
                  placeholder="Category (English, e.g. Short Film)"
                  value={videoForm.categoryEn}
                  onChange={(e) => setVideoForm({ ...videoForm, categoryEn: e.target.value })}
                  className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Hover color (e.g. bg-deepAnchor-alt1)"
                value={videoForm.color}
                onChange={(e) => setVideoForm({ ...videoForm, color: e.target.value })}
                className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
              />
              <input
                type="text"
                placeholder="Mux Playback ID"
                value={videoForm.playbackId}
                onChange={(e) => setVideoForm({ ...videoForm, playbackId: e.target.value })}
                className="w-full bg-background border border-deepAnchor-alt1 p-2 text-white rounded outline-none focus:border-brass text-sm"
              />
              <p className="text-xs text-neutral-grayBeige/60">Leave a language blank to fall back to the other one on the public site.</p>
              {videoError && <p className="text-xs text-destructive">{videoError}</p>}
              <div className="flex gap-2">
                <Button size="sm" onClick={submitVideo}>Save Video</Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowVideoForm(false); setVideoError(null); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {videos.map(p => (
              <div key={p.id} className="p-4 border border-deepAnchor-alt1 rounded flex justify-between items-center bg-background">
                <div>
                  <p className="text-neutral-cream font-medium">
                    {p.title_tr || p.title_en} <span className="text-xs text-brass ml-2">{p.category_tr || p.category_en}</span>
                  </p>
                  <p className="text-xs text-neutral-grayBeige/70 mt-1">TR: {p.title_tr || "—"} · EN: {p.title_en || "—"}</p>
                  <p className="text-xs text-neutral-grayBeige mt-1">Playback ID: {p.media_url}</p>
                  <p className="text-xs text-neutral-grayBeige mt-1">Featured on homepage: {p.is_featured ? 'Yes' : 'No'}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {confirmDeleteId === p.id ? (
                    <>
                      <span className="text-xs text-neutral-grayBeige">Delete this project?</span>
                      <Button variant="destructive" size="sm" onClick={() => deleteProject(p.id)}>Confirm</Button>
                      <Button variant="outline" size="sm" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => toggleFeatured(p.id, p.is_featured)}>Toggle Featured</Button>
                      <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteId(p.id)}>Delete</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {videos.length === 0 && <p className="text-neutral-grayBeige text-sm">No videos added yet.</p>}
          </div>
        </section>
      )}

      {activeTab === 'inquiries' && (
        <section className="bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-heading text-neutral-cream mb-6">Inquiries</h2>

          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className={`p-4 border rounded bg-background ${inq.is_read ? 'border-deepAnchor-alt1' : 'border-brass/60'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {!inq.is_read && <span className="w-2 h-2 rounded-full bg-brass shrink-0" />}
                      <p className="text-neutral-cream font-medium">{inq.name}</p>
                      <a href={`mailto:${inq.email}`} className="text-xs text-brass hover:underline">{inq.email}</a>
                      <span className="text-xs px-2 py-0.5 rounded bg-deepAnchor-alt1 text-neutral-grayBeige capitalize">
                        {inq.project_type === 'other' ? (inq.other_project_type || 'Other') : inq.project_type}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-grayBeige mt-2 whitespace-pre-wrap">{inq.description}</p>
                    <p className="text-xs text-neutral-grayBeige/60 mt-2">
                      {new Date(inq.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center shrink-0">
                    {confirmDeleteInquiryId === inq.id ? (
                      <>
                        <span className="text-xs text-neutral-grayBeige">Delete this inquiry?</span>
                        <Button variant="destructive" size="sm" onClick={() => deleteInquiry(inq.id)}>Confirm</Button>
                        <Button variant="outline" size="sm" onClick={() => setConfirmDeleteInquiryId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => toggleInquiryRead(inq.id, inq.is_read)}>
                          Mark as {inq.is_read ? 'Unread' : 'Read'}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteInquiryId(inq.id)}>Delete</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {inquiries.length === 0 && <p className="text-neutral-grayBeige text-sm">No inquiries yet.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
