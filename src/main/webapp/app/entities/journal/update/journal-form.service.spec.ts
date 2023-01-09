import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../journal.test-samples';

import { JournalFormService } from './journal-form.service';

describe('Journal Form Service', () => {
  let service: JournalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalFormService);
  });

  describe('Service methods', () => {
    describe('createJournalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJournalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing IJournal should create a new form with FormGroup', () => {
        const formGroup = service.createJournalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getJournal', () => {
      it('should return NewJournal for default Journal initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createJournalFormGroup(sampleWithNewData);

        const journal = service.getJournal(formGroup) as any;

        expect(journal).toMatchObject(sampleWithNewData);
      });

      it('should return NewJournal for empty Journal initial value', () => {
        const formGroup = service.createJournalFormGroup();

        const journal = service.getJournal(formGroup) as any;

        expect(journal).toMatchObject({});
      });

      it('should return IJournal', () => {
        const formGroup = service.createJournalFormGroup(sampleWithRequiredData);

        const journal = service.getJournal(formGroup) as any;

        expect(journal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJournal should not enable id FormControl', () => {
        const formGroup = service.createJournalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJournal should disable id FormControl', () => {
        const formGroup = service.createJournalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
