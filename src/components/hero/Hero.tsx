import { profile } from "../../content/profile";
import { HeroIntro } from "./HeroIntro";

export default function Hero() {
  return (
    <div className="hero">
      <p className="hero__eyebrow">{profile.name}</p>
      <h1 className="hero__title">{profile.title}</h1>
      <p className="hero__eyebrow">{profile.tagline}</p>
      <HeroIntro text={profile.intro} />
    </div>
  );
}
