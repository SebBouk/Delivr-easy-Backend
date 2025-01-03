import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const livraisonRouteur = express();

livraisonRouteur.get("/get-livraison",authMiddleware, async (req: CustomRequest, res: Response) => {
  try {
    const livraison = await query("SELECT livraisons.IdLivraison,COUNT(colis.NumColis) AS NombreColis FROM livraisons LEFT JOIN colis ON colis.IdLivraison = livraisons.IdLivraison GROUP BY livraisons.IdLivraison");
    res.status(200).json(livraison);
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const livraisonTourneeRouteur = express();

livraisonTourneeRouteur.get(
  "/get-livraison/:IdTournee",authMiddleware,
  async (req: Request, res: Response) => {
    const idTournee = req.params.IdTournee;
    try {
      const livraisonTournee = await query(
        "SELECT livraisons.IdLivraison, livraisons.LivraisonEnCour, livraisons.LivraisonArrive, tournées.IdTournee, COUNT(colis.NumColis) AS NombreColis FROM livraisons JOIN tournées ON livraisons.IdTournee = tournées.IdTournee LEFT JOIN colis ON colis.IdLivraison = livraisons.IdLivraison WHERE tournées.IdTournee = ? GROUP BY livraisons.IdLivraison, livraisons.LivraisonEnCour, livraisons.LivraisonArrive, tournées.IdTournee",
        [idTournee]
      );
      console.log(idTournee);
      res.json(livraisonTournee);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

livraisonRouteur.post('/create-livraison', async (req, res) => {
  const { IdTournee, IdEmploye } = req.body;

  if (!IdTournee || !IdEmploye) {
    return res.status(400).send('Données manquantes');
  }

  try {
    // Correction : récupère l'objet de résultat directement
    const result = await query(
      'INSERT INTO Livraisons (IdTournee) VALUES (?)',
      [IdTournee]
    );

    const insertId = result[0]?.insertId;

    // Envoie l'ID de la livraison insérée
    res.status(201).json({ IdLivraison:insertId });
  } catch (error) {
    console.error('Erreur lors de la création de la livraison :', error);
    res.status(500).send('Erreur serveur');
  }
});

export { livraisonRouteur, livraisonTourneeRouteur };
