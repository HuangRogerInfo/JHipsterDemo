import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJournal } from '../journal.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-journal-detail',
  templateUrl: './journal-detail.component.html',
})
export class JournalDetailComponent implements OnInit {
  journal: IJournal | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ journal }) => {
      this.journal = journal;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
