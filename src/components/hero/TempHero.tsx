import Link from "next/link";
import { profile } from "../../content/profile";

// Temporary hero shown on the home page until the new design lands.
export default function TempHero() {
  return (
    <div className="temp-hero">
      <h1 className="temp-hero__name">{profile.name}</h1>
      <p className="temp-hero__title">{profile.title}</p>
      <p className="temp-hero__tagline">{profile.tagline}</p>
      <p className="temp-hero__intro">{profile.intro}</p>
      <Link href="/console" className="temp-hero__link">
        Try the interactive console →
      </Link>
    </div>
  );
}
