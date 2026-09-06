import type { Profile } from '@/shared/content';

/** 첫 화면 상단. 심사자가 30초 안에 파악해야 할 것만 담는다 (PRODUCT_SENSE). */
export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
      <p className="text-lg text-muted-foreground">{profile.headline}</p>
      {profile.affiliation ? (
        <p className="text-sm text-muted-foreground">{profile.affiliation}</p>
      ) : null}
      {profile.summary ? <p className="max-w-2xl text-sm">{profile.summary}</p> : null}
      {profile.links.length > 0 ? <ProfileLinks profile={profile} /> : null}
    </header>
  );
}

function ProfileLinks({ profile }: { profile: Profile }) {
  return (
    <ul className="flex flex-wrap gap-3 pt-1">
      {profile.links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm underline underline-offset-4 hover:text-foreground"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
