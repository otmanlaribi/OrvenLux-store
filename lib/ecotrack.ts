const API_URL = "https://app.ecotrack.dz/api/v1/create/order";

const TOKEN = process.env.ECOTRACK_API_TOKEN!;

function toStringValue(value: unknown) {
  return value === undefined || value === null ? "" : String(value);
}

export async function sendToEcotrack(order: Record<string, unknown>) {
  const params = new URLSearchParams({
    reference: toStringValue(order.reference),
    nom_client: toStringValue(order.name),
    telephone: toStringValue(order.phone),
    adresse: toStringValue(order.address),
    commune: toStringValue(order.commune),
    code_wilaya: toStringValue(order.wilaya),
    montant: toStringValue(order.total),
    remarque: "",
    produit: toStringValue(order.product),
    stock: "0",
    quantite: "1",
    boutique: "Mon Store",
    type: "1",
    stop_desk: "0",
    weight: "1",
    fragile: "0",
  });

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
    },
  });

  return await response.json();
}