import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const colisRouteur = express();

colisRouteur.get(
  "/get-colis",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const colis = await query("SELECT * FROM colis");
      res.json(colis);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

const colisLivRouteur = express();
const colisCommandeRouteur = express();

colisLivRouteur.get(
  "/get-colis/Liv/:IdLivraison",
  async (req: Request, res: Response) => {
    const idLivraison = req.params.IdLivraison;
    try {
      const colisLivraison = await query(
        `SELECT colis.NumColis, colis.ContactColis, colis.AdresseColis, colis.DateLivColis, PoidColis, colis.IdLivraison, colis.IdCommande, livraisons.IdTournee FROM colis JOIN livraisons ON colis.IdLivraison = livraisons.IdLivraison WHERE livraisons.IdLivraison = ?`,
        [idLivraison]
      );
      console.log(idLivraison);
      res.json(colisLivraison);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);
colisCommandeRouteur.get(
  "/get-colis/Com/:IdCommande",
  async (req: Request, res: Response) => {
    const idCommande = req.params.IdCommande;
    try {
      const colisCommande = await query(
        `SELECT colis.NumColis, colis.ContactColis, colis.AdresseColis, colis.DateLivColis, PoidColis, colis.IdLivraison, colis.IdCommande, commandes.IdCommande FROM colis JOIN commandes ON colis.IdCommande = commandes.IdCommande WHERE commandes.IdCommande = ?`,
        [idCommande]
      );
      console.log(idCommande);
      res.json(colisCommande);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);
colisRouteur.post("/ajoutColis", async (req: Request, res: Response) => {
  const { AdresseColis, ContactColis, PoidColis, DateLivColis } = req.body;

  try {
     await query(
      "INSERT INTO colis ( AdresseColis, ContactColis, PoidColis, DateLivColis) VALUES ( ?, ?, ?, ?)",
      [AdresseColis, ContactColis, PoidColis, DateLivColis]
    );

    res.status(201).json({ message: "Colis ajouté avec succès." });
  } catch (error) {
    console.error("Erreur lors de l’ajout du colis :", error);
    res.status(500).json({ message: "Erreur de serveur." });
  }
});
export { colisLivRouteur, colisRouteur, colisCommandeRouteur };
