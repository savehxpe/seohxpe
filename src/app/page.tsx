"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { gsap } from "gsap";
import { bio } from "./_content/bio";
import { gallery } from "./_content/gallery";
import { partners } from "./_content/partners";
import { stats } from "./_content/stats";
import { capabilities } from "./_content/services";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const capabilityCopy = [
  "Afro-surreal visuals, campaign concepts, and creative direction that make the world feel bigger.",
  "Original songs, live sessions, beat-making, recording, and rollout moments built from scratch.",
  "Natural creator-led content for brands that want culture, not forced advertising.",
] as const;

const coverArt = "/cover_art.webp";
const streamLink = "https://empire.ffm.to/handout";

const journeyArchiveImages = [
  {
    src: gallery.portraits[0].src,
    alt: gallery.portraits[0].alt,
    objectPosition: "50% 14%",
  },
  {
    src: gallery.portraits[1].src,
    alt: gallery.portraits[1].alt,
    objectPosition: "50% 24%",
  },
  {
    src: gallery.portraits[4].src,
    alt: gallery.portraits[4].alt,
    objectPosition: "50% 18%",
  },
] as const;

const journeyChips = ["Origin", "Roots", "Momentum", "HANDOUT", "Outworld"] as const;

const instagramMoments = [
  {
    embedPath: "/brand/moments/Moment_1.txt",
    permalink: "https://www.instagram.com/reel/C9XDHHMMrG4/?utm_source=ig_embed&utm_campaign=loading",
  },
  {
    embedPath: "/brand/moments/Moment_2.txt",
    permalink: "https://www.instagram.com/reel/C9htNk6NVwu/?utm_source=ig_embed&utm_campaign=loading",
  },
] as const;

const stripInstagramScript = (embedHtml: string) => embedHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim();

const getAppearanceLogoClass = (name: string) => {
  if (name === "News24") {
    return "max-h-[104px] max-w-[272px] sm:max-h-[112px] sm:max-w-[288px]";
  }

  if (name === "OkayAfrica") {
    return "max-h-[92px] max-w-[250px] sm:max-h-[104px] sm:max-w-[292px]";
  }

  if (name === "Trace") {
    return "max-h-[90px] max-w-[250px] sm:max-h-[102px] sm:max-w-[292px]";
  }

  if (name === "SABC / Channel Africa") {
    return "max-h-[94px] max-w-[252px] sm:max-h-[104px] sm:max-w-[280px]";
  }

  return "max-h-[78px] max-w-[190px] sm:max-h-[88px] sm:max-w-[230px]";
};

type AppearanceLink = {
  name: string;
  href: string;
  logo?: string;
};

const appearanceLinks: readonly AppearanceLink[] = [
  {
    name: "News24",
    href: "https://www.news24.com/life/arts-and-entertainment/music/from-a-computer-his-mom-bought-to-freddie-gibbs-savehxpes-journey-is-just-beginning-20260512-0976",
    logo: "/brand/appearances/news24/News24.webp",
  },
  { name: "MTV", href: "https://www.instagram.com/p/DMxpdvXKsxJ/", logo: "/brand/appearances/mtv/Mtv.webp" },
  { name: "SABC / Channel Africa", href: "https://twitter.com/channelafrica1/status/1956322535005397315", logo: "/brand/appearances/sabc/SABC-channel-africa.webp" },
  { name: "OkayAfrica", href: "https://www.okayafrica.com/the-best-southern-african-songs-right-now/134911", logo: "/brand/appearances/okayafrica/OkayAfrica.webp" },
  { name: "Channel O", href: "https://www.instagram.com/savehxpe/reel/DX_YTO_IPWQ/", logo: "/brand/appearances/channelO/Channel-o.webp" },
  {
    name: "Trace",
    href: "https://www.facebook.com/tracesouthernafrica/posts/tracenews-savehxpe-just-raised-the-bar-again-the-official-music-video-for-his-la/1344651187709075/",
    logo: "/brand/appearances/trace/trace.webp",
  },
  {
    name: "HNHH",
    href: "https://www.hotnewhiphop.com/990266-handout-remix-savehxpe-freddie-gibbs#google_vignette",
    logo: "/brand/appearances/hnhh/hnhh.webp",
  },
] as const;

