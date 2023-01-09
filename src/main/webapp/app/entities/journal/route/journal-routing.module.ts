import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JournalComponent } from '../list/journal.component';
import { JournalDetailComponent } from '../detail/journal-detail.component';
import { JournalUpdateComponent } from '../update/journal-update.component';
import { JournalRoutingResolveService } from './journal-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const journalRoute: Routes = [
  {
    path: '',
    component: JournalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JournalDetailComponent,
    resolve: {
      journal: JournalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JournalUpdateComponent,
    resolve: {
      journal: JournalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JournalUpdateComponent,
    resolve: {
      journal: JournalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(journalRoute)],
  exports: [RouterModule],
})
export class JournalRoutingModule {}
