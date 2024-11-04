import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const livreurRouteur = express();

livreurRouteur.get("/get-livreurs",authMiddleware,async (req:CustomRequest, res:Response)=>{
    try {
      const livreur = await query("SELECT * FROM employés");
      res.json(livreur);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  export default livreurRouteur;