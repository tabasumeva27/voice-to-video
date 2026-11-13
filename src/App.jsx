import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import AudioUploader from './components/AudioUploader';
import StoryboardEditor from './components/StoryboardEditor';
import ReelPreviewPlayer from './components/ReelPreviewPlayer';
import ExportModal from './components/ExportModal';
import SettingsModal from './components/SettingsModal';
import { 
  getProjectsList, loadProject, saveProject, createNewProject, 
  deleteProject, getLastProject, getSettings 
} from './services/storage';
import { generateScenesWithGemini, parseTranscriptRuleBased } from './services/aiDirector';
import { SAMPLE_STORIES, PRESET_VISUALS } from './constants/presets';

export default function App() {
  const [project, setProject] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null); // Actual Voice Audio URL for playback

  const debounceTimerRef = useRef(null);

  // Initial Project Load
  useEffect(() => {
    const list = getProjectsList();
    setProjectsList(list);

    const last = getLastProject();
    if (last && last.scenes && last.scenes.length > 0) {
      setProject(last);
      if (last.audioUrl) setAudioUrl(last.audioUrl);
    } else {
      const sample = SAMPLE_STORIES[0];
      const initialProject = {
        id: 'proj_' + Date.now(),
        title: sample.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transcript: sample.audioText,
        scenes: sample.scenes,
        driveHookUrl: '',
        audioUrl: ''
      };
      saveProject(initialProject);
      setProject(initialProject);
      setProjectsList(getProjectsList());
    }
  }, []);

  // Debounced Auto-Save
  const triggerAutoSave = (updatedProject) => {
    setProject(updatedProject);
    setIsAutoSaving(true);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      saveProject(updatedProject);
      setProjectsList(getProjectsList());
      setIsAutoSaving(false);
    }, 600);
  };

  // Generate 4-Layer Dynamic Scenes from Narration
  const handleGenerateScenes = async (transcript, overrideScenes = null) => {
    if (overrideScenes) {
      const updated = {
        ...project,
        transcript,
        scenes: overrideScenes
      };
      triggerAutoSave(updated);
      setActiveSceneIndex(0);
      return;
    }

    setIsGenerating(true);
    const settings = getSettings();

    try {
      let scenes;
      if (settings?.geminiApiKey) {
        scenes = await generateScenesWithGemini(
          transcript,
          settings.geminiApiKey,
          project.driveHookUrl || settings.driveFolderUrl
        );
      } else {
        scenes = parseTranscriptRuleBased(
          transcript,
          0,
          project.driveHookUrl || settings.driveFolderUrl
        );
      }

      const updated = {
        ...project,
        transcript,
        scenes
      };
      triggerAutoSave(updated);
      setActiveSceneIndex(0);
    } catch (e) {
      console.error('Scene generation failed', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Scene CRUD Handlers
  const handleUpdateScene = (index, updates) => {
    if (!project || !project.scenes) return;
    const newScenes = [...project.scenes];
    newScenes[index] = { ...newScenes[index], ...updates };
    triggerAutoSave({ ...project, scenes: newScenes });
  };

  const handleAddScene = () => {
    if (!project) return;
    const currentScenes = project.scenes || [];
    const lastScene = currentScenes[currentScenes.length - 1];
    const startTime = lastScene ? lastScene.endTime : 0;
    const endTime = startTime + 5;

    const newScene = {
      id: `scene_${Date.now()}`,
      startTime,
      endTime,
      duration: 5,
      visualType: 'avatar_explainer',
      motionType: 'particles',
      caption: 'নতুন অধ্যায়ের ক্যাপশন...',
      headline: 'নতুন বিষয়বস্তু',
      highlightText: 'মূল পয়েন্ট',
      soundFx: 'whoosh',
      zoomScale: 1.1,
      imageUrl: PRESET_VISUALS.ocean
    };

    triggerAutoSave({ ...project, scenes: [...currentScenes, newScene] });
  };

  const handleDeleteScene = (index) => {
    if (!project || !project.scenes) return;
    const newScenes = project.scenes.filter((_, i) => i !== index);
    triggerAutoSave({ ...project, scenes: newScenes });
    if (activeSceneIndex >= newScenes.length) {
      setActiveSceneIndex(Math.max(0, newScenes.length - 1));
    }
  };

  const handleReorderScenes = (fromIndex, toIndex) => {
    if (!project || !project.scenes) return;
    const newScenes = [...project.scenes];
    const [moved] = newScenes.splice(fromIndex, 1);
    newScenes.splice(toIndex, 0, moved);

    let curr = 0;
    const sequential = newScenes.map((s) => {
      const d = s.duration || s.endTime - s.startTime || 5;
      const start = curr;
      const end = curr + d;
      curr = end;
      return { ...s, startTime: start, endTime: end, duration: d };
    });

    triggerAutoSave({ ...project, scenes: sequential });
    setActiveSceneIndex(toIndex);
  };

  // Project Switch / Create / Delete
  const handleSelectProject = (projectId) => {
    const p = loadProject(projectId);
    if (p) {
      setProject(p);
      setAudioUrl(p.audioUrl || null);
      setActiveSceneIndex(0);
    }
  };

  const handleNewProject = () => {
    const newP = createNewProject(`রিল প্রজেক্ট #${projectsList.length + 1}`);
    setProject(newP);
    setAudioUrl(null);
    setProjectsList(getProjectsList());
    setActiveSceneIndex(0);
  };

  const handleDeleteProject = (projectId) => {
    deleteProject(projectId);
    const updatedList = getProjectsList();
    setProjectsList(updatedList);
    if (updatedList.length > 0) {
      const p = loadProject(updatedList[0].id);
      setProject(p);
      setAudioUrl(p?.audioUrl || null);
    } else {
      handleNewProject();
    }
  };

  // Update voice audio URL when uploaded/recorded
  const handleSetAudioUrl = (url) => {
    setAudioUrl(url);
    if (project) {
      triggerAutoSave({ ...project, audioUrl: url });
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-gray-400 font-bengali">
        স্টুডিও লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentProject={project}
        projectsList={projectsList}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onDeleteProject={handleDeleteProject}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isAutoSaving={isAutoSaving}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Audio Input & Storyboard Deck */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <AudioUploader
              onGenerateScenes={handleGenerateScenes}
              currentTranscript={project.transcript || ''}
              onUpdateTranscript={(t) => triggerAutoSave({ ...project, transcript: t })}
              driveHookUrl={project.driveHookUrl || ''}
              onUpdateDriveUrl={(u) => triggerAutoSave({ ...project, driveHookUrl: u })}
              isGenerating={isGenerating}
              onSetAudioUrl={handleSetAudioUrl}
            />

            <StoryboardEditor
              scenes={project.scenes || []}
              onUpdateScene={handleUpdateScene}
              onAddScene={handleAddScene}
              onDeleteScene={handleDeleteScene}
              onReorderScenes={handleReorderScenes}
              activeSceneIndex={activeSceneIndex}
              onSelectScene={(idx) => setActiveSceneIndex(idx)}
            />
          </div>

          {/* Right Column: Sticky 9:16 Reel Preview Canvas */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 flex flex-col items-center">
            <div className="w-full bg-gray-900/80 border border-gray-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
                <span className="text-sm font-bold text-white font-bengali flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  ৩. লাইভ রিল প্রিভিউ (৯:১৬)
                </span>
                <span className="text-[11px] font-mono text-gray-400">
                  {project.scenes?.length || 0} Scenes
                </span>
              </div>

              <ReelPreviewPlayer
                scenes={project.scenes || []}
                currentSceneIndex={activeSceneIndex}
                onSceneChange={(idx) => setActiveSceneIndex(idx)}
                audioUrl={audioUrl}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        scenes={project.scenes || []}
        projectTitle={project.title}
        audioUrl={audioUrl}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
