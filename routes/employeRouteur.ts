import { query } from "../db";
import express, { Request, Response } from "express";
import authMiddleware, { CustomRequest } from "../middlewares/authMiddleware";

const employeRouteur = express();

employeRouteur.get(
  "/get-employe",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const employe = await query("SELECT * FROM employés");
      res.json(employe);
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

employeRouteur.post("/ajoutEmploye", async (req, res) => {
  const { NomEmploye, RoleEmploye, MailEmploye } = req.body;

  try {
    await query(
      " INSERT INTO employés (NomEmploye, RoleEmploye, MailEmploye) VALUES (?, ?, ?)",
      [NomEmploye, RoleEmploye, MailEmploye]
    );

    // Réponse en cas de succès
    res.status(201).json({ message: "Employé ajouté avec succès." });
  } catch (error) {
    console.error("Erreur lors de l’ajout de l’employé :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

export default employeRouteur;
