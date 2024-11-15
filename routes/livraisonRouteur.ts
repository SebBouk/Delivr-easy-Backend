import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const livraisonRouteur = express();

livraisonRouteur.get("/get-livraison",authMiddleware, async (req: CustomRequest, res: Response) => {
  try {
    const livraison = await query("SELECT * FROM livraisons");
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
        "SELECT livraisons.IdLivraison, livraisons.LivraisonEnCour, livraisons.LivraisonArrive, livraisons.SignatureClient, tournées.IdTournee FROM livraisons JOIN tournées ON livraisons.IdTournee = tournées.IdTournee WHERE tournées.IdTournee = ?",
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

export { livraisonRouteur, livraisonTourneeRouteur };
