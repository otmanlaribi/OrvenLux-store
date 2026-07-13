"use client";

type Props = {
  orderId: number;
};

export default function PrintButton({
  orderId,
}: Props) {
  function printOrder() {
    window.open(
      `/dashboard/print/${orderId}`,
      "_blank"
    );
  }

  return (
    <button
      onClick={printOrder}
      style={{
        padding: "6px 10px",
        background: "#f59e0b",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      🖨️ طباعة
    </button>
  );
}