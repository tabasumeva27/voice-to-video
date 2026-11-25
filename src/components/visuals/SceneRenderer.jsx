import React from 'react';
import AvatarExplainer from './AvatarExplainer';
import ProceduralMotion from './ProceduralMotion';
import PaperCollage from './PaperCollage';
import StockVisual from './StockVisual';

/**
 * Universal Scene Renderer Dispatcher
 * Passes sceneIndex and exact progress for micro-interactions and diverse shot selections.
 */
export default function SceneRenderer({ scene, sceneIndex = 0, isPlaying = false, progress = 0 }) {
  if (!scene) return null;

  const visualType = scene.visualType || scene.type || 'stock_visual';

  // 1. Personal Face Hook or Avatar Explainer
  if (visualType === 'personal_hook' || visualType === 'avatar_explainer' || visualType === 'personal_face') {
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

  // 2. Procedural Code Motions (Odometer counter, 3D Charts, Sonar)
  if (visualType === 'procedural_motion') {
    return (
      <ProceduralMotion
        motionType={scene.motionType || 'counter'}
        headline={scene.headline}
        highlightText={scene.highlightText}
        metrics={scene.metrics}
        isPlaying={isPlaying}
        progress={progress}
      />
    );
  }

  // 3. High-End Full-Frame Paper Collage with Animated Marker
  if (visualType === 'paper_collage' || visualType === 'news_headline') {
    return (
      <PaperCollage
        headline={scene.headline}
        highlightText={scene.highlightText}
        caption={scene.caption}
        isPlaying={isPlaying}
        progress={progress}
      />
    );
  }

  // 4. Dynamic Contextual Stock Visual with Strict Shot Variety
  return (
    <StockVisual
      imageUrl={scene.imageUrl}
      query={scene.searchQuery || scene.highlightText}
      caption={scene.caption}
      sceneIndex={sceneIndex}
      isPlaying={isPlaying}
      zoomScale={scene.zoomScale || 1.15}
    />
  );
}
