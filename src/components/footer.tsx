import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/profile";

export function Footer() {
  const links = [
    { href: profile.socials.github, label: "GitHub", icon: Github },
    { href: profile.socials.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
  ];

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js & Framer Motion.
        </p>
        <div className="flex items-center gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-fg"
            >
              <Icon className="size-4" />
            </a>
          ))}
          <a
            href="#home"
            aria-label="Back to top"
            className="ml-2 grid size-10 place-items-center rounded-full bg-white/5 text-fg transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
