"use client";

type Props = {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  totalOrders: number;

  reload: () => void;
};

export default function OrderFilters({
  search,
  setSearch,
  status,
  setStatus,
  totalOrders,
  reload,
}: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between">

      <div className="flex gap-3">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Status</option>
          <option value="جديد">جديد</option>
          <option value="Envoyé">Envoyé</option>
          <option value="تم التسليم">تم التسليم</option>
          <option value="ملغي">ملغي</option>
        </select>

      </div>

      <div className="flex items-center gap-4">

        <span className="text-slate-500">
          {totalOrders} Orders
        </span>

        <button
          onClick={reload}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Refresh
        </button>

      </div>

    </div>
  );
}