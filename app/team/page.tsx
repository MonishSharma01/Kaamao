"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

// Full details for all 7 team members
const TEAM_MEMBERS = [
  {
    name: "Sabnis Akshat Shailesh",
    role: "Founder & CEO",
    bio: "Akshat is the visionary founder of Kaamao, leading corporate strategy, business development, and key growth partnerships. He is focused on bridging the gap between local talent and economic opportunities.",
    initials: "AS",
    image: "/assets/teams/akshat.jpeg",
    gradient: "from-amber-500 via-orange-500 to-red-600",
    skills: ["Corporate Strategy", "Venture Capital", "Growth Hacking", "Leadership", "Business Ops", "Partnerships"],
    socials: {
      github: "https://github.com/dontknowhowtocode69",
      linkedin: "https://www.linkedin.com/in/akshat-sabnis-84a139336/",
      email: "mailto:sabnisakshat5@gmail.com",
    },
  },
  {
    name: "Pathinenchil Indresh Suresh",
    role: "Co-Founder & CTO",
    bio: "Indresh is a passionate engineer specializing in full-stack architecture, database design, and cloud deployments. He drives the technical vision, focusing on building high-performance, accessible, and secure platform architectures.",
    initials: "IS",
    image: "/assets/teams/indresh.jpeg",
    gradient: "from-blue-600 via-indigo-600 to-indigo-700",
    skills: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "System Architecture", "Cloud Deployments"],
    socials: {
      github: "https://github.com/indresh404",
      linkedin: "https://www.linkedin.com/in/indresh-suresh-093646399",
      email: "mailto:indreshsuresh95@gmail.com",
    },
  },
  {
    name: "Sharma Monish Mukesh",
    role: "Co-Founder & Product Lead",
    bio: "Monish leads the product strategy and user experience design at Kaamao. With a background in user research and agile growth, he ensures the platform remains incredibly intuitive for all community members.",
    initials: "MS",
    image: "/assets/teams/monish.jpeg",
    gradient: "from-cyan-500 via-blue-500 to-blue-600",
    skills: ["Product Strategy", "UX Design", "Wireframing", "User Research", "Product Analytics", "Agile PM"],
    socials: {
      github: "https://github.com/MonishSharma01",
      linkedin: "https://www.linkedin.com/in/monish-sharma-16799b3b5/",
      email: "mailto:monishsharma0107@gmail.com",
    },
  },
  {
    name: "Sharma Shashank Rajesh",
    role: "Marketing & Operations",
    bio: "Shashank manages marketing strategy, public relations, and operational workflows. He focuses on scaling user acquisition, building community trust, and running localized outreach campaigns.",
    initials: "SS",
    image: "/assets/teams/shashank.jpeg",
    gradient: "from-teal-500 via-emerald-500 to-green-600",
    skills: ["Growth Marketing", "Public Relations", "Brand Strategy", "Community Ops", "Content Marketing", "SEO"],
    socials: {
      github: "https://github.com/shashsharmaa",
      linkedin: "https://www.linkedin.com/in/shashank-sharma-2376993b8/",
      email: "mailto:shashanksharmatech2476@gmail.com",
    },
  },
  {
    name: "Pandey Utkarsh Ramesh",
    role: "Software Developer",
    bio: "Utkarsh is a software developer focusing on frontend features, interactive user interfaces, and state management. He ensures a smooth, highly responsive, and accessible user experience across all devices.",
    initials: "UP",
    image: "/assets/teams/utkarsh.jpeg",
    gradient: "from-purple-500 via-pink-500 to-indigo-600",
    skills: ["React", "Tailwind CSS", "Frontend Architecture", "State Management", "UI/UX", "Framer Motion"],
    socials: {
      github: "https://github.com/utkarshpan",
      linkedin: "https://www.linkedin.com/in/utkarsh-pandey-95507631b/",
      email: "mailto:pandeyutkarsh870@gmail.com",
    },
  },
  {
    name: "Sharma Divya Gurudev",
    role: "Software Developer",
    bio: "Divya specializes in backend services, API integrations, and database performance. Divya works on optimizing search algorithms and queries to keep local discoverability fast and reliable.",
    initials: "DS",
    image: "/assets/teams/divya.jpeg",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    skills: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST APIs", "Query Optimization"],
    socials: {
      github: "https://github.com/divyagsharma2006-blip",
      linkedin: "https://www.linkedin.com/in/divya-sharma-57673536b/",
      email: "mailto:divyagsharma2006@gmail.com",
    },
  },
  {
    name: "Rajbhar Ankita Ganesh",
    role: "Software Developer",
    bio: "Ankita is a software developer focused on frontend implementation, API integrations, and quality assurance. Ankita ensures code reliability and consistent UI across core flows.",
    initials: "AR",
    image: "/assets/teams/ankita.jpeg",
    gradient: "from-rose-500 via-pink-500 to-red-600",
    skills: ["React", "TypeScript", "Vitest", "Playwright", "API Integration", "Git Workflows"],
    socials: {
      github: "https://github.com/Ankita0325",
      linkedin: "https://www.linkedin.com/in/ankita-rajbhar-303a01307/",
      email: "mailto:ankitar1979@gmail.com",
    },
  },
];

