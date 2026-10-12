import React from 'react';
import {CetWritingVideo, CetWritingCover, writingTimeline} from './cet-writing/CetWritingVideo';
import {Composition} from 'remotion';
import {ReplicaVideo, getReplicaDurationFrames} from './replica/ReplicaVideo';
import {replicaProjects} from './replica/projects/registry';
import {
  RootWordCover,
  RootWordLandscapeCover,
  ROOT_WORD_COVER,
  ROOT_WORD_LANDSCAPE_COVER,
} from './replica/RootWordCover';
import {jectProject} from './replica/projects/ject';
import {MemeVocabShortVideo} from './meme-vocab/MemeVocabShortVideo';
import {defaultMemeVocabConfig} from './meme-vocab/default';
import type {MemeVocabShortProps} from './meme-vocab/types';
import {CetTranslationVideo,CetTranslationCover,translationTimeline} from './cet-translation/CetTranslationVideo';
import {Cet6ReadingVideo,Cet6ReadingCover,readingTimeline} from './cet6-reading/Cet6ReadingVideo';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Cet4TranslationMainClause" component={CetTranslationVideo} durationInFrames={translationTimeline.totalFrames} fps={30} width={1920} height={1080}/>
    <Composition id="Cet4TranslationCover" component={CetTranslationCover} durationInFrames={1} fps={ROOT_WORD_COVER.fps} width={ROOT_WORD_COVER.width} height={ROOT_WORD_COVER.height} defaultProps={{landscape:false}}/>
    <Composition id="Cet4TranslationLandscapeCover" component={CetTranslationCover} durationInFrames={1} fps={ROOT_WORD_LANDSCAPE_COVER.fps} width={ROOT_WORD_LANDSCAPE_COVER.width} height={ROOT_WORD_LANDSCAPE_COVER.height} defaultProps={{landscape:true}}/>
    <Composition id="Cet4WritingParagraph" component={CetWritingVideo} durationInFrames={writingTimeline.totalFrames} fps={30} width={1920} height={1080}/>
    <Composition id="Cet4WritingCover" component={CetWritingCover} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{landscape:false}}/>
    <Composition id="Cet4WritingLandscapeCover" component={CetWritingCover} durationInFrames={1} fps={30} width={1200} height={900} defaultProps={{landscape:true}}/>
    <Composition id="Cet6ReadingLocationParaphrase" component={Cet6ReadingVideo} durationInFrames={readingTimeline.totalFrames} fps={30} width={1920} height={1080}/>
    <Composition id="Cet6ReadingCover" component={Cet6ReadingCover} durationInFrames={1} fps={ROOT_WORD_COVER.fps} width={ROOT_WORD_COVER.width} height={ROOT_WORD_COVER.height} defaultProps={{landscape:false}}/>
    <Composition id="Cet6ReadingLandscapeCover" component={Cet6ReadingCover} durationInFrames={1} fps={ROOT_WORD_LANDSCAPE_COVER.fps} width={ROOT_WORD_LANDSCAPE_COVER.width} height={ROOT_WORD_LANDSCAPE_COVER.height} defaultProps={{landscape:true}}/>
    <Composition
      id="RootWordCover"
      component={RootWordCover}
      durationInFrames={1}
      fps={ROOT_WORD_COVER.fps}
      width={ROOT_WORD_COVER.width}
      height={ROOT_WORD_COVER.height}
      defaultProps={{cover: jectProject.cover!}}
    />
    <Composition
      id="RootWordLandscapeCover"
      component={RootWordLandscapeCover}
      durationInFrames={1}
      fps={ROOT_WORD_LANDSCAPE_COVER.fps}
      width={ROOT_WORD_LANDSCAPE_COVER.width}
      height={ROOT_WORD_LANDSCAPE_COVER.height}
      defaultProps={{cover: jectProject.cover!}}
    />
    {replicaProjects.map((project) => (
      <Composition
        key={project.slug}
        id={project.compositionId}
        component={ReplicaVideo}
        durationInFrames={getReplicaDurationFrames(project.storyboard)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          storyboard: project.storyboard,
          audioManifest: project.audioManifest,
          backgroundMusic: project.backgroundMusic,
          visualRenderer: project.visualRenderer ?? 'default',
          continuousStage: project.continuousStage,
        }}
      />
    ))}
    <Composition
      id="MemeVocabShort"
      component={MemeVocabShortVideo}
      durationInFrames={defaultMemeVocabConfig.resolvedTimeline.totalFrames}
      fps={defaultMemeVocabConfig.storyboard.fps}
      width={defaultMemeVocabConfig.storyboard.width}
      height={defaultMemeVocabConfig.storyboard.height}
      defaultProps={{config: defaultMemeVocabConfig}}
      calculateMetadata={({props}: {props: MemeVocabShortProps}) => ({
        durationInFrames: props.config.resolvedTimeline.totalFrames,
        fps: props.config.storyboard.fps,
        width: props.config.storyboard.width,
        height: props.config.storyboard.height,
      })}
    />
  </>
);
