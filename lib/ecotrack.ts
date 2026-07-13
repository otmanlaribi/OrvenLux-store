const API_URL = "https://app.ecotrack.dz/api/v1/create/order";

const TOKEN = process.env.ECOTRACK_API_TOKEN!;

export async function sendToEcotrack(order: any) {
  const params = new URLSearchParams({
    reference: order.reference,
    nom_client: order.name,
    telephone: order.phone,
    adresse: order.address,
    commune: order.commune,
    code_wilaya: String(order.wilaya),
    montant: String(order.total),
    remarque: "",
    produit: order.product,
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