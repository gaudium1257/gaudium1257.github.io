import { editorial } from './editorial';
import { terminal } from './terminal';
import { brutal } from './brutal';
import { kinetic } from './kinetic';
import { soft } from './soft';
import { timeline } from './timeline';
import { swiss } from './swiss';
import { bento } from './bento';
import { newspaper } from './newspaper';
import { neon } from './neon';
import { docs } from './docs';
import { gallery } from './gallery';
import { retro } from './retro';
import { resume } from './resume';
import { magazine } from './magazine';
import { readme } from './readme';
import type { Concept } from './types';

/**
 * 목록 순서가 화면 순서다. 시안을 늘리려면 여기 한 줄만 추가한다.
 *
 * 순서는 **차분한 쪽 → 튀는 쪽** 으로 둔다. 앞쪽이 학회·기업 지원에 무난하고,
 * 뒤로 갈수록 인상은 세지만 위험도 커진다.
 */
export const CONCEPTS: Concept[] = [
  editorial,
  swiss,
  gallery,
  resume,
  timeline,
  newspaper,
  docs,
  readme,
  bento,
  terminal,
  magazine,
  kinetic,
  soft,
  neon,
  brutal,
  retro,
];

export type { Concept, ConceptProps } from './types';
