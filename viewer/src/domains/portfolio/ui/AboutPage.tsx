import { usePortfolioContent } from '../state/use-content';
import { SPEC_SECTIONS } from '../config';
import { formatPeriod } from '../service/select';
import { PageHeading } from './common';

/** About — 소개 + 스펙 4개 분류 (스펙 A-1~A-4). 빈 분류는 숨긴다. */
export function AboutPage() {
  const { profile, specs } = usePortfolioContent();

  return (
    <div className="space-y-10">
      <PageHeading title="About" description={profile.headline} />

      {profile.intro ? <p className="max-w-2xl text-sm leading-relaxed">{profile.intro}</p> : null}

      {profile.links.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {profile.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm underline underline-offset-4"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {SPEC_SECTIONS.map(({ category, label }) => {
        const items = specs.filter((s) => s.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} aria-labelledby={`${category}-heading`} className="space-y-3">
            <h2
              id={`${category}-heading`}
              className="text-sm font-semibold tracking-wide uppercase"
            >
              {label}
            </h2>
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatPeriod(item.startedOn, item.endedOn)}
                    </span>
                  </div>
                  {item.organization ? (
                    <p className="text-xs text-muted-foreground">{item.organization}</p>
                  ) : null}
                  {item.description ? (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
