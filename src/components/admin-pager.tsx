export const adminPageSize = 5;

export function pageLabel(page: number, total: number, pageSize = adminPageSize) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Menampilkan ${start}–${end} dari ${total}`;
}

export function pageAfterChange(current: number, nextTotal: number, pageSize = adminPageSize) {
  if (nextTotal <= 0) return 1;
  return Math.min(current, Math.ceil(nextTotal / pageSize));
}

export function AdminPager({
  page,
  totalPages,
  disabled,
  onPage,
}: {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPage: (page: number) => void;
}) {
  if (totalPages < 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Halaman data" className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPage(page - 1)}
        className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
      >
        Sebelumnya
      </button>
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          disabled={disabled}
          aria-current={number === page ? "page" : undefined}
          onClick={() => onPage(number)}
          className={
            number === page
              ? "grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-medium text-white"
              : "grid h-10 w-10 place-items-center rounded-full border border-line text-sm disabled:opacity-40"
          }
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPage(page + 1)}
        className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
      >
        Berikutnya
      </button>
    </nav>
  );
}
