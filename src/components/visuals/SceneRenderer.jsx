import React from 'react';
import AvatarExplainer from './AvatarExplainer';
import ProceduralMotion from './ProceduralMotion';
import PaperCollage from './PaperCollage';
import StockVisual from './StockVisual';

/**
 * Universal Scene Renderer Dispatcher
 * Automatically selects the appropriate visual layer based on scene.visualType:
 * - avatar_explainer: Animated SVG talking character
 * - procedural_motion: Sonar, Charts, Counters, Waves, Heartbeat
 * - paper_collage: Newspaper report with marker highlights
 * - stock_visual: Dynamic contextual image
 * - personal_hook: Drive video or avatar fallback
 */
export default function SceneRenderer({ scene, isPlaying = false, progress = 0 }) {
  if (!scene) return null;

  const visualType = scene.visualType || scene.type || 'stock_visual';

  // 1. Personal Face Hook or Avatar Explainer
  if (visualType === 'personal_hook' || visualType === 'avatar_explainer' || visualType === 'personal_face') {
    // If user provided driveHookUrl / custom video, we can render video or image; else animated avatar
    if (scene.driveVideoUrl) {
      return (
        <video
          src={scene.driveVideoUrl}
          autoPlay={isPlaying}
          muted
          loop
          className="w-full h-full object-cover"
        />
      );
    }
    return (
      <AvatarExplainer
        caption={scene.caption}
        mood={scene.mood || 'serious'}
        isPlaying={isPlaying}
        progress={progress}
      />
    );
  }

  // 2. Procedural Code Motions (Sonar waves, Charts, Counters, Heartbeat)
  if (visualType === 'procedural_motion') {
    return (
      <ProceduralMotion
        motionType={scene.motionType || 'sonar'}
        headline={scene.headline}
        highlightText={scene.highlightText}
        isPlaying={isPlaying}
        progress={progress}
      />
    );
  }

  // 3. Paper Collage / Newspaper Highlight
  if (visualType === 'paper_collage' || visualType === 'news_headline') {
    return (
      <PaperCollage
        headline={scene.headline}
        highlightText={scene.highlightText}
        caption={scene.caption}
        isPlaying={isPlaying}
      />
    );
  }

  // 4. Default: Dynamic Contextual Stock Visual with Ken Burns
  return (
    <StockVisual
      imageUrl={scene.imageUrl}
      query={scene.searchQuery || scene.highlightText}
      caption={scene.caption}
      isPlaying={isPlaying}
      zoomScale={scene.zoomScale || 1.15}
    />
  );
}
