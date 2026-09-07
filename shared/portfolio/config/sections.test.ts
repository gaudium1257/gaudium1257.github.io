import { describe, expect, it } from 'vitest';
import { specCategorySchema } from '@portfolio/content';
import { SPEC_SECTIONS } from './index';

/**
 * 분류를 스키마에 추가하고 표시 목록에 빠뜨리면 **저장은 되는데 화면에 안 나온다.**
 * 오류도 없어서 알아채기 어렵다 — 기계가 잡게 한다 (CB-3).
 */
describe('About 분류', () => {
  it('스키마의 모든 분류가 화면에 표시된다', () => {
    const schemaCategories = [...specCategorySchema.options].sort();
    const shown = SPEC_SECTIONS.map((section) => section.category).sort();
    expect(shown).toEqual(schemaCategories);
  });

  it('분류가 중복되지 않는다', () => {
    const categories = SPEC_SECTIONS.map((s) => s.category);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it('모든 분류에 사람이 읽는 이름이 있다', () => {
    for (const section of SPEC_SECTIONS) {
      expect(section.label.trim().length).toBeGreaterThan(0);
      // 값을 그대로 노출하지 않는다 — 'education' 이 아니라 '학력 / 학적'
      expect(section.label).not.toBe(section.category);
    }
  });
});
