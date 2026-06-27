// Modèles TypeScript reflétant les ressources de l'API DGBE.

export type Role = 'administrateur' | 'agent' | 'commission' | 'service-financier' | 'etudiant';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  nom_complet: string;
  email: string;
  telephone?: string;
  photo?: string;
  adresse?: string;
  actif: boolean;
  email_verifie?: boolean;
  roles?: Role[];
  permissions?: string[];
  etudiant?: Etudiant;
  created_at?: string;
}

export interface Universite {
  id: number;
  nom: string;
  sigle?: string;
  type?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  region?: string;
  facultes?: Faculte[];
  facultes_count?: number;
}

export interface Faculte {
  id: number;
  nom: string;
  universite_id: number;
  universite?: Universite;
  filieres?: Filiere[];
}

export interface Filiere {
  id: number;
  nom: string;
  faculte_id: number;
  faculte?: Faculte;
}

export interface AnneeAcademique {
  id: number;
  libelle: string;
  date_debut: string;
  date_fin: string;
  active: boolean;
}

export interface TypeBourse {
  id: number;
  nom: string;
  montant: number | string;
  description?: string;
}

export interface Etudiant {
  id: number;
  matricule: string;
  date_naissance?: string;
  sexe?: 'M' | 'F';
  region?: string;
  niveau?: string;
  utilisateur_id: number;
  utilisateur?: User;
  universite?: Universite;
  faculte?: Faculte;
  filiere?: Filiere;
}

export type StatutDemande =
  | 'Brouillon' | 'Soumise' | 'En vérification' | 'Acceptée' | 'Refusée' | 'Payée';

export interface PieceJustificative {
  id: number;
  demande_id: number;
  nom_document: string;
  chemin: string;
  url?: string;
  statut: 'En attente' | 'Validée' | 'Rejetée';
  motif_rejet?: string;
}

export interface DemandeBourse {
  id: number;
  date_demande: string;
  montant_demande: number | string;
  statut: StatutDemande;
  observation?: string;
  etudiant_id: number;
  annee_id: number;
  type_bourse_id: number;
  etudiant?: Etudiant;
  annee?: AnneeAcademique;
  type_bourse?: TypeBourse;
  pieces?: PieceJustificative[];
  decision?: Decision;
}

export interface Commission {
  id: number;
  nom: string;
  date_reunion?: string;
  description?: string;
  membres?: User[];
  decisions_count?: number;
}

export interface Decision {
  id: number;
  decision: 'Acceptée' | 'Refusée';
  observation?: string;
  montant_accorde: number | string;
  date_decision: string;
  commission_id: number;
  demande_id: number;
  montant_paye?: number;
  reste_a_payer?: number;
  commission?: Commission;
  demande?: DemandeBourse;
}

export interface Paiement {
  id: number;
  decision_id: number;
  montant: number | string;
  date_paiement: string;
  mode_paiement?: string;
  reference?: string;
  statut: 'payé' | 'en attente' | 'annulé';
  decision?: Decision;
}

export interface Reclamation {
  id: number;
  objet: string;
  description: string;
  document?: string;
  document_url?: string;
  statut: 'Ouverte' | 'En cours' | 'Traitée' | 'Fermée';
  reponse?: string;
  etudiant_id: number;
  demande_id?: number;
  etudiant?: Etudiant;
  demande?: DemandeBourse;
  created_at?: string;
}

export interface Notification {
  id: number;
  titre: string;
  contenu: string;
  type: string;
  lu: boolean;
  created_at?: string;
}

export interface DashboardData {
  cartes: {
    etudiants: number;
    demandes: number;
    demandes_acceptees: number;
    paiements: number;
    montant_total_distribue: number;
    reclamations: number;
    reclamations_ouvertes: number;
  };
  demandes_par_statut: Record<string, number>;
  demandes_par_region: Record<string, number>;
  demandes_par_universite: Record<string, number>;
  evolution_annuelle: Record<string, number>;
  paiements_mensuels: Record<string, number>;
}

// Réponses API
export interface AuthResponse {
  message: string;
  token: string;
  token_type: string;
  data: User;
}

export interface Paginated<T> {
  data: T[];
  links?: unknown;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ApiResource<T> {
  data: T;
}
