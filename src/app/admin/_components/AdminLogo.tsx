import Image from "next/image";

/** The TMUG logo is cream-coloured (made for dark backgrounds), so in the admin it always sits on a dark chip. */
export function AdminLogo({ heightClass = "h-7", priority = false }: { heightClass?: string; priority?: boolean }) {
  return (
    <span className="inline-flex items-center rounded-xl bg-deep-plum px-2.5 py-1.5">
      <Image src="/logo/tmug-logo.png" alt="TMUG" width={110} height={56} priority={priority} className={`${heightClass} w-auto object-contain`} />
    </span>
  );
}
