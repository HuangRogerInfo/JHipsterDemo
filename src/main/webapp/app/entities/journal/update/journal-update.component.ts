import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { JournalFormService, JournalFormGroup } from './journal-form.service';
import { IJournal } from '../journal.model';
import { JournalService } from '../service/journal.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-journal-update',
  templateUrl: './journal-update.component.html',
})
export class JournalUpdateComponent implements OnInit {
  isSaving = false;
  journal: IJournal | null = null;

  editForm: JournalFormGroup = this.journalFormService.createJournalFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected journalService: JournalService,
    protected journalFormService: JournalFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ journal }) => {
      this.journal = journal;
      if (journal) {
        this.updateForm(journal);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('jhipsterDemoApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const journal = this.journalFormService.getJournal(this.editForm);
    if (journal.id !== null) {
      this.subscribeToSaveResponse(this.journalService.update(journal));
    } else {
      this.subscribeToSaveResponse(this.journalService.create(journal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJournal>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(journal: IJournal): void {
    this.journal = journal;
    this.journalFormService.resetForm(this.editForm, journal);
  }
}
