import CustomerActions from "./CustomerActions";
import CustomerStatus from "./CustomerStatus";

type Customer = {
  id: number;
  name: string;
  phone: string;
  orders: number;
  totalSpent: number;
  active: boolean;
  created_at: string;
};

type CustomerRowProps = {
  customer: Customer;
};

export default function CustomerRow({
  customer,
}: CustomerRowProps) {
  return (
    <tr className="transition hover:bg-[#F8F7F4]">
      {/* العميل */}
      <td className="px-6 py-5">
        <div>
          <p className="font-black text-[#111111]">
            {customer.name}
          </p>

          <p className="mt-1 text-xs text-stone-500">
            ID #{customer.id}
          </p>
        </div>
      </td>

      {/* الهاتف */}
      <td className="px-6 py-5">
        <span className="text-sm text-stone-700">
          {customer.phone}
        </span>
      </td>

      {/* الطلبات */}
      <td className="px-6 py-5 text-center">
        <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-[#111111] px-3 py-1 text-xs font-black text-white">
          {customer.orders}
        </span>
      </td>

      {/* إجمالي الإنفاق */}
      <td className="px-6 py-5 text-center">
        <span className="font-black text-[#111111]">
          {customer.totalSpent.toLocaleString()} DA
        </span>
      </td>

      {/* الحالة */}
      <td className="px-6 py-5 text-center">
        <CustomerStatus active={customer.active} />
      </td>

      {/* تاريخ التسجيل */}
      <td className="px-6 py-5 text-center text-sm text-stone-500">
        {new Date(
          customer.created_at
        ).toLocaleDateString("fr-FR")}
      </td>

      {/* الإجراءات */}
      <td className="px-6 py-5 text-center">
        <CustomerActions
          id={customer.id}
        />
      </td>
    </tr>
  );
}