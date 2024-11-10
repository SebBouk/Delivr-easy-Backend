import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const tourneeRouteur = express();

tourneeRouteur.get("/get-tournee",authMiddleware,async (req:CustomRequest, res:Response)=>{
    try {

      const tournee = await query("SELECT  tournées.IdTournee, tournées.IdEmploye, tournées.DateTournee, employés.NomEmploye FROM tournées LEFT JOIN employés ON tournées.IdEmploye = employés.IdEmploye");
      res.json(tournee);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  tourneeRouteur.post("/ajoutDate", async (req,res)=>{
    const { DateTournee, IdTournee } = req.body;
    try {
      await query(
        "UPDATE tournées SET DateTournee = ? WHERE IdTournee = ?", [DateTournee, IdTournee]
      );
      res.status(201).json({ message: "Date ajouté avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la date" });
    }
  })
export default tourneeRouteur;