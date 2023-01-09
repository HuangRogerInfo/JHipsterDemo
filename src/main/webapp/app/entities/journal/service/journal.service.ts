import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJournal, NewJournal } from '../journal.model';

export type PartialUpdateJournal = Partial<IJournal> & Pick<IJournal, 'id'>;

export type EntityResponseType = HttpResponse<IJournal>;
export type EntityArrayResponseType = HttpResponse<IJournal[]>;

@Injectable({ providedIn: 'root' })
export class JournalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/journals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(journal: NewJournal): Observable<EntityResponseType> {
    return this.http.post<IJournal>(this.resourceUrl, journal, { observe: 'response' });
  }

  update(journal: IJournal): Observable<EntityResponseType> {
    return this.http.put<IJournal>(`${this.resourceUrl}/${this.getJournalIdentifier(journal)}`, journal, { observe: 'response' });
  }

  partialUpdate(journal: PartialUpdateJournal): Observable<EntityResponseType> {
    return this.http.patch<IJournal>(`${this.resourceUrl}/${this.getJournalIdentifier(journal)}`, journal, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJournal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJournal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJournalIdentifier(journal: Pick<IJournal, 'id'>): number {
    return journal.id;
  }

  compareJournal(o1: Pick<IJournal, 'id'> | null, o2: Pick<IJournal, 'id'> | null): boolean {
    return o1 && o2 ? this.getJournalIdentifier(o1) === this.getJournalIdentifier(o2) : o1 === o2;
  }

  addJournalToCollectionIfMissing<Type extends Pick<IJournal, 'id'>>(
    journalCollection: Type[],
    ...journalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const journals: Type[] = journalsToCheck.filter(isPresent);
    if (journals.length > 0) {
      const journalCollectionIdentifiers = journalCollection.map(journalItem => this.getJournalIdentifier(journalItem)!);
      const journalsToAdd = journals.filter(journalItem => {
        const journalIdentifier = this.getJournalIdentifier(journalItem);
        if (journalCollectionIdentifiers.includes(journalIdentifier)) {
          return false;
        }
        journalCollectionIdentifiers.push(journalIdentifier);
        return true;
      });
      return [...journalsToAdd, ...journalCollection];
    }
    return journalCollection;
  }
}
