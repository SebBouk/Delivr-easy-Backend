import express from 'express';
import { query } from '../db';
import authMiddleware, { CustomRequest } from '../middlewares/authMiddleware';

const livreur2Router = express();

livreur2Router.get(`/get-colis/:IdEmploye`, authMiddleware, async (req: CustomRequest, res) => {
  const IdEmploye = req.employe?.IdEmploye;
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0]

  if (!IdEmploye) {
    return res.status(400).json({ message: 'IdEmploye est requis' });
  }

  try {
    const colis = await query(`
      SELECT c.*
      FROM colis c
      JOIN livraisons l ON c.IdLivraison = l.IdLivraison
      JOIN tournées t ON l.IdTournee = t.IdTournee
      WHERE t.IdEmploye = ? AND t.DateTournee = ?`, [IdEmploye,todayISO]
    );
    console.log(todayISO)
    if (colis.length === 0) {
      return res.status(404).json({ message: 'Aucun colis trouvé pour cet employé' });
    }

    res.status(200).json(colis);

  } catch (error) {
    console.error('Erreur lors de la récupération des colis :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default livreur2Router;
