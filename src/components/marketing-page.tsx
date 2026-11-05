import type { ReactNode } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, organizationJsonLd, webPageJsonLd } from "@/lib/seo";

export function MarketingPage({
  path,
  title,
  description,
  legalName,
  locality,
  children,
}: {
  path: string;
  title: string;
  description: string;
  legalName: string;
  locality: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900">
      <JsonLd data={organizationJsonLd({ legalName, locality })} />
      <JsonLd data={webPageJsonLd({ title: `${title} | ${siteConfig.name}`, description, path })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: title, path },
        ])}
      />
      <SiteHeader />
      <main className="flex-1">
        <nav aria-label="Jejak" className="mx-auto w-full max-w-6xl px-6 pt-8 text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-slate-900">
                Beranda
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-900">{title}</li>
          </ol>
        </nav>
        {children}
      </main>
      <SiteFooter legalName={legalName} locality={locality} />
    </div>
  );
}
