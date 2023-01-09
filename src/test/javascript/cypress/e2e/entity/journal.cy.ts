import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Journal e2e test', () => {
  const journalPageUrl = '/journal';
  const journalPageUrlPattern = new RegExp('/journal(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const journalSample = { title: 'invoice IB', description: 'Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci50eHQ=' };

  let journal;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/journals+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/journals').as('postEntityRequest');
    cy.intercept('DELETE', '/api/journals/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (journal) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/journals/${journal.id}`,
      }).then(() => {
        journal = undefined;
      });
    }
  });

  it('Journals menu should load Journals page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('journal');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Journal').should('exist');
    cy.url().should('match', journalPageUrlPattern);
  });

  describe('Journal page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(journalPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Journal page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/journal/new$'));
        cy.getEntityCreateUpdateHeading('Journal');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', journalPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/journals',
          body: journalSample,
        }).then(({ body }) => {
          journal = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/journals+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [journal],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(journalPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Journal page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('journal');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', journalPageUrlPattern);
      });

      it('edit button click should load edit Journal page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Journal');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', journalPageUrlPattern);
      });

      it('edit button click should load edit Journal page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Journal');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', journalPageUrlPattern);
      });

      it('last delete button click should delete instance of Journal', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('journal').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', journalPageUrlPattern);

        journal = undefined;
      });
    });
  });

  describe('new Journal page', () => {
    beforeEach(() => {
      cy.visit(`${journalPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Journal');
    });

    it('should create an instance of Journal', () => {
      cy.get(`[data-cy="title"]`).type('a c').should('have.value', 'a c');

      cy.get(`[data-cy="description"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        journal = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', journalPageUrlPattern);
    });
  });
});
