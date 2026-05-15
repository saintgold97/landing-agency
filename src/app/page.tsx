import Link from "next/link";

// 🔧 Temporary site registry (replace with real dynamic source later)
const sites = [
    {
        slug: "villa-serena",
        name: "Villa Serena",
        description: "Luxury resort & hospitality experience",
        color: "#C8A96A", // gold accent
        bg: "#0E0E0E",
    },
    {
        slug: "hotel-luxury",
        name: "Hotel Luxury",
        description: "Luxury resort & hospitality experience",
        color: "#C8A96A", // gold accent
        bg: "#0E0E0E",
    },
];

export default function HomePage() {
    return (
        <main className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: "#0B0B0B" }}>
            {/* subtle background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C8A96A]/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-24 relative">
                {/* Hero */}
                <section className="text-center mb-20">
                    <span className="text-xs uppercase tracking-[0.35em] text-white/50 mb-4">
                        Digital Experience
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-6">
                    Siti vetrina moderni per attività locali
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                        Un’esperienza digitale elegante e immersiva, progettata per valorizzare il brand e la sua identità visiva.
                    </p>
                </section>

                {/* Grid */}
                <section className="flex justify-center">
                    {sites.map((site) => (
                        <Link
                            key={site.slug}
                            href={`/${site.slug}`}
                            className="group relative w-full max-w-md mx-4"
                        >
                            <div
                                className="rounded-2xl border transition-all duration-300 p-8 backdrop-blur-md"
                                style={{
                                    borderColor: "rgba(200, 169, 106, 0.25)",
                                    backgroundColor: "rgba(255,255,255,0.03)",
                                }}
                            >
                                {/* glow */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `radial-gradient(circle at top left, ${site.color}22, transparent 60%)`,
                                    }}
                                />

                                <div className="relative">
                                    <h2
                                        className="text-2xl font-medium tracking-tight transition-colors"
                                        style={{ color: site.color }}
                                    >
                                        {site.name}
                                    </h2>

                                    <p className="text-sm text-white/60 mt-3 leading-relaxed">
                                        {site.description}
                                    </p>

                                    <div
                                        className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest transition-colors"
                                        style={{ color: site.color }}
                                    >
                                        <span>Esplora</span>
                                        <span className="transition-transform group-hover:translate-x-1">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </section>

                {/* Footer */}
                <footer className="text-center mt-24 text-xs text-white/40">
                    Minimal digital identity system
                </footer>
            </div>
        </main>
    );
}