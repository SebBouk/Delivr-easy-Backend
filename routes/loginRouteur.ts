import express, { Request, Response } from "express";
import { query } from "../db";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../middlewares/authMiddleware";

const LoginRouteur = express();

LoginRouteur.post("/login", async (req: CustomRequest, res: Response) => {
    const { MailEmploye, MdpEmploye} = req.body;
  
    console.log("Requête POST reçue sur /login");
    console.log("Données reçues :", req.body);
   
   
  
    try {
      const result = await query(
        'SELECT * FROM employés WHERE MailEmploye = ? AND MdpEmploye = ?',
        [MailEmploye, MdpEmploye]
      );
  const employe = result[0];
  if(!employe){
    return res.status(401).json({message : 'Email ou mot de passe incorrect'});
  }
  const token = jwt.sign(
    {
        IdEmploye : employe.IdEmploye,
        MailEmploye:employe.MailEmploye,
        RoleEmploye: employe.RoleEmploye
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h'}
  );
  res.cookie('token',token,{httpOnly: false});
  res.status(200).json({message:'Connexion réussie', token, IdEmploye : employe.IdEmploye, RoleEmploye: employe.RoleEmploye});
      
    } catch (error) {
      console.error("Erreur lors de l'authentification :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  
  }); 

  export default LoginRouteur;