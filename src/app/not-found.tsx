import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="font-heading mt-5 text-[clamp(3rem,12vw,9rem)] leading-none tracking-tight [--heading-weight:800]">
          <span className="molten-text">Off the grid</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-md">
          That page is not in this drawing set. Head back to the index.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-molten-400 mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>
      </div>
    </section>
  );
}
