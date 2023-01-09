import dayjs from 'dayjs/esm';

import { IArticle, NewArticle } from './article.model';

export const sampleWithRequiredData: IArticle = {
  id: 61675,
  title: 'payment Upgradable',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-01-08T19:23'),
};

export const sampleWithPartialData: IArticle = {
  id: 27636,
  title: 'granular',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-01-08T18:44'),
};

export const sampleWithFullData: IArticle = {
  id: 27459,
  title: 'Salad',
  description: '../fake-data/blob/hipster.txt',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-01-08T12:19'),
};

export const sampleWithNewData: NewArticle = {
  title: 'matrix Som',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-01-08T18:57'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
