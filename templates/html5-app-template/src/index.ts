import { displayCurrentNetwork, displayDeviceInfo } from "./info";
import { getConfig } from "./config";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
import express from "express";
import path from "path";
const spawn = require("child_process").spawn;
console.log("gsap");
const app = express();
const port = 9000;
const config = getConfig();

const start = async () => {
    console.log(
        `config.env: desktop mode - ${config.isDesktop}, environment - ${config.nodeEnv}`
    );

    if (!config.isDesktop) {
        displayCurrentNetwork();
        await displayDeviceInfo();
    } else {
        // open default browser
        app.use(express.static(path.join(__dirname)));
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}/`);
        });
        spawn("open", [`http://localhost:${port}/`]);
    }
};

declare global {
    interface Window {
        main: () => void;
    }
}

if (config.isDesktop) {
    start();
} else {
    window.main = start;
}

// Define the mapping from nav targets to section IDs
const sectionMap: Record<string, string[]> = {
    home: ["home"],
    mission: ["mission"],
    care: ["care-1", "care-2"],
    closer: ["closer"],
    involved: ["involved"],
};

// Select all navigation dot elements
const navDots: NodeListOf<HTMLElement> = document.querySelectorAll(".nav-dot");

// Create a reverse lookup map from section ID to nav target
const reverseMap: Record<string, string> = {};

Object.entries(sectionMap).forEach(([navTarget, ids]) => {
    ids.forEach((id) => {
        reverseMap[id] = navTarget;
    });
});

// Set up an IntersectionObserver to highlight active nav dot
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                const currentTarget = reverseMap[entry.target.id];
                if (!currentTarget) return;

                navDots.forEach((dot) => {
                    const dotTarget = dot.dataset.target;
                    dot.classList.toggle("active", dotTarget === currentTarget);
                });
            }
        });
    },
    {
        threshold: 0.1,
    }
);

// Observe all target section elements
Object.values(sectionMap)
    // @ts-expect-error
    .flat()
    // @ts-expect-error
    .forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });

// Scroll to the first section in group when nav dot clicked
navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
        const target = dot.dataset.target;
        const firstId = target ? sectionMap[target]?.[0] : null;
        const targetEl = firstId ? document.getElementById(firstId) : null;

        if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" });
        }
    });
});
