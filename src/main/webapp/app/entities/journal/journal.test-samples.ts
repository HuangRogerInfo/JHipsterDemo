import { IJournal, NewJournal } from './journal.model';

export const sampleWithRequiredData: IJournal = {
  id: 69273,
  title: 'b optimize',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IJournal = {
  id: 64293,
  title: 'Movies Dollar generating',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IJournal = {
  id: 11202,
  title: 'a',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewJournal = {
  title: 'e-enable content-based',
  description: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