// Reusable Image component that handles load error gracefully and shows a fallback icon
function TeamMemberImage({ src, name, initials }: { src: string; name: string; initials: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 select-none">
        <Icon name="person" className="text-6xl text-slate-350 dark:text-slate-600" fill />
        <span className="text-[11px] font-extrabold tracking-wider uppercase mt-1 text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2.5 py-0.5 rounded">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover rounded-full"
    />
  );
}

// Map of member gradients to premium colored shadows and border glows on hover
const hoverShadowClasses: Record<string, string> = {
  "from-amber-500 via-orange-500 to-red-600": "hover:shadow-[0_20px_50px_rgba(249,115,22,0.18)] hover:border-orange-350 dark:hover:border-orange-500/35",
  "from-blue-600 via-indigo-600 to-indigo-700": "hover:shadow-[0_20px_50px_rgba(37,99,235,0.18)] hover:border-blue-350 dark:hover:border-blue-500/35",
  "from-cyan-500 via-blue-500 to-blue-600": "hover:shadow-[0_20px_50px_rgba(6,182,212,0.18)] hover:border-cyan-350 dark:hover:border-cyan-500/35",
  "from-teal-500 via-emerald-500 to-green-600": "hover:shadow-[0_20px_50px_rgba(20,184,166,0.18)] hover:border-teal-350 dark:hover:border-teal-500/35",
  "from-purple-500 via-pink-500 to-indigo-600": "hover:shadow-[0_20px_50px_rgba(168,85,247,0.18)] hover:border-purple-350 dark:hover:border-purple-500/35",
  "from-violet-600 via-purple-600 to-indigo-700": "hover:shadow-[0_20px_50px_rgba(124,58,237,0.18)] hover:border-violet-350 dark:hover:border-violet-500/35",
  "from-rose-500 via-pink-500 to-red-600": "hover:shadow-[0_20px_50px_rgba(244,63,94,0.18)] hover:border-rose-350 dark:hover:border-rose-500/35",
};

