import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const commandeRouteur = express();
const CommandeClientRouteur = express();
const AddCommandeRouteur = express();

commandeRouteur.get("/get-commandes",authMiddleware,async (req:CustomRequest, res:Response)=>{
    try {
      const commandes = await query("SELECT Commandes.IdCommande, Clients.NomClient FROM Commandes JOIN Clients ON Commandes.IdClient = Clients.IdClient;");
      res.json(commandes);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  CommandeClientRouteur.get("/get-commandes/:IdClient",authMiddleware, async (req:CustomRequest, res:Response)=>{
    const idClient = req.params.IdClient;
    try {
      const commandesClient =await query("SELECT Commandes.IdCommande, Clients.NomClient FROM Commandes JOIN Clients ON Commandes.IdClient = Clients.IdClient WHERE Commandes.IdClient = ?",[idClient]
      );
      console.log(idClient);
      res.json(commandesClient);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  })

  AddCommandeRouteur.post("/ajoutCommande", async (req, res)=>{
    const { IdClient } = req.body;
  try {
    await query(
      "INSERT INTO commandes (IdClient) VALUES (?)",
      [IdClient]
    );
    res.status(201).json({ message: "Commande ajouté avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la commande" });
  }
});

export {commandeRouteur , CommandeClientRouteur, AddCommandeRouteur};