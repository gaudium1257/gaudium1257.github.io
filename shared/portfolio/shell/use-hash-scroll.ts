import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 해시가 가리키는 요소로 스크롤한다 (EP-0010).
 *
 * 브라우저는 **첫 로드에서만** 해시로 스크롤한다. 앱 안에서 이동할 때는
 * 주소만 바뀌고 화면은 그대로다 — 검색 결과를 눌러도 그 항목으로 가지 않는다.
 *
 * 한 번만 시도하면 안 된다. 페이지를 막 옮긴 참이라 **레이아웃이 아직 안 잡혀 있고**,
 * 그 상태에서 스크롤하면 엉뚱한 위치에 멈춘다 (실측: 1240px 지점을 116px 로 계산했다).
 * 그래서 스크롤 결과가 **더 이상 변하지 않을 때까지** 반복한다.
 *
 * `behavior: 'smooth'` 는 쓰지 않는다. 컴포지터 상태에 따라 조용히 아무 일도 안 하고
 * 끝나는 경우가 있고, 1000px 넘는 점프는 애니메이션으로 보여줘봐야 방향만 잃는다.
 *
 * `requestAnimationFrame` 도 쓰지 않는다. **보이지 않는 탭에서는 호출되지 않아서**
 * 배경 탭으로 연 링크가 엉뚱한 위치에 머문다 (실측으로 확인했다). `setTimeout` 은 그런 탭에서도 돈다.
 */
/** 대상을 찾을 때까지 기다리는 횟수 (50ms × 20 = 1초) */
const MAX_LOOKUPS = 20;
const RETRY_MS = 50;
/** 늦게 잡히는 레이아웃을 위한 보정 — **딱 한 번만** 한다 */
const CORRECTION_MS = 150;

export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    const timers: number[] = [];
    let lookups = 0;

    function scrollTo(target: HTMLElement) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    }

    function findAndScroll() {
      const target = document.getElementById(id);
      if (!target) {
        if (++lookups < MAX_LOOKUPS) timers.push(window.setTimeout(findAndScroll, RETRY_MS));
        return;
      }

      scrollTo(target);

      /*
       * 보정은 한 번뿐이다. "위치가 안정될 때까지 반복" 은 폭주한다 —
       * 뷰포트 높이가 이상한 상황에서 문서 끝까지 스크롤되는 것을 실측했다.
       * 조금 어긋나는 것이 엉뚱한 데로 가는 것보다 낫다.
       */
      timers.push(
        window.setTimeout(() => {
          const still = document.getElementById(id);
          if (still) scrollTo(still);
        }, CORRECTION_MS),
      );
    }

    findAndScroll();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [pathname, hash]);
}
