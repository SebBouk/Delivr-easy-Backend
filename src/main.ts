import express, { Request, Response } from "express";
import clientRouteur from "../routes/clientRouteur";
import { colisRouteur, colisLivRouteur, colisCommandeRouteur } from "../routes/colisRouteur";
import {commandeRouteur , CommandeClientRouteur, AddCommandeRouteur} from "../routes/commandeRouteur";
import {
  livraisonRouteur,
  livraisonTourneeRouteur,
} from "../routes/livraisonRouteur";
import tourneeRouteur from "../routes/tourneeRouteur";
import livreurRouteur from "../routes/livreurRouteur";
import signatureRouteur from "../routes/signatureRouteur";
import LoginRouteur from "../routes/loginRouteur";
import authMiddleware from "../middlewares/authMiddleware"; 
import { roleMiddleware } from "../middlewares/roleMiddleware"; 
import cookieParser from "cookie-parser";
import livreur2Router from "../routes/livreurColis";
import employeRouteur from "../routes/employeRouteur";

const server = express();
server.use(express.json());
server.use(cookieParser());
server.listen(3000, () => console.log("Serveur prêt à démarrer"));

//Routes
server.use("/admin", authMiddleware, roleMiddleware(1), clientRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), colisRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), commandeRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), CommandeClientRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), livraisonRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), tourneeRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), colisLivRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), colisCommandeRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), livraisonTourneeRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), livreurRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), AddCommandeRouteur);
server.use("/admin", authMiddleware, roleMiddleware(1), employeRouteur);

server.use("/livreur", authMiddleware, signatureRouteur);
server.use("/", LoginRouteur);
server.use("/livreur", authMiddleware, roleMiddleware(0), livraisonRouteur);
server.use("/livreur", authMiddleware, roleMiddleware(0), colisRouteur);
server.use("/livreur", authMiddleware, roleMiddleware(0), livreur2Router);
