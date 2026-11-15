import Link from "next/link";
import { profile } from "../../content/profile";

export default function Hero() {
  return (
    <div className="hero">
      <p className="hero__eyebrow">{profile.name}</p>
      <h1 className="hero__title">{profile.title}</h1>
      <p className="hero__eyebrow">{profile.tagline}</p>
      <p className="hero__intro">{profile.intro}</p>
      <Link href="/console" className="hero__link">
        Try the interactive console →
      </Link>
    </div>
  );
}
