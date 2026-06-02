const PORTFOLIO_CONTENT = {
    PROFILE_PICTURE: "assets/me.jpeg",
    PROFILE_NAME: "Yuriy Kovalchuk",
    PROFILE_TITLE: "Platform Engineer. Occasionally writes Go.",
    GITHUB_LINK: "https://github.com/yuriy-kovalchuk",
    LINKEDIN_LINK: "https://www.linkedin.com/in/yuriy-kovalchuk/",
    BIO: `I build platforms and automate things. Somewhere along the way I decided self-hosted was the right call, and now I run more services on Kubernetes than I’d like to admit.

Fell into the Neovim trap. Still in there.

If you’re reading this, the cluster is still up. I’m as surprised as you are.`,
    EXPERIENCES: `
- **The Java Origins** (The Beginning)
  - Started as a backend dev with **Spring Boot**. Got voluntold to write HTML/CSS. Spent a meaningful portion of my career debugging a **15k-line PL/SQL package**.
- **The Container Awakening**
  - Discovered containers. Decided Kubernetes would be straightforward. Spent three days figuring out why **kind** wouldn’t hand out a LoadBalancer IP.
- **The DevOps Pivot**
  - Moved into platform work. Wrangled **AWS** and **Azure**. Told several managers all clouds are fundamentally the same. Still stand by it.
- **Platform Engineering** (Present)
  - Building paved roads so others don’t rediscover the same potholes. The title is vague but the work is real.`,
    RESEARCH_PHASE: `
- **[Ceph]**: Determining whether I actually need distributed storage at this scale or just enjoy the operational complexity.
- **[eBPF]**: Going deeper into the kernel because regular networking felt too solved.
- **[llama.cpp]**: Running local LLMs. Mostly because I can.
- **[n8n]**: Automating the things that stopped needing to be manual.
- **[SPIFFE/SPIRE]**: Solving workload identity properly instead of throwing service account tokens at it.`,
    PET_PROJECTS: [
        {
            id: "yk-talos-management",
            title: "Talos Management Operator",
            short: "A Kubernetes operator for Talos clusters. talosctl is for people with free time.",
            description: "Manages the full lifecycle of Talos Linux clusters through CRDs — PKI, machine configs, node provisioning, etcd bootstrap, upgrades. The whole thing, declaratively.",
            repo: "https://github.com/yuriy-kovalchuk/yk-talos-management"
        },
        {
            id: "yk-helm-update-checker",
            title: "Helm Chart Update Checker",
            short: "Tells me when my Helm charts are out of date so I don't have to check.",
            description: "A small bot that watches Helm chart repositories and flags updates. Built because Renovate felt like overkill and manual checking felt like regression.",
            repo: "https://github.com/yuriy-kovalchuk/yk-helm-update-checker"
        },
        {
            id: "yk-dns-manager",
            title: "Kubernetes DNS Manager",
            short: "Manages homelab DNS so I don't have to touch OPNsense every time.",
            description: "Watches Kubernetes HTTP routes and syncs DNS records automatically. Written after updating OPNsense manually for the third time in a week.",
            repo: "https://github.com/yuriy-kovalchuk/yk-dns-manager"
        },
        {
            id: "homelab",
            title: "Homelab",
            short: "The source of truth for my home infrastructure. Perpetually in progress.",
            description: "Everything running in my homelab, codified. The kind of project that's never finished, just temporarily stable.",
            repo: "https://github.com/yuriy-kovalchuk/Homelab"
        },
        {
            id: "yk-portfolio",
            title: "yk-portfolio",
            short: "You're looking at it.",
            description: "A terminal-themed portfolio built with vanilla JS. No framework, no build step, Vim keybindings for the people who notice that sort of thing.",
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
