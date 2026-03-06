const PORTFOLIO_CONTENT = {
    PROFILE_PICTURE: "assets/me.jpeg",
    PROFILE_NAME: "Yuriy Kovalchuk",
    PROFILE_TITLE: "DevOps / Platform Engineer who sometimes code",
    GITHUB_LINK: "https://github.com/yuriy-kovalchuk",
    LINKEDIN_LINK: "https://www.linkedin.com/in/yuriy-kovalchuk/",
    BIO: `I build platforms, automate things, and occasionally pretend I’m a software developer. Big on homelabs and self-hosted setups, and fully capable of taking down my own Kubernetes clusters. I run more things on Kubernetes than necessary.

Somewhere along the way, I fell into the Neovim trap and now there’s no way out.`,
    EXPERIENCES: `
- **The Java Origins** (The Beginning)
  - Started as a Backend Dev with **Spring Boot** my first true love. Occasionally forced to write HTML/CSS, which I can confirm is the worst thing in the world.
  - Spent literal tears debugging a **15k-line PL/SQL package**. It was at this point I realized there had to be a better way to live.
- **The Container Awakening**
  - Discovered the magic of containers and never looked back. 
  - Naturally, I thought Kubernetes would be easy. I then spent three days wondering why **kind** wouldn't give me an external LoadBalancer IP. 
- **The "Fancy DevOps" Pivot**
  - Decided that being a "simple" (and admittedly bad) developer wasn't for me. I wanted to do the fancy DevOps thingy.
  - Wrangled with **AWS** and **Azure**. I've made several managers mad by telling them "all clouds are the same anyway." I'm about **69% sure I'm right**.
- **Platform Pretending** (Present)
  - Currently busy pretending to be a **Platform Engineer**. I’m still not entirely sure what the title means, but I’m building "paved roads" so others don't have to suffer like I did.`,
    RESEARCH_PHASE: `
- **[Ceph]**: Trying to figure out if I actually need a petabyte of storage or if I just like the complexity.
- **[eBPF]**: Deep diving into the kernel because normal networking was too easy.
- **[Ollama]**: Running local LLMs because I don't trust the cloud with my bad code.
- **[n8n]**: Automating the boring stuff so I can spend more time breaking things.
- **[SPIFFE/SPIRE]**: Solving the "who are you and why are you talking to me" problem for my workloads.`,
    PET_PROJECTS: [
        {
            id: "yk-helm-update-checker",
            title: "Helm Chart update checker",
            short: "A little bot that keeps an eye on my charts so I don't have to.",
            description: "I got tired of manually checking for updates, and I'm too lazy to configure Renovate",
            repo: "https://github.com/yuriy-kovalchuk/yk-helm-update-checker"
        },
        {
            id: "yk-dns-manager",
            title: "Kubernetes DNS Manager",
            short: "Automate your DNS records because my Homelab is a mess",
            description: "I was tired of manually updating records on my OPNSense every time I created a new HTTP route. This project manages my homelab DNS because if I have to do it more than twice, I'm writing a manager for it.",
            repo: "https://github.com/yuriy-kovalchuk/yk-dns-manager"
        },
        {
            id: "homelab",
            title: "Homelab",
            short: "The never-ending story of my personal infrastructure.",
            description: "This is the source of truth for my entire infrastructure. Don't try this at home. Aaaalways work in progress.",
            repo: "https://github.com/yuriy-kovalchuk/Homelab"
        },
        {
            id: "yk-portfolio",
            title: "yk-portfolio",
            short: "You are looking at it right now.",
            description: "A minimalist, terminal-themed portfolio built with vanilla JS and CSS. No React, no Tailwind, just pure monospace vibes and Vim keybindings for those who live in the CLI.",
            repo: "https://github.com/yuriy-kovalchuk/yk-portfolio"
        }
    ],
    SKILLS_CATEGORIZED: {
        "The Heavy Lifters": ["Kubernetes", "Talos Linux", "Argo CD", "Terraform", "Proxmox"],
        "Safety & Traffic": ["Cilium", "Authentik", "Vault", "OPNsense", "Gateway API"],
        "The Eye in the Sky": ["LGTM Stack", "Prometheus", "Alloy"],
        "Storage Box": ["Longhorn", "MinIO", "TrueNAS", "CloudNative-PG"],
        "The Essentials": ["Docker", "Git", "Linux", "Go", "Neovim"],
        "Shiny Toys": ["KubeVirt", "Harbor", "Devbox"]
    }
};
