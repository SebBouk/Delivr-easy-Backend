import express, { Request, Response } from "express";
import { query } from "../db";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";

const LoginRouteur = express();

LoginRouteur.post("/login", async (req: Request, res: Response) => {
  const { MailEmploye, MdpEmploye } = req.body;

  console.log("Requête POST reçue sur /login");
  console.log("Données reçues :", req.body);

  try {
      // Effectuer la requête pour récupérer l'employé par email
      const result = await query(
          'SELECT * FROM employés WHERE MailEmploye = ?',
          [MailEmploye]
      );
      const employe = result[0];

      // Vérifier si l'employé existe
      if (!employe) {
          return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Comparer le mot de passe avec le hash stocké en base de données
      const match = await bcrypt.compare(MdpEmploye, employe.MdpEmploye);

      if (!match) {
          return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer un token JWT si l'authentification réussit
      const token = jwt.sign(
          {
              IdEmploye: employe.IdEmploye,
              MailEmploye: employe.MailEmploye,
              RoleEmploye: employe.RoleEmploye,
              NomEmploye: employe.NomEmploye
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
      );

      // Envoyer le token dans un cookie ou dans la réponse
      res.cookie('token', token, { httpOnly: false });
      res.status(200).json({
          message: 'Connexion réussie',
          token,
          IdEmploye: employe.IdEmploye,
          RoleEmploye: employe.RoleEmploye,
          NomEmploye: employe.NomEmploye
      });

  } catch (error) {
      console.error("Erreur lors de l'authentification :", error);
      res.status(500).json({ error: "Erreur serveur" });
  }
});


LoginRouteur.post('/update-password', async (req, res) => {
  const { MailEmploye, newPassword } = req.body;

  if (!MailEmploye || !newPassword) {
    return res.status(400).json({ message: 'Données manquantes.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await query(
      'UPDATE employés SET MdpEmploye = ?  WHERE MailEmploye = ?',
      [hashedPassword, MailEmploye]
    );
    
    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe." });
  }
});


  export default LoginRouteur;