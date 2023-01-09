import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JournalFormService } from './journal-form.service';
import { JournalService } from '../service/journal.service';
import { IJournal } from '../journal.model';

import { JournalUpdateComponent } from './journal-update.component';

describe('Journal Management Update Component', () => {
  let comp: JournalUpdateComponent;
  let fixture: ComponentFixture<JournalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let journalFormService: JournalFormService;
  let journalService: JournalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JournalUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(JournalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JournalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    journalFormService = TestBed.inject(JournalFormService);
    journalService = TestBed.inject(JournalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const journal: IJournal = { id: 456 };

      activatedRoute.data = of({ journal });
      comp.ngOnInit();

      expect(comp.journal).toEqual(journal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJournal>>();
      const journal = { id: 123 };
      jest.spyOn(journalFormService, 'getJournal').mockReturnValue(journal);
      jest.spyOn(journalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ journal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: journal }));
      saveSubject.complete();

      // THEN
      expect(journalFormService.getJournal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(journalService.update).toHaveBeenCalledWith(expect.objectContaining(journal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJournal>>();
      const journal = { id: 123 };
      jest.spyOn(journalFormService, 'getJournal').mockReturnValue({ id: null });
      jest.spyOn(journalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ journal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: journal }));
      saveSubject.complete();

      // THEN
      expect(journalFormService.getJournal).toHaveBeenCalled();
      expect(journalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJournal>>();
      const journal = { id: 123 };
      jest.spyOn(journalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ journal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(journalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
