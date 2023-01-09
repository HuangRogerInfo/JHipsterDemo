export interface IJournal {
  id: number;
  title?: string | null;
  description?: string | null;
}

export type NewJournal = Omit<IJournal, 'id'> & { id: null };
