export default async function handler(req, res) {
  const { ref } = req.query;
  if (!ref) return res.status(400).json({ error: "Référence manquante" });

  const token = process.env.APIFY_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Clé API Apify manquante" });

  try {
    const response = await fetch(`https://api.apify.com/v2/acts/sian.agency~inditex-product-scraper/run-sync-get-dataset-items?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brands: ["zara", "bershka", "stradivarius", "pullandbear"],
        mode: "detail",
        productUrls: [ref]
      })
    });

    const data = await response.json();

    if (data && data.length > 0) {
      res.status(200).json(data[0]); 
    } else {
      res.status(404).json({ error: "Produit introuvable" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
}