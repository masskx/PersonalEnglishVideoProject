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
import {CetTranslationVideo,CetTranslationCover,translationTimeline} from './cet-translation/CetTranslationVideo';
import {Cet6ReadingVideo,Cet6ReadingCover,readingTimeline} from './cet6-reading/Cet6ReadingVideo';
import {Cet6WritingVideo,Cet6WritingCover,writingTimeline as cet6WritingTimeline} from './cet6-writing/Cet6WritingVideo';
import {VerticalReplicaVideo} from './replica/vertical/VerticalReplicaVideo';
import {VERTICAL_CANVAS} from './replica/vertical/verticalLayout';
import {buildVerticalProps, supportsTeaser, verticalCompositionId} from './replica/vertical/verticalProjects';
import {XhsCard, XHS_CARD} from './replica/xhs/XhsCard';
import {XhsMethodCard} from './replica/xhs/XhsMethodCard';
import {cetTranslationDeck} from './cet-translation/xhs';
import {buildXhsDeck} from './replica/xhs/xhsCardData';
import {tenTainProject} from './replica/projects/tenTain';

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
    <Composition id="Cet6WritingConcession" component={Cet6WritingVideo} durationInFrames={cet6WritingTimeline.totalFrames} fps={30} width={1920} height={1080}/>
    <Composition id="Cet6WritingCover" component={Cet6WritingCover} durationInFrames={1} fps={ROOT_WORD_COVER.fps} width={ROOT_WORD_COVER.width} height={ROOT_WORD_COVER.height} defaultProps={{landscape:false}}/>
    <Composition id="Cet6WritingLandscapeCover" component={Cet6WritingCover} durationInFrames={1} fps={ROOT_WORD_LANDSCAPE_COVER.fps} width={ROOT_WORD_LANDSCAPE_COVER.width} height={ROOT_WORD_LANDSCAPE_COVER.height} defaultProps={{landscape:true}}/>
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
    {replicaProjects.filter((project) => project.cover).flatMap((project) =>
      (supportsTeaser(project) ? (['full', 'teaser'] as const) : (['full'] as const)).map((cut) => {
        const props = buildVerticalProps(project, cut);
        return (
          <Composition
            key={`${project.slug}-vertical-${cut}`}
            id={verticalCompositionId(project, cut)}
            component={VerticalReplicaVideo}
            durationInFrames={Math.round(props.storyboard.duration * VERTICAL_CANVAS.fps)}
            fps={VERTICAL_CANVAS.fps}
            width={VERTICAL_CANVAS.width}
            height={VERTICAL_CANVAS.height}
            defaultProps={props}
          />
        );
      }),
    )}
    <Composition
      id="XhsCard"
      component={XhsCard}
      durationInFrames={1}
      fps={XHS_CARD.fps}
      width={XHS_CARD.width}
      height={XHS_CARD.height}
      defaultProps={{deck: buildXhsDeck(tenTainProject, '小黑拆词根'), card: {kind: 'cover' as const}, page: 1, total: 13,
        saveCta: '建议收藏 · 考前翻一翻', followCta: '关注小黑，每期拆一个词根', commentPrompt: '评论区写一句话，用上今天的一个词'}}
    />
    <Composition
      id="XhsMethodCard"
      component={XhsMethodCard}
      durationInFrames={1}
      fps={XHS_CARD.fps}
      width={XHS_CARD.width}
      height={XHS_CARD.height}
      defaultProps={{deck: cetTranslationDeck, card: {kind: 'cover' as const}, page: 1, total: 12,
        saveCta: '建议收藏 · 考前翻一翻', followCta: '关注小黑，每期拆一个词根', commentPrompt: '评论区写一句话，用上今天的一个词'}}
    />
  </>
);
