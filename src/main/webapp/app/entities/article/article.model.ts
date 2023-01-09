import dayjs from 'dayjs/esm';
import { IJournal } from 'app/entities/journal/journal.model';

export interface IArticle {
  id: number;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  date?: dayjs.Dayjs | null;
  journal?: Pick<IJournal, 'id'> | null;
}

export type NewArticle = Omit<IArticle, 'id'> & { id: null };
