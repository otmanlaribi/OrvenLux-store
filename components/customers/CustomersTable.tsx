import CustomerRow from "./CustomerRow";

type Customer = {
  id: number;
  name: string;
  phone: string;
  orders: number;
  totalSpent: number;
  active: boolean;
  created_at: string;
};

type CustomersTableProps = {
  customers: Customer[];
};

export default function CustomersTable({
  customers,
}: CustomersTableProps) {
  if (customers.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-stone-300 bg-white py-20 text-center shadow-sm">
        <h3 className="text-xl font-black text-[#111111]">
          لا يوجد عملاء
        </h3>

        <p className="mt-3 text-sm text-stone-500">
          سيتم عرض العملاء هنا بمجرد تسجيل أول عميل.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-stone-200 bg-[#F8F7F4]">
            <tr>
              <th className="px-6 py-4 text-right text-xs font-black tracking-wider text-stone-500">
                العميل
              </th>

              <th className="px-6 py-4 text-right text-xs font-black tracking-wider text-stone-500">
                الهاتف
              </th>

              <th className="px-6 py-4 text-center text-xs font-black tracking-wider text-stone-500">
                الطلبات
              </th>

              <th className="px-6 py-4 text-center text-xs font-black tracking-wider text-stone-500">
                إجمالي الإنفاق
              </th>

              <th className="px-6 py-4 text-center text-xs font-black tracking-wider text-stone-500">
                الحالة
              </th>

              <th className="px-6 py-4 text-center text-xs font-black tracking-wider text-stone-500">
                تاريخ التسجيل
              </th>

              <th className="px-6 py-4 text-center text-xs font-black tracking-wider text-stone-500">
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {customers.map((customer) => (
              <CustomerRow
                key={customer.id}
                customer={customer}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}