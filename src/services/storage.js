// LocalStorage & Project Persistence Service

const STORAGE_KEYS = {
  PROJECTS: 'v2v_projects_list',
  CURRENT_PROJECT_ID: 'v2v_current_project_id',
  SETTINGS: 'v2v_user_settings'
};

// Default Settings
export const getSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      geminiApiKey: '',
      driveFolderUrl: '',
      autoSave: true,
      defaultLanguage: 'bn'
    };
  } catch (e) {
    console.error('Failed to load settings', e);
    return { geminiApiKey: '', driveFolderUrl: '', autoSave: true, defaultLanguage: 'bn' };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings', e);
    return false;
  }
};

// List all saved projects
export const getProjectsList = () => {
  try {
    const list = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return list ? JSON.parse(list) : [];
  } catch (e) {
    console.error('Failed to load projects list', e);
    return [];
  }
};

// Load specific project
export const loadProject = (projectId) => {
  try {
    const data = localStorage.getItem(`v2v_project_${projectId}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Failed to load project ${projectId}`, e);
    return null;
  }
};

// Save Project (Auto-Save)
export const saveProject = (project) => {
  if (!project || !project.id) return false;

  try {
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    // Save project data
    localStorage.setItem(`v2v_project_${project.id}`, JSON.stringify(updatedProject));

    // Update list index
    const list = getProjectsList();
    const existingIndex = list.findIndex(p => p.id === project.id);
    const summary = {
      id: project.id,
      title: project.title || 'নামহীন রিল প্রজেক্ট',
      updatedAt: updatedProject.updatedAt,
      duration: project.duration || 0,
      scenesCount: project.scenes ? project.scenes.length : 0,
      thumbnail: project.scenes && project.scenes[0] ? project.scenes[0].imageUrl : null
    };

    if (existingIndex >= 0) {
      list[existingIndex] = summary;
    } else {
      list.unshift(summary);
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT_ID, project.id);
    return true;
  } catch (e) {
    console.error('Failed to auto-save project', e);
    return false;
  }
};

// Delete Project
export const deleteProject = (projectId) => {
  try {
    localStorage.removeItem(`v2v_project_${projectId}`);
    const list = getProjectsList().filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Failed to delete project', e);
    return false;
  }
};

// Create New Blank Project
export const createNewProject = (title = 'নতুন রিল প্রজেক্ট') => {
  const newId = 'proj_' + Date.now();
  const project = {
    id: newId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    audioUrl: null,
    audioDuration: 0,
    transcript: '',
    scenes: [],
    driveHookUrl: ''
  };

  saveProject(project);
  return project;
};

// Get Last Opened Project
export const getLastProject = () => {
  const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT_ID);
  if (currentId) {
    const project = loadProject(currentId);
    if (project) return project;
  }
  const list = getProjectsList();
  if (list.length > 0) {
    return loadProject(list[0].id);
  }
  return null;
};
