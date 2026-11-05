import Image from "next/image";
import logo from "@/assets/logomigo.png";
import { siteNav } from "@/config/site";

export function SiteFooter({ legalName, locality }: { legalName: string; locality: string }) {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-8 text-sm text-slate-500">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <nav aria-label="Menu situs" className="flex flex-wrap gap-x-5 gap-y-2">
          {siteNav.map((item) => (
            <a key={item.path} href={item.path} className="transition-colors hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="" width={32} height={30} className="h-8 w-8" />
            <p>© {legalName}</p>
          </div>
          <p>{locality}</p>
        </div>
      </div>
    </footer>
  );
}