// Reusable Card Component ensuring exact same size and layout
function TeamMemberCard({ member }: { member: typeof TEAM_MEMBERS[0] }) {
  const [view, setView] = useState<"bio" | "skills">("bio");
  const hoverGlow = hoverShadowClasses[member.gradient] || "hover:shadow-2xl hover:border-blue-100 dark:hover:border-slate-800";

  return (
    <div className={`w-full max-w-[340px] h-[520px] bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100/80 dark:border-slate-800 shadow-lg shadow-slate-100/40 dark:shadow-slate-950/40 flex flex-col justify-between overflow-hidden group hover:-translate-y-2 transition-all duration-300 mx-auto ${hoverGlow}`}>
      {/* Decorative Card Header with Grid overlay */}
      <div className={`h-32 w-full bg-gradient-to-tr ${member.gradient} relative overflow-hidden shrink-0`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse-subtle" />
      </div>

      {/* Circular Profile Image Container with Glow Hover Ring */}
      <div className="relative w-[144px] h-[144px] -mt-[72px] mx-auto rounded-full p-1 bg-gradient-to-tr from-slate-200 to-slate-350 dark:from-slate-750 dark:to-slate-850 shadow-md overflow-hidden shrink-0 z-10 group-hover:from-brand-primary group-hover:to-brand-teal transition-all duration-500">
        <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-white dark:bg-slate-950">
          <TeamMemberImage src={member.image} name={member.name} initials={member.initials} />
        </div>
      </div>

      {/* Card Info Content */}
      <div className="flex-grow flex flex-col pt-4 px-6 pb-2 overflow-hidden">
        {/* Card Tab switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl mb-4 max-w-[200px] mx-auto text-[11px] font-bold select-none shrink-0 border border-slate-200/20">
          <button
            onClick={() => setView("bio")}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
              view === "bio"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                : "text-slate-400 dark:text-slate-505 hover:text-slate-650 dark:hover:text-slate-300"
            }`}
          >
            About
          </button>
          <button
            onClick={() => setView("skills")}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer ${
              view === "skills"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                : "text-slate-400 dark:text-slate-505 hover:text-slate-650 dark:hover:text-slate-300"
            }`}
          >
            Expertise
          </button>
        </div>

        {/* Dynamic Card Content Panel */}
        <div className="flex-grow flex flex-col justify-center overflow-hidden">
          {view === "bio" ? (
            <motion.div
              key="bio"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col justify-center h-full"
            >
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight text-center line-clamp-1">
                {member.name}
              </h3>
              <p className="text-[10px] font-bold text-brand-primary dark:text-brand-teal uppercase tracking-widest mt-1.5 text-center select-none bg-brand-primary-light/40 dark:bg-brand-primary-dark/20 px-3 py-1 rounded-full w-fit mx-auto">
                {member.role}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] leading-relaxed mt-4 text-center line-clamp-3 px-2">
                {member.bio}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col justify-center h-full"
            >
              <h4 className="text-[10px] font-extrabold text-slate-450 dark:text-slate-505 uppercase tracking-widest text-center mb-3 select-none">
                Skills & Tech Stack
              </h4>
              <div className="flex flex-wrap justify-center gap-1.5 overflow-y-auto max-h-[105px] px-1 py-1">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-bold text-slate-650 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 px-2.5 py-1.5 rounded-lg hover:scale-105 hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:text-brand-teal hover:border-brand-primary/20 dark:hover:border-brand-teal/20 transition-all duration-200 select-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Card Footer Connect Bar */}
      <div className="bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider select-none">
          Connect
        </span>
        <div className="flex items-center gap-2">
          {/* GitHub Icon Link */}
          <a
            href={member.socials.github}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 shadow-sm"
            aria-label="GitHub Profile"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>

          {/* LinkedIn Icon Link */}
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-[#0077b5] dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 shadow-sm"
            aria-label="LinkedIn Profile"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>

          {/* Email Icon Link */}
          <a
            href={member.socials.email}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-brand-primary dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 shadow-sm"
            aria-label="Email Member"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const topThree = TEAM_MEMBERS.slice(0, 3);
  const bottomFour = TEAM_MEMBERS.slice(3, 7);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-[Manrope,sans-serif] text-slate-800 dark:text-slate-100 selection:bg-brand-primary-light selection:text-brand-primary-dark relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/20 dark:bg-blue-900/10 rounded-full filter blur-3xl -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-100/20 dark:bg-indigo-900/10 rounded-full filter blur-3xl -z-10 animate-pulse-subtle" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-colors duration-300">
        <div className="mx-auto flex h-[64px] max-w-[1140px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group font-extrabold text-slate-900 dark:text-white text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
              <Icon name="check" fill className="text-xs text-white" />
            </div>
            Kaamao
          </Link>
          <div className="flex items-center gap-4">
            {/* Interactive Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-605 dark:text-slate-355 hover:bg-brand-bg-light dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
              title="Toggle Dark Mode"
            >
              <Icon name={isDark ? "light_mode" : "dark_mode"} className="text-xl" fill />
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary-light transition-all group"
            >
              <Icon
                name="arrow_back"
                className="text-base group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1140px] px-6 py-16">
        {/* Hero title */}
        <div className="text-center max-w-[680px] mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest bg-brand-primary-light dark:bg-brand-primary-dark/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Our Creators
            </span>
            <h1 className="text-[clamp(2.2rem,5vw,3.2rem)] font-extrabold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
              Meet the Team behind <br />
              <span className="text-brand-primary relative">
                Kaamao
                <span className="absolute left-0 bottom-1.5 w-full h-[5px] bg-brand-primary-light/60 dark:bg-brand-primary-dark/40 -z-10 rounded-full" />
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              We started with a simple belief: every community has hidden
              expertise. Our mission is to unlock these talents, build trust
              locally, and create economic opportunities right in your
              neighborhood.
            </p>
          </motion.div>
        </div>

        {/* Aligned 3 Up, 4 Below Grid Layout */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {/* Row 1: 3 cards up */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {topThree.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <TeamMemberCard member={member} />
              </motion.div>
            ))}
          </div>

          {/* Row 2: 4 cards below */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {bottomFour.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (idx + 3) * 0.05 }}
              >
                <TeamMemberCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Vision Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-[32px] p-8 md:p-12 text-center max-w-[860px] mx-auto mt-24 relative overflow-hidden shadow-2xl border border-slate-800 dark:border-slate-850"
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full filter blur-xl -translate-x-1/2 -translate-y-1/2" />
          <Icon
            name="groups"
            className="text-4xl text-brand-primary-muted mb-6"
            fill
          />
          <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-brand-primary-light">
            Our Mission
          </h3>
          <p className="text-sm md:text-base leading-relaxed max-w-[600px] mx-auto text-slate-300">
            &ldquo;Kaamao transforms skills into opportunities and local talent
            into sustainable income, bringing neighborhoods closer together
            through trusted professional networks.&rdquo;
          </p>
        </motion.div>
      </main>
    </div>
  );
}