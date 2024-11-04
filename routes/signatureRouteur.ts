import express, { Request, Response } from 'express';
import { query } from "../db";
import fs from 'fs';
import authMiddleware, { CustomRequest } from '../middlewares/authMiddleware';

const signatureRouteur = express();

signatureRouteur.post("/signature/:NumColis",authMiddleware, async (req: CustomRequest, res: Response) => {
  const { signature } = req.body;
  const NumColis = req.params.NumColis

  if (!signature) {
    return res.status(400).json({ error: "Signature non fournie" });
  }

  const base64Data = signature.replace(/^data:image\/png;base64,/, "");
  const imagePath = `./signatures/signature/${NumColis}.png`;

  fs.writeFile(imagePath, base64Data, 'base64', async (err) => {
    if (err) {
      console.error("Erreur lors de l'enregistrement de l'image :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    try {
      await query("UPDATE colis SET SignatureClient = ? WHERE NumColis = ?", [imagePath, NumColis]);
      res.status(200).json({ message: "Signature enregistrée avec succès !" });
    } catch (dbError) {
      console.error("Erreur lors de l'enregistrement en base de données :", dbError);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
});

export default signatureRouteur;
