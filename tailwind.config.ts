// tailwind.config.ts

import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                "primary-foreground":
                    "var(--color-primary-foreground)",

                accent: "var(--color-accent)",
                "accent-foreground":
                    "var(--color-accent-foreground)",

                background: "var(--color-background)",
                foreground: "var(--color-foreground)",

                muted: "var(--color-muted)",
                "muted-foreground":
                    "var(--color-muted-foreground)",

                border: "var(--color-border)",
            },

            fontFamily: {
                heading: ["var(--font-heading)"],
                body: ["var(--font-body)"],
                mono: ["var(--font-mono)"],
            },
        },
    },

    plugins: [],
}

export default config