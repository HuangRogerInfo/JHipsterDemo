import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJournal } from '../journal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../journal.test-samples';

import { JournalService } from './journal.service';

const requireRestSample: IJournal = {
  ...sampleWithRequiredData,
};

describe('Journal Service', () => {
  let service: JournalService;
  let httpMock: HttpTestingController;
  let expectedResult: IJournal | IJournal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JournalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Journal', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const journal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(journal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Journal', () => {
      const journal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(journal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Journal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Journal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Journal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJournalToCollectionIfMissing', () => {
      it('should add a Journal to an empty array', () => {
        const journal: IJournal = sampleWithRequiredData;
        expectedResult = service.addJournalToCollectionIfMissing([], journal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(journal);
      });

      it('should not add a Journal to an array that contains it', () => {
        const journal: IJournal = sampleWithRequiredData;
        const journalCollection: IJournal[] = [
          {
            ...journal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJournalToCollectionIfMissing(journalCollection, journal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Journal to an array that doesn't contain it", () => {
        const journal: IJournal = sampleWithRequiredData;
        const journalCollection: IJournal[] = [sampleWithPartialData];
        expectedResult = service.addJournalToCollectionIfMissing(journalCollection, journal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(journal);
      });

      it('should add only unique Journal to an array', () => {
        const journalArray: IJournal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const journalCollection: IJournal[] = [sampleWithRequiredData];
        expectedResult = service.addJournalToCollectionIfMissing(journalCollection, ...journalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const journal: IJournal = sampleWithRequiredData;
        const journal2: IJournal = sampleWithPartialData;
        expectedResult = service.addJournalToCollectionIfMissing([], journal, journal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(journal);
        expect(expectedResult).toContain(journal2);
      });

      it('should accept null and undefined values', () => {
        const journal: IJournal = sampleWithRequiredData;
        expectedResult = service.addJournalToCollectionIfMissing([], null, journal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(journal);
      });

      it('should return initial array if no Journal is added', () => {
        const journalCollection: IJournal[] = [sampleWithRequiredData];
        expectedResult = service.addJournalToCollectionIfMissing(journalCollection, undefined, null);
        expect(expectedResult).toEqual(journalCollection);
      });
    });

    describe('compareJournal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJournal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJournal(entity1, entity2);
        const compareResult2 = service.compareJournal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJournal(entity1, entity2);
        const compareResult2 = service.compareJournal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJournal(entity1, entity2);
        const compareResult2 = service.compareJournal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
