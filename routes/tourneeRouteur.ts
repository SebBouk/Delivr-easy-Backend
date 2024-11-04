import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const tourneeRouteur = express();

tourneeRouteur.get("/get-tournee",authMiddleware,async (req:CustomRequest, res:Response)=>{
    try {

      const tournee = await query("SELECT tournées.IdEmploye, tournées.IdTournee, employés.NomEmploye FROM tournées JOIN employés ON tournées.IdEmploye = employés.IdEmploye");
      res.json(tournee);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

export default tourneeRouteur;