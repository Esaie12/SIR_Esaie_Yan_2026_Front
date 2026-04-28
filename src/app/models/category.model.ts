export interface Groupe {
  id?: number;
  libelle: string;
  description?: string;
  color: string;
  dateCreate?: string; // ISO 8601 format
  memberCount?: number; // Lecture seule              Dans Message Ressources  ( j'ai crée une route *getMesMessages* mais elle ne s'affiche pas dans le swagger, stp regarde pour moi stp )
}
