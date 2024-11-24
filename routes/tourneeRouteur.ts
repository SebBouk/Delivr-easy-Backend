import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const tourneeRouteur = express();

tourneeRouteur.get("/get-tournee",authMiddleware,async (req:CustomRequest, res:Response)=>{
    try {

      const tournee = await query("SELECT  tournées.IdTournee, tournées.IdEmploye, tournées.DateTournee, employés.NomEmploye FROM tournées LEFT JOIN employés ON tournées.IdEmploye = employés.IdEmploye ORDER BY tournées.IdTournee DESC");
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
      if (!DateTournee || !IdTournee) {
        return res.status(400).json({ error: "DateTournee et IdTournee sont requis." });
      }
      res.status(201).json({ message: "Date ajouté avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la date" });
    }
  })

  tourneeRouteur.put('/:IdTournee/update-employe', async (req, res) => {
    const { IdTournee } = req.params;
    const { IdEmploye } = req.body;
  
    try {
      await query('UPDATE tournées SET IdEmploye = ? WHERE IdTournee = ?', [IdEmploye, IdTournee]);
      res.status(200).json({ message: 'Employé mis à jour avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé :', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });

  tourneeRouteur.post('/create-tournee', async (req, res) => {
    try {
      await query('INSERT INTO Tournées (DateTournee, IdEmploye) VALUES (?, ?);', [new Date(), null]);
      res.status(201).json({ message: "Création de la tournée effectué!" });
    } catch (error) {
      console.error('Erreur lors de la création de la tournée :', error);
      res.status(500).send('Erreur serveur');
    }
  });
export default tourneeRouteur;