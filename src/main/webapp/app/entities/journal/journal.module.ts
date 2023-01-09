import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JournalComponent } from './list/journal.component';
import { JournalDetailComponent } from './detail/journal-detail.component';
import { JournalUpdateComponent } from './update/journal-update.component';
import { JournalDeleteDialogComponent } from './delete/journal-delete-dialog.component';
import { JournalRoutingModule } from './route/journal-routing.module';

@NgModule({
  imports: [SharedModule, JournalRoutingModule],
  declarations: [JournalComponent, JournalDetailComponent, JournalUpdateComponent, JournalDeleteDialogComponent],
})
export class JournalModule {}
