import PrintButton from "./PrintButton";

type Props = {
  phone: string;
  orderId: number;
};

export default function ActionButtons({
  phone,
  orderId,
}: Props) {
  const whatsappNumber = `213${phone.replace(/^0/, "")}`;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      <a
        href={`tel:${phone}`}
        style={{
          padding: "6px 10px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        📞 اتصال
      </a>

      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "6px 10px",
          background: "#22c55e",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "14px",
        }}
      >
        💬 واتساب
      </a>

      <PrintButton orderId={orderId} />
    </div>
  );
}