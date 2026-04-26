export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;        // JWT ou token fourni par l'API
  userId: number;       // ID de l’utilisateur
  role?: string;        // rôle si tu gères des permissions
  expiresIn?: number;   // durée de validité du token
  data?: any;           // données utilisateur supplémentaires (optionnel)
}
export interface InscriptionPhysique {
  id?: number;
  firstname: string;
  lastname: string;
  birthday: string;
  telephone: string;
  email: string;
  password: string;
  sexe: string;
}

export interface InscriptionEntreprise {
  id?: number;
  companyName: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  localisation: string;
  siret: string;
  password: string;
}

export type InscriptionRequest =
  | { type: 'PHYSIQUE', data: InscriptionPhysique }
  | { type: 'MORAL', data: InscriptionEntreprise };
