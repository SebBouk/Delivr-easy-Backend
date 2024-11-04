import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const commandeRouteur = express();

commandeRouteur.get("/get-commandes",authMiddleware,async (req:CustomRequest, res:Response)=>{
    try {
      const commandes = await query("SELECT Commandes.IdCommande, Clients.NomClient FROM Commandes JOIN Clients ON Commandes.IdClient = Clients.IdClient;");
      res.json(commandes);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

export default commandeRouteur;