export default function Home() {
  const [missingLogos, setMissingLogos] = useState<Set<string>>(new Set());
  const [instagramEmbeds, setInstagramEmbeds] = useState<string[]>([]);
  const [loadInstagramEmbeds, setLoadInstagramEmbeds] = useState(false);
  const [activeProofId, setActiveProofId] = useState<string | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const brandContentRef = useRef<HTMLDivElement | null>(null);
  const listenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    const revealTargets = Array.from(shell.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealTargets.forEach((target) => observer.observe(target));

    if (reducedMotion || !finePointer) {
      shell.style.setProperty("--pointer-x", "50%");
      shell.style.setProperty("--pointer-y", "18%");
      return () => {
        observer.disconnect();
      };
    }

    let frame = 0;
    let latestEvent: PointerEvent | null = null;

    const updateGlow = () => {
      if (!latestEvent) {
        return;
      }

      const rect = shell.getBoundingClientRect();
      const x = clamp(((latestEvent.clientX - rect.left) / rect.width) * 100, 0, 100);
      const y = clamp(((latestEvent.clientY - rect.top) / rect.height) * 100, 0, 100);

      shell.style.setProperty("--pointer-x", `${x}%`);
      shell.style.setProperty("--pointer-y", `${y}%`);
    };

    const scheduleGlow = (event: PointerEvent) => {
      latestEvent = event;

      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateGlow();
      });
    };

    const clearGlow = () => {
      shell.style.setProperty("--pointer-x", "50%");
      shell.style.setProperty("--pointer-y", "18%");
    };

    shell.style.setProperty("--pointer-x", "50%");
    shell.style.setProperty("--pointer-y", "18%");
    shell.addEventListener("pointermove", scheduleGlow, { passive: true });
    shell.addEventListener("pointerleave", clearGlow);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      shell.removeEventListener("pointermove", scheduleGlow);
      shell.removeEventListener("pointerleave", clearGlow);
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const node = heroRef.current;

    if (!node) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return;
    }

    const heroItems = node.querySelectorAll<HTMLElement>("[data-hero-reveal]");

    const ctx = gsap.context(() => {
      gsap.set(heroItems, { opacity: 0, y: 18 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (heroItems.length > 0) {
        tl.to(heroItems, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0.08);
      }
    }, node);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const node = listenRef.current;

    if (!node || loadInstagramEmbeds) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setLoadInstagramEmbeds(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadInstagramEmbeds(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [loadInstagramEmbeds]);

  useEffect(() => {
    if (!loadInstagramEmbeds) {
      return;
    }

    let isActive = true;

    Promise.all(
      instagramMoments.map((moment) =>
        fetch(moment.embedPath)
          .then((response) => response.text())
          .then(stripInstagramScript),
      ),
    )
      .then((embeds) => {
        if (isActive) {
          setInstagramEmbeds(embeds);
        }
      })
      .catch(() => {
        if (isActive) {
          setInstagramEmbeds([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, [loadInstagramEmbeds]);

  useEffect(() => {
    if (instagramEmbeds.length > 0) {
      (window as Window & { instgrm?: { Embeds?: { process: () => void } } }).instgrm?.Embeds?.process();
    }
  }, [instagramEmbeds]);

  useEffect(() => {
    const node = brandContentRef.current;

    if (!node) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reducedMotion || !finePointer) {
      node.style.setProperty("--brand-glow-opacity", "0");
      return;
    }

    let frame = 0;

    const updateGlow = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
      const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

      node.style.setProperty("--brand-glow-x", `${x}%`);
      node.style.setProperty("--brand-glow-y", `${y}%`);
      node.style.setProperty("--brand-glow-opacity", "1");
    };

    const scheduleGlow = (event: PointerEvent) => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateGlow(event);
      });
    };

    const clearGlow = () => {
      node.style.setProperty("--brand-glow-opacity", "0");
    };

    node.addEventListener("pointermove", scheduleGlow);
    node.addEventListener("pointerleave", clearGlow);
    node.style.setProperty("--brand-glow-x", "50%");
    node.style.setProperty("--brand-glow-y", "35%");

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      node.removeEventListener("pointermove", scheduleGlow);
      node.removeEventListener("pointerleave", clearGlow);
      node.style.setProperty("--brand-glow-opacity", "0");
    };
  }, []);

  const markLogoMissing = (name: string) => {
    setMissingLogos((current) => {
      const next = new Set(current);
      next.add(name);
      return next;
    });
  };

  const handleHashLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");

    if (!href?.startsWith("#")) {
      return;
    }

    event.preventDefault();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
    const targetId = href.slice(1);

    if (!targetId) {
      window.scrollTo({ top: 0, behavior });
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
      return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior, block: "start" });
    window.history.pushState(null, "", href);
  };

  return (
    <div ref={shellRef} className="site-shell min-h-screen bg-[#050B18] text-[#dce2f5] antialiased">
      <div className="site-shell-content relative z-10">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#071426]/76 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div className="mx-auto grid h-20 max-w-[1200px] grid-cols-[auto_auto] items-center justify-between gap-4 px-5 sm:px-6 md:px-8 lg:grid-cols-[180px_1fr_180px]">
          <Link href="#" onClick={handleHashLinkClick} aria-label="saveHXPE home" className="premium-button relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06]">
            <Image src={gallery.logo.src} alt="Outworld logo" fill sizes="44px" className="object-contain p-2" priority />
          </Link>
          <div className="hidden items-center justify-center gap-7 text-[13px] font-bold uppercase tracking-[0.09em] lg:flex">
            <Link href="#release" onClick={handleHashLinkClick} className="rounded-full px-3 py-2 text-[#bac9d3] transition-colors duration-300 hover:bg-white/10 hover:text-white">
              Latest Release
            </Link>
            <Link href="#partners" onClick={handleHashLinkClick} className="rounded-full px-3 py-2 text-[#bac9d3] transition-colors duration-300 hover:bg-white/10 hover:text-white">
              Partners
            </Link>
            <Link href="#what-i-do" onClick={handleHashLinkClick} className="rounded-full px-3 py-2 text-[#bac9d3] transition-colors duration-300 hover:bg-white/10 hover:text-white">
              What I Do
            </Link>
            <Link href="#journey" onClick={handleHashLinkClick} className="rounded-full px-3 py-2 text-[#bac9d3] transition-colors duration-300 hover:bg-white/10 hover:text-white">
              Journey
            </Link>
          </div>
          <a href={streamLink} target="_blank" rel="noopener noreferrer" className="premium-button inline-flex min-h-11 min-w-[134px] shrink-0 items-center justify-center justify-self-end rounded-full bg-white px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.08em] text-[#050B18] shadow-[0_10px_28px_rgba(46,91,255,0.22)] sm:min-w-[154px] sm:px-6 sm:text-[12px]">
            STREAM NOW
          </a>
        </div>
      </nav>

      <section ref={heroRef} className="afro-pattern-surface relative flex min-h-[640px] items-center justify-center overflow-hidden px-4 py-24 md:min-h-[700px] md:px-8 md:py-28">
        <div
          data-hero-visual
          className="hero-stage-media absolute inset-0 z-0 overflow-hidden bg-[#050B18]"
        >
          <div data-hero-parallax className="hero-stage-layer absolute inset-0">
            <Image
              src={gallery.hero.src}
              alt={gallery.hero.alt}
              fill
              sizes="100vw"
              className="object-cover object-[50%_22%] opacity-[0.95]"
              quality={65}
              priority
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_30%,rgba(46,91,255,0.16),transparent_30%),radial-gradient(circle_at_46%_36%,rgba(255,196,132,0.08),transparent_26%),linear-gradient(90deg,rgba(5,11,24,0.62)_0%,rgba(5,11,24,0.28)_36%,rgba(5,11,24,0.12)_68%,rgba(5,11,24,0.44)_100%),linear-gradient(180deg,rgba(5,11,24,0.06),rgba(5,11,24,0.2)_56%,rgba(5,11,24,0.68))]" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-90">
          <div className="absolute h-[26rem] w-[26rem] translate-x-[24%] -translate-y-[14%] rounded-full bg-[#2e5bff]/10 blur-[44px] mix-blend-screen" />
        </div>
        <div className="hero-vignette pointer-events-none absolute inset-0 z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#050B18] to-transparent" />

        <div className="relative z-20 mx-auto flex w-full max-w-[980px] justify-center text-center">
          <div className="mx-auto max-w-3xl">
            <div data-hero-reveal className="glass-panel chrome-border glow-shadow mb-5 inline-flex max-w-full items-center justify-center rounded-full bg-[rgba(6,16,33,0.62)] px-3.5 py-1.5 text-center backdrop-blur-[8px]">
              <span className="font-space-mono text-[10px] uppercase tracking-[0.24em] text-[#d7e1ee] sm:text-[11px]">
                {bio.origin} / Founder of {bio.founderOf}
              </span>
            </div>
            <h1 data-hero-reveal className="text-[clamp(3.1rem,7.2vw,5.35rem)] font-black leading-[0.96] tracking-[-0.05em] text-white drop-shadow-[0_0_16px_rgba(46,91,255,0.1)]">
              saveHXPE
            </h1>
            <p data-hero-reveal className="mx-auto mt-6 max-w-2xl text-[17px] font-medium leading-[1.75] text-[#dce5f7] md:text-[20px]">
              South African-born, Lesotho-raised recording artist, producer, and creative director.
            </p>
            <div data-hero-reveal className="mx-auto mt-8 flex w-full max-w-[500px] flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a href={streamLink} target="_blank" rel="noopener noreferrer" className="premium-button inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full bg-[#eef3ff] px-8 py-4 text-[12px] font-black uppercase tracking-[0.08em] text-[#040814] shadow-[0_12px_34px_rgba(46,91,255,0.38)] sm:w-auto sm:min-w-[166px]">
                STREAM NOW
              </a>
              <Link href="#what-i-do" onClick={handleHashLinkClick} className="premium-button glass-panel chrome-border inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full px-8 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-white sm:w-auto sm:min-w-[166px]">
                Brand Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-fade" id="release" data-reveal>
        <div className="mx-auto max-w-[1040px] px-4 md:px-8">
          <div className="mx-auto grid max-w-[920px] gap-6 lg:items-stretch">
            <div data-gsap="release-cover" className="premium-card glass-panel chrome-border group relative mx-auto w-full max-w-[380px] overflow-hidden rounded-[1.75rem] p-3 shadow-[0_22px_70px_rgba(0,0,0,0.34)]">
              <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-[#08152a]">
                <Image
                  src={coverArt}
                  alt="HANDOUT Remix cover art"
                  fill
                  sizes="(max-width: 1024px) 100vw, 430px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0),rgba(5,11,24,0.3))]" />
              </div>
            </div>
            <div data-gsap="release-text" className="premium-card glass-panel chrome-border flex min-h-[360px] flex-col items-center justify-center rounded-[1.75rem] p-6 text-center md:p-8 lg:p-10 lg:max-w-[760px] lg:justify-center">
              <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">Latest Release</p>
              <h2 className="mt-3 text-[clamp(2rem,3.4vw,3.2rem)] font-black leading-[1.05] tracking-[-0.04em] text-white">
                HANDOUT Remix
              </h2>
              <p className="mt-3 text-[20px] font-bold tracking-[-0.02em] text-[#bac9d3]">feat. Freddie Gibbs</p>
              <p className="mt-5 max-w-2xl text-[16px] leading-[1.8] text-[#bac9d3] md:text-[17px]">
                A raw African trap record about survival, ambition, and the global stage.
              </p>
              <div className="mt-7 flex w-full justify-center">
                  <a
                    href={streamLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-button inline-flex min-h-12 w-full max-w-[360px] items-center justify-center rounded-full bg-[#2e5bff] px-8 py-3 text-center text-[12px] font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_28px_rgba(46,91,255,0.3)] sm:min-w-[320px]"
                  >
                  Stream on your favourite platform
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" data-reveal onPointerLeave={() => setActiveProofId(null)}>
        <div className="mx-auto max-w-[1040px] px-4 md:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">Proof</p>
            <h2 className="mt-3 text-[clamp(1.8rem,2.7vw,2.5rem)] font-black leading-[1.12] tracking-[-0.035em] text-white">
              Audience and platform momentum.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-[1.75] text-[#bac9d3]">
              A growing footprint across music, video, and short-form culture.
            </p>
          </div>
          <div className="glass-panel chrome-border mx-auto max-w-5xl rounded-[1.6rem] p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
              <div>
                <p className="font-space-mono text-[11px] uppercase tracking-[0.24em] text-[#9caed8]">Audience trajectory</p>
                <p className="mt-1 text-[14px] leading-[1.5] text-[#bac9d3]">Hover a metric to see the movement.</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-space-mono text-[10px] uppercase tracking-[0.18em] text-[#bac9d3]">
                Last 12 months
              </div>
            </div>
            <svg viewBox="0 0 760 230" role="img" aria-label="Audience trajectory graph for Spotify Streams, Social Media Audience, YouTube Views, and Short-Form Views" className="proof-graph h-auto w-full overflow-visible">
              <defs>
                <linearGradient id="proofLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8fa8ff" />
                  <stop offset="100%" stopColor="#2e5bff" />
                </linearGradient>
                <linearGradient id="proofFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2e5bff" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#2e5bff" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="proofNodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#eef3ff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8fa8ff" stopOpacity="0.18" />
                </radialGradient>
              </defs>

              <g opacity="0.65">
                <path d="M54 34H702" stroke="rgba(184,195,255,0.08)" strokeWidth="1" strokeDasharray="2 9" />
                <path d="M54 86H702" stroke="rgba(184,195,255,0.05)" strokeWidth="1" strokeDasharray="2 9" />
                <path d="M54 138H702" stroke="rgba(184,195,255,0.05)" strokeWidth="1" strokeDasharray="2 9" />
                <path d="M54 190H702" stroke="rgba(184,195,255,0.08)" strokeWidth="1" strokeDasharray="2 9" />
              </g>

              <path data-proof-fill d="M58 128 C 112 126, 156 100, 236 92 S 386 70, 452 66 S 572 42, 654 36 L 654 196 L 58 196 Z" fill="url(#proofFill)" fillOpacity="0.14" className="pointer-events-none" style={{ pointerEvents: "none" }} />
              <path data-proof-trajectory d="M58 128 C 112 126, 156 100, 236 92 S 386 70, 452 66 S 572 42, 654 36" fill="none" stroke="rgba(184,195,255,0.16)" strokeWidth="8" strokeLinecap="round" className="pointer-events-none" style={{ pointerEvents: "none" }} />
              <path data-proof-trajectory d="M58 128 C 112 126, 156 100, 236 92 S 386 70, 452 66 S 572 42, 654 36" fill="none" stroke="url(#proofLine)" strokeWidth="4" strokeLinecap="round" className="pointer-events-none" style={{ pointerEvents: "none" }} />

              {stats.map((stat) => {
                const active = activeProofId === stat.id;

                return (
                  <g
                    key={stat.id}
                  >
                    <g
                      data-proof-node
                      className={`proof-node ${active ? "is-active" : ""}`}
                      transform={`translate(${stat.trajectory.x} ${stat.trajectory.y})`}
                      onPointerEnter={() => setActiveProofId(stat.id)}
                      onPointerLeave={() => setActiveProofId(null)}
                    >
                      <circle cx="0" cy="0" r="15" fill="rgba(46,91,255,0.1)" className="proof-node-pulse" />
                      <circle cx="0" cy="0" r="10" fill="rgba(143,168,255,0.2)" />
                      <circle cx="0" cy="0" r="5.5" fill="url(#proofNodeGlow)" />
                    </g>

                    <text x={stat.trajectory.x} y={stat.trajectory.y - 14} textAnchor="middle" className={`proof-node-value fill-[#eef3ff] text-[10px] font-black uppercase tracking-[0.16em] ${active ? "is-active" : ""}`}>
                      {stat.value}
                    </text>

                    <text x={stat.trajectory.x} y={stat.trajectory.y + 26} textAnchor="middle" className="proof-node-label fill-[#9caed8] text-[12px] font-bold uppercase tracking-[0.16em]">
                      {stat.shortLabel}
                    </text>

                    <g
                      data-proof-tooltip
                      className={`proof-tooltip pointer-events-none ${active ? "is-active" : ""}`}
                      transform={`translate(${stat.trajectory.tooltipX} ${stat.trajectory.tooltipY})`}
                    >
                      <rect x="0" y="0" width="212" height="34" rx="17" fill="rgba(7,20,38,0.94)" stroke="rgba(255,255,255,0.12)" />
                      <text x="14" y="22" className="fill-white text-[11px] font-black uppercase tracking-[0.12em]">
                        {stat.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              <text x="58" y="218" className="fill-[#8fa8ff] text-[11px] font-bold uppercase tracking-[0.24em]">Earliest</text>
              <text x="654" y="218" textAnchor="end" className="fill-[#8fa8ff] text-[11px] font-bold uppercase tracking-[0.24em]">Latest</text>
            </svg>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div
                key={stat.id}
                data-gsap="stat-card"
                data-proof-card
                className={`proof-card glass-panel chrome-border group rounded-[1.35rem] p-5 md:p-6 ${activeProofId === stat.id ? "is-active" : ""}`}
                onPointerEnter={() => setActiveProofId(stat.id)}
                onPointerLeave={() => setActiveProofId(null)}
              >
                <p className="text-[clamp(1.75rem,2.8vw,2.3rem)] font-black tracking-[-0.04em] text-white tabular-nums">
                  <span
                    data-proof-count
                    data-count-target={stat.countUp.value}
                    data-count-unit={stat.countUp.unit}
                    data-count-precision={stat.countUp.precision}
                    className="inline-block min-w-[5ch]"
                    >
                    {stat.value}
                  </span>
                </p>
                <p className="mt-3 font-space-mono text-[11px] uppercase tracking-[0.18em] text-[#9caed8]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="built" data-reveal>
        <div className="mx-auto max-w-[980px] px-4 text-center md:px-8">
          <div className="glass-panel chrome-border grid items-center gap-7 rounded-[1.75rem] p-6 md:p-8 lg:p-10">
            <div>
              <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">Direction</p>
              <h2 className="mx-auto mt-3 max-w-3xl text-[clamp(1.65rem,2.4vw,2.35rem)] font-black leading-[1.12] tracking-[-0.035em] text-white">
                Built for music, culture, and brand worlds.
              </h2>
            </div>
            <div className="relative h-[220px] overflow-hidden rounded-[1.25rem] bg-[#08152a] md:h-[260px]">
              <Image src={gallery.btsStills[1].src} alt={gallery.btsStills[1].alt} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover opacity-[0.9]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.04),rgba(5,11,24,0.28))]" />
            </div>
          </div>
        </div>
      </section>

      <section id="partners" data-reveal>
        <div className="mx-auto max-w-[1040px] px-4 md:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">Partners</p>
            <h2 className="mt-3 text-[clamp(1.75rem,2.6vw,2.45rem)] font-black leading-[1.16] tracking-[-0.03em] text-white">
              Brands & Platforms
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-[1.75] text-[#bac9d3]">
              Logos on the board — from music to culture to campaigns.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {partners.map((partner) => (
              <div key={partner.name} className="premium-card glass-panel chrome-border flex min-h-[164px] items-center justify-center rounded-[1.5rem] p-7">
                {missingLogos.has(partner.name) ? (
                  <span className="text-[16px] font-black uppercase tracking-[0.04em] text-white">{partner.name}</span>
                ) : (
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={320}
                    height={140}
                    loading="lazy"
                    className={`${partner.name === "kfc" ? "max-h-[136px] max-w-[276px]" : partner.name === "stem" || partner.name === "since-the-80s" ? "max-h-[124px] max-w-[258px]" : "max-h-[112px] max-w-[252px]"} w-auto object-contain object-center opacity-100 brightness-110 transition-opacity duration-300`}
                    onError={() => markLogoMissing(partner.name)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="what-i-do" data-reveal className="afro-pattern-surface">
        <div id="capabilities" className="mx-auto max-w-[1040px] px-4 md:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">What I Do</p>
            <h2 className="mt-3 text-[clamp(1.75rem,2.6vw,2.45rem)] font-black leading-[1.16] tracking-[-0.03em] text-white">
              Culture-led work across visuals, audio, and content.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {capabilities.map((capability, index) => (
              <div key={capability} data-gsap="service-card" className="afro-frame premium-card glass-panel chrome-border group overflow-hidden rounded-[1.5rem]">
                <div className="relative h-[240px] overflow-hidden bg-[#08152a] md:h-[280px]">
                  <Image
                    src={index === 0 ? gallery.portraits[0].src : index === 1 ? gallery.btsStills[2].src : gallery.portraits[3].src}
                    alt={index === 0 ? gallery.portraits[0].alt : index === 1 ? gallery.btsStills[2].alt : gallery.portraits[3].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover opacity-[0.86] transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.08),rgba(5,11,24,0.82))]" />
                </div>
                <div className="p-7 text-center md:p-8">
                  <p className="font-space-mono text-[11px] uppercase tracking-[0.2em] text-[#8fa8ff]">0{index + 1}</p>
                  <h3 className="mt-3 text-[clamp(1.35rem,2vw,1.6rem)] font-black leading-[1.18] tracking-[-0.03em] text-white">{capability}</h3>
                  <p className="mx-auto mt-4 max-w-[28rem] text-[15px] leading-[1.75] text-[#bac9d3]">{capabilityCopy[index]}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            id="brand-content"
            ref={brandContentRef}
            className="afro-frame brand-content-surface glass-panel chrome-border mx-auto mt-8 max-w-5xl rounded-[1.75rem] p-6 text-center md:p-9"
            style={{
              ["--brand-glow-x" as string]: "50%",
              ["--brand-glow-y" as string]: "35%",
              ["--brand-glow-opacity" as string]: 0,
            } as CSSProperties}
          >
            <div aria-hidden="true" className="brand-content-glow" />
            <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">Brand Content</p>
            <h3 data-gsap="brand-content-title" className="mx-auto mt-3 max-w-3xl text-[clamp(1.6rem,2.4vw,2.25rem)] font-black leading-[1.16] tracking-[-0.03em] text-white">
              Content that moves with culture.
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-[1.75] text-[#bac9d3]">
              Creator-led content built for culture, not ads.
            </p>
            <div className="mx-auto mt-7 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {["Sponsored videos", "Product moments", "Creator collabs", "Reels & TikToks", "Brand storytelling"].map((item) => (
                <div key={item} data-gsap="brand-content-card" className="premium-card brand-content-card flex min-h-[76px] items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.045] px-4 py-4 text-[13px] font-bold leading-[1.35] text-[#dce2f5]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="journey"
        data-reveal
        className="afro-pattern-surface journey-section"
      >
        <div id="world" className="mx-auto max-w-[1040px] px-4 md:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <h2 className="mx-auto max-w-3xl text-[clamp(1.6rem,2.2vw,2.15rem)] font-black leading-[1.08] tracking-[-0.035em] text-white">
                  The path from the outside in.
                </h2>
                <p className="mx-auto max-w-3xl text-[16px] leading-[1.85] text-[#bac9d3]">
                  Started creating young, shaped by South African and Lesotho roots, then carried the sound into a wider world through music, visuals, and Outworld.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
                {journeyArchiveImages.map((image, index) => (
                  <div key={image.alt} data-journey-card className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[#08152a] md:aspect-[5/6] lg:aspect-[4/5]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      style={{ objectPosition: image.objectPosition }}
                      className={`object-cover ${index === 0 ? "opacity-[0.97]" : index === 1 ? "opacity-[0.95]" : "opacity-[0.96]"}`}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.02),rgba(5,11,24,0.12)_56%,rgba(5,11,24,0.34))]" />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2.5">
                {journeyChips.map((item) => (
                  <span
                    key={item}
                    data-journey-chip
                    className="journey-chip inline-flex min-h-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#dce2f5]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="listen" ref={listenRef} data-reveal>
        <div className="mx-auto max-w-[1040px] px-4 md:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">Listen / Follow</p>
            <h2 className="mt-3 text-[clamp(1.85rem,2.7vw,2.55rem)] font-black leading-[1.12] tracking-[-0.035em] text-white">
              Music platforms and channels.
            </h2>
          </div>
          <div className="grid gap-5">
            <div data-gsap="listen-embed" className="premium-card glass-panel chrome-border rounded-[1.5rem] p-4 md:p-5">
              <iframe
                title="saveHXPE Spotify playlist embed"
                data-testid="embed-iframe"
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/playlist/73LF9Se3jSzhEmDL1CWvUR?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="mx-auto block max-w-[660px]"
              />
            </div>
            <div data-gsap="listen-embed" className="premium-card glass-panel chrome-border rounded-[1.5rem] p-4 md:p-5">
              <iframe
                title="saveHXPE Apple Music artist embed"
                allow="autoplay *; encrypted-media *;"
                frameBorder="0"
                height="450"
                style={{ width: "100%", maxWidth: "660px", overflow: "hidden", background: "transparent" }}
                sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                src="https://embed.music.apple.com/za/artist/savehxpe/1602717165"
                loading="lazy"
                className="mx-auto block rounded-[12px]"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a href="https://youtube.com/channel/UCv6kgsU8C78QgqtSBnnzLng?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="premium-button inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-[#2e5bff] px-8 py-4 text-[12px] font-black uppercase tracking-[0.08em] text-white shadow-[0_14px_32px_rgba(46,91,255,0.28)]">
              YouTube
            </a>
            <a href="https://audiomack.com/savehxpe" target="_blank" rel="noopener noreferrer" className="premium-button glass-panel chrome-border inline-flex min-h-[3.25rem] items-center justify-center rounded-full px-8 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-white">
              Audiomack
            </a>
            <a href="https://www.instagram.com/savehxpe/" target="_blank" rel="noopener noreferrer" className="premium-button glass-panel chrome-border inline-flex min-h-[3.25rem] items-center justify-center rounded-full px-8 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-white">
              Instagram
            </a>
            <a href={streamLink} target="_blank" rel="noopener noreferrer" className="premium-button inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-[#eef3ff] px-8 py-4 text-[12px] font-black uppercase tracking-[0.08em] text-[#040814] shadow-[0_12px_34px_rgba(46,91,255,0.28)]">
              Stream HANDOUT
            </a>
          </div>
          <div className="mx-auto mt-12 max-w-5xl text-center">
            <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">Top Instagram Moments</p>
            <p className="mx-auto mt-3 max-w-2xl text-[16px] leading-[1.75] text-[#bac9d3]">
              Rollout moments, performances, and creative sparks from @savehxpe.
            </p>
            <div className="mt-7 grid gap-5">
              {instagramMoments.map((moment, index) => (
                <div key={moment.permalink} className="premium-card instagram-moment-card glass-panel chrome-border mx-auto flex w-full max-w-[540px] justify-center overflow-hidden rounded-[1.5rem] p-3 md:p-4">
                  <div
                    className="instagram-embed-shell w-full"
                    data-moment-permalink={moment.permalink}
                    dangerouslySetInnerHTML={{ __html: instagramEmbeds[index] ?? "" }}
                  />
                </div>
              ))}
            </div>
          </div>
          {loadInstagramEmbeds ? (
            <Script
              id="instagram-embed-script"
              src="https://www.instagram.com/embed.js"
              strategy="lazyOnload"
              onReady={() => {
                (window as Window & { instgrm?: { Embeds?: { process: () => void } } }).instgrm?.Embeds?.process();
              }}
            />
          ) : null}
        </div>
      </section>

      <section id="contact" data-reveal>
        <div className="mx-auto max-w-[1040px] px-4 md:px-8">
          <div className="premium-card glass-panel chrome-border rounded-[1.75rem] p-6 text-center md:p-10">
            <p className="font-space-mono text-[12px] uppercase tracking-[0.24em] text-[#bac9d3]">Collaborations</p>
            <div className="mx-auto mt-4 flex max-w-4xl flex-col items-center justify-between gap-8">
              <div className="max-w-3xl space-y-4 text-[clamp(1.2rem,1.55vw,1.45rem)] font-black leading-[1.45] tracking-[-0.025em] text-white">
                <p>Let’s build something people can feel.</p>
                <p>I work with artists, brands, and communities that want culture to feel real, not forced.</p>
                <p>If you’re building something with taste, intention, and a story behind it, let’s make it personal.</p>
              </div>
              <a href="https://www.instagram.com/savehxpe/" target="_blank" rel="noreferrer" className="premium-button inline-flex min-h-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#2e5bff] px-8 py-4 text-[12px] font-black uppercase tracking-[0.08em] text-white shadow-[0_14px_32px_rgba(46,91,255,0.28)]">
                Start a Conversation
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="afro-pattern-surface footer-outworld mt-16 w-full overflow-hidden rounded-t-[1.5rem] text-[13px] font-medium text-[#bac9d3] md:mt-20">
        <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8 md:py-12 lg:py-14">
          <div className="afro-frame footer-portal grid gap-8 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(3,10,24,0.32)] md:p-7 lg:grid-cols-[1.12fr_1.18fr_0.92fr] lg:gap-12 lg:p-8 xl:grid-cols-[1.14fr_1.22fr_0.9fr] xl:gap-14">
            <div className="min-w-0 space-y-5">
              <div className="space-y-4">
                <p className="font-space-mono text-[11px] uppercase tracking-[0.24em] text-[#8fa8ff]/72">Closing portal</p>
                <h2 className="max-w-[24rem] text-[clamp(2.15rem,3.4vw,3.55rem)] font-black leading-[0.96] tracking-[-0.055em] text-white">
                  saveHXPE / Outworld
                </h2>
                <div className="h-px w-16 bg-white/12" />
                <p className="max-w-[30rem] text-[15px] leading-[1.85] text-[#bac9d3]">
                  Music, visuals, and brand work from a South African-born, Lesotho-raised creator building from the outside in.
                </p>
              </div>
            </div>

            <div className="min-w-0 space-y-5">
              <div className="footer-outsiders-card space-y-3 rounded-[1.4rem] border border-white/10 bg-black/18 p-6 shadow-[inset_0_1px_0_rgba(227,242,253,0.08)] transition-transform duration-300 lg:p-7">
                <p className="font-space-mono text-[11px] uppercase tracking-[0.24em] text-[#8fa8ff]">THE OUTSIDERS</p>
                <p className="max-w-[34rem] text-[14px] leading-[1.85] text-[#dce2f5]">
                  A community for the people building from the outside in — music, ideas, rollouts, and culture in motion.
                </p>
                <a href="https://www.instagram.com/savehxpe/" target="_blank" rel="noopener noreferrer" className="footer-cta-link inline-flex min-h-[2.75rem] items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[12px] font-black uppercase tracking-[0.12em] text-white">
                  Join The Outsiders
                </a>
              </div>

              <div className="grid gap-5 rounded-[1.3rem] border border-white/8 bg-black/12 p-5 text-[13px] leading-[1.8] text-[#dce2f5] md:p-6 lg:gap-6 lg:p-6">
                <div className="min-w-0">
                  <p className="font-space-mono text-[10px] uppercase tracking-[0.22em] text-[#8fa8ff]">Available for</p>
                  <div className="mt-2 space-y-1.5 normal-case tracking-normal text-[#bac9d3]">
                    <p>Brand work</p>
                    <p className="max-w-[10rem] sm:max-w-none sm:whitespace-nowrap">Music collaborations</p>
                    <p>Creative direction</p>
                    <p>Interviews</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-space-mono text-[10px] uppercase tracking-[0.22em] text-[#8fa8ff]">Location</p>
                  <p className="mt-2 max-w-[12rem] normal-case tracking-normal text-[#bac9d3] sm:max-w-none sm:whitespace-nowrap">South African-born / Lesotho-raised</p>
                  <p className="mt-4 font-space-mono text-[10px] uppercase tracking-[0.22em] text-[#8fa8ff]">Contact</p>
                  <a href="mailto:katamba@365management.net" className="footer-link mt-2 inline-flex max-w-full normal-case leading-[1.5] tracking-normal text-[#bac9d3] [overflow-wrap:anywhere]">
                    katamba@365management.net
                  </a>
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-6">
              <div className="min-w-0">
                <p className="font-space-mono text-[11px] uppercase tracking-[0.22em] text-[#8fa8ff]">Navigation</p>
                <div className="mt-4 flex flex-col gap-3 text-[14px] leading-[1.45] text-white">
                  <Link href="#release" onClick={handleHashLinkClick} className="footer-link">Latest Release</Link>
                  <Link href="#partners" onClick={handleHashLinkClick} className="footer-link">Partners</Link>
                  <Link href="#what-i-do" onClick={handleHashLinkClick} className="footer-link">What I Do</Link>
                  <Link href="#journey" onClick={handleHashLinkClick} className="footer-link">Journey</Link>
                </div>
              </div>

              <div className="min-w-0">
                <p className="font-space-mono text-[11px] uppercase tracking-[0.22em] text-[#8fa8ff]">Social</p>
                <div className="mt-4 flex flex-col gap-3 text-[14px] leading-[1.45] text-white">
                  <a href="https://www.instagram.com/savehxpe/" target="_blank" rel="noopener noreferrer" className="footer-link">
                    Instagram
                  </a>
                  <a href="https://youtube.com/channel/UCv6kgsU8C78QgqtSBnnzLng?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="footer-link">
                    YouTube
                  </a>
                  <a href="https://audiomack.com/savehxpe" target="_blank" rel="noopener noreferrer" className="footer-link">
                    Audiomack
                  </a>
                  <a href={streamLink} target="_blank" rel="noopener noreferrer" className="footer-link">
                    Stream HANDOUT
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
