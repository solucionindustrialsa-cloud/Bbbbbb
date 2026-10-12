import { marqueeBrands } from "@/lib/data";
import { IconLeaf } from "./common";

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...marqueeBrands, ...marqueeBrands];
  return (
    <div className="flex overflow-hidden">
      <div
        className={`marquee-track flex shrink-0 items-center gap-10 pr-10 ${reverse ? "marquee-track--rev" : ""}`}
      >
        {items.map((b, i) => (
          <span key={b + i} className="flex shrink-0 items-center gap-10">
            <span
              className={`font-display text-[clamp(1.6rem,3.4vw,3rem)] font-black whitespace-nowrap transition-colors duration-300 ${
                i % 3 === 0 ? "text-gold-400" : "text-transparent"
              }`}
              style={i % 3 === 0 ? undefined : { WebkitTextStroke: "1px rgba(244,236,216,0.32)" }}
            >
              {b}
            </span>
            <IconLeaf className="size-5 shrink-0 text-yerba-500" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="relative border-y border-yerba-700/50 bg-yerba-900 py-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-yerba-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-yerba-900 to-transparent" />
      <Row />
      <div className="mt-5 border-t border-yerba-800 pt-5">
        <Row reverse />
      </div>
    </section>
  );
}
