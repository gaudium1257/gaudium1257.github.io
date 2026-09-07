import { describe, expect, it } from 'vitest';
import { contentSchemas, specCategorySchema, type ContentKind } from '@portfolio/content';
import { FORM_FIELDS } from './forms';

/**
 * 폼과 스키마가 어긋나면 **편집할 수 없는 필드**가 조용히 생긴다.
 * 스키마에 필드를 추가하고 폼에 빠뜨리는 건 시간 문제라, 기계가 잡게 한다 (CB-3).
 */

const KINDS = Object.keys(contentSchemas) as ContentKind[];

describe('폼 명세와 스키마 정합', () => {
  for (const kind of KINDS) {
    it(`${kind}: 스키마의 모든 필드가 폼에 있다`, () => {
      const schemaFields = Object.keys(contentSchemas[kind].shape).sort();
      const formFields = FORM_FIELDS[kind].map((f) => f.name).sort();
      expect(formFields).toEqual(schemaFields);
    });

    it(`${kind}: 필드 이름이 중복되지 않는다`, () => {
      const names = FORM_FIELDS[kind].map((f) => f.name);
      expect(new Set(names).size).toBe(names.length);
    });

    it(`${kind}: select 필드는 선택지를 갖는다`, () => {
      for (const field of FORM_FIELDS[kind]) {
        if (field.kind === 'select') {
          expect(field.options?.length ?? 0).toBeGreaterThan(0);
        }
      }
    });
  }

  it('분류 선택지가 스키마 enum 과 일치한다', () => {
    const field = FORM_FIELDS.spec.find((f) => f.name === 'category');
    const optionValues = (field?.options ?? []).map((o) => o.value).sort();
    expect(optionValues).toEqual([...specCategorySchema.options].sort());
  });

  it('모든 종류에 폼이 있다', () => {
    expect(Object.keys(FORM_FIELDS).sort()).toEqual(KINDS.sort());
  });
});
