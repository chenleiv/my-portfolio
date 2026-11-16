import { profile } from "../../content/profile";
import { HeroIntro } from "./HeroIntro";

export default function Hero() {
  return (
    <div className="hero">
      <p className="hero__eyebrow hero__name">{profile.name}</p>
      <h1 className="hero__title">{profile.title}</h1>
      {/* CSS shows one version: the short one on phones. Only the visible one is read. */}
      <p className="hero__eyebrow hero__tagline">
        <span className="hero__tagline-full">{profile.tagline}</span>
        <span className="hero__tagline-short">{profile.taglineShort}</span>
      </p>
      <HeroIntro text={profile.intro} />
    </div>
  );
}
