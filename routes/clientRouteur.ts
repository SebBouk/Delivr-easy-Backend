import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const clientRouteur = express();

clientRouteur.get(
  "/get-clients",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const clients = await query("SELECT * FROM clients");
      res.json(clients);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

clientRouteur.post("/ajoutclient", async (req, res) => {
  const { NomClient, AdresseFacture, CoordonneesClient } = req.body;
  try {
    await query(
      "INSERT INTO clients (NomClient, AdresseFacture, CoordonneesClient) VALUES (?,?,?)",
      [NomClient, AdresseFacture, CoordonneesClient]
    );
    res.status(201).json({ message: "Client ajouté avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du client" });
  }
});

export default clientRouteur;
