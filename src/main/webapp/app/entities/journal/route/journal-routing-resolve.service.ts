import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJournal } from '../journal.model';
import { JournalService } from '../service/journal.service';

@Injectable({ providedIn: 'root' })
export class JournalRoutingResolveService implements Resolve<IJournal | null> {
  constructor(protected service: JournalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJournal | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((journal: HttpResponse<IJournal>) => {
          if (journal.body) {
            return of(journal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
