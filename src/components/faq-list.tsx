import type { FaqItem } from "@/content/faq";

export function FaqList({ items }: { items: FaqItem[] }) {
  if (items.length === 0) {
    return <p className="mt-8 text-slate-500">Belum ada pertanyaan.</p>;
  }

  return (
    <div className="mt-10 flex flex-col gap-3">
      {items.map((item) => (
        <details key={item.id} className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-900">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {item.question}
            <span aria-hidden="true" className="text-lg text-[#e30b29] group-open:hidden">
              +
            </span>
            <span aria-hidden="true" className="hidden text-lg text-[#e30b29] group-open:inline">
              –
            </span>
          </summary>
          <p className="mt-3 max-w-3xl leading-7 text-slate-500">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
