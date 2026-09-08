import { editorial } from './editorial';
import { terminal } from './terminal';
import { brutal } from './brutal';
import { kinetic } from './kinetic';
import { soft } from './soft';
import { timeline } from './timeline';
import type { Concept } from './types';

/** 목록 순서가 화면 순서다. 시안을 늘리려면 여기 한 줄만 추가한다 */
export const CONCEPTS: Concept[] = [editorial, terminal, brutal, kinetic, soft, timeline];

export type { Concept, ConceptProps } from './types';
