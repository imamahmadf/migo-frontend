import { AccountHome } from "@/components/account-home";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Akun",
  description: "Profil dan keamanan akun perusahaan.",
  path: "/akun",
  index: false,
});

export default function AccountPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-14">
        <AccountHome />
      </main>
    </div>
  );
}
