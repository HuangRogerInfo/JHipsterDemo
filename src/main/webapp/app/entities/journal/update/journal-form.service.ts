import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJournal, NewJournal } from '../journal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJournal for edit and NewJournalFormGroupInput for create.
 */
type JournalFormGroupInput = IJournal | PartialWithRequiredKeyOf<NewJournal>;

type JournalFormDefaults = Pick<NewJournal, 'id'>;

type JournalFormGroupContent = {
  id: FormControl<IJournal['id'] | NewJournal['id']>;
  title: FormControl<IJournal['title']>;
  description: FormControl<IJournal['description']>;
};

export type JournalFormGroup = FormGroup<JournalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JournalFormService {
  createJournalFormGroup(journal: JournalFormGroupInput = { id: null }): JournalFormGroup {
    const journalRawValue = {
      ...this.getFormDefaults(),
      ...journal,
    };
    return new FormGroup<JournalFormGroupContent>({
      id: new FormControl(
        { value: journalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(journalRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(journalRawValue.description, {
        validators: [Validators.required],
      }),
    });
  }

  getJournal(form: JournalFormGroup): IJournal | NewJournal {
    return form.getRawValue() as IJournal | NewJournal;
  }

  resetForm(form: JournalFormGroup, journal: JournalFormGroupInput): void {
    const journalRawValue = { ...this.getFormDefaults(), ...journal };
    form.reset(
      {
        ...journalRawValue,
        id: { value: journalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JournalFormDefaults {
    return {
      id: null,
    };
  }
}
