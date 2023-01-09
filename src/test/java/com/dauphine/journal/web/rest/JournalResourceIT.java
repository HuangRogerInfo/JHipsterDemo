package com.dauphine.journal.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dauphine.journal.IntegrationTest;
import com.dauphine.journal.domain.Journal;
import com.dauphine.journal.repository.JournalRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link JournalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JournalResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/journals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJournalMockMvc;

    private Journal journal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Journal createEntity(EntityManager em) {
        Journal journal = new Journal().title(DEFAULT_TITLE).description(DEFAULT_DESCRIPTION);
        return journal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Journal createUpdatedEntity(EntityManager em) {
        Journal journal = new Journal().title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);
        return journal;
    }

    @BeforeEach
    public void initTest() {
        journal = createEntity(em);
    }

    @Test
    @Transactional
    void createJournal() throws Exception {
        int databaseSizeBeforeCreate = journalRepository.findAll().size();
        // Create the Journal
        restJournalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(journal)))
            .andExpect(status().isCreated());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeCreate + 1);
        Journal testJournal = journalList.get(journalList.size() - 1);
        assertThat(testJournal.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testJournal.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createJournalWithExistingId() throws Exception {
        // Create the Journal with an existing ID
        journal.setId(1L);

        int databaseSizeBeforeCreate = journalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJournalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(journal)))
            .andExpect(status().isBadRequest());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = journalRepository.findAll().size();
        // set the field null
        journal.setTitle(null);

        // Create the Journal, which fails.

        restJournalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(journal)))
            .andExpect(status().isBadRequest());

        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllJournals() throws Exception {
        // Initialize the database
        journalRepository.saveAndFlush(journal);

        // Get all the journalList
        restJournalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(journal.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    void getJournal() throws Exception {
        // Initialize the database
        journalRepository.saveAndFlush(journal);

        // Get the journal
        restJournalMockMvc
            .perform(get(ENTITY_API_URL_ID, journal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(journal.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingJournal() throws Exception {
        // Get the journal
        restJournalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJournal() throws Exception {
        // Initialize the database
        journalRepository.saveAndFlush(journal);

        int databaseSizeBeforeUpdate = journalRepository.findAll().size();

        // Update the journal
        Journal updatedJournal = journalRepository.findById(journal.getId()).get();
        // Disconnect from session so that the updates on updatedJournal are not directly saved in db
        em.detach(updatedJournal);
        updatedJournal.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restJournalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJournal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJournal))
            )
            .andExpect(status().isOk());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
        Journal testJournal = journalList.get(journalList.size() - 1);
        assertThat(testJournal.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testJournal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingJournal() throws Exception {
        int databaseSizeBeforeUpdate = journalRepository.findAll().size();
        journal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJournalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, journal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(journal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJournal() throws Exception {
        int databaseSizeBeforeUpdate = journalRepository.findAll().size();
        journal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJournalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(journal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJournal() throws Exception {
        int databaseSizeBeforeUpdate = journalRepository.findAll().size();
        journal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJournalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(journal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJournalWithPatch() throws Exception {
        // Initialize the database
        journalRepository.saveAndFlush(journal);

        int databaseSizeBeforeUpdate = journalRepository.findAll().size();

        // Update the journal using partial update
        Journal partialUpdatedJournal = new Journal();
        partialUpdatedJournal.setId(journal.getId());

        partialUpdatedJournal.description(UPDATED_DESCRIPTION);

        restJournalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJournal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJournal))
            )
            .andExpect(status().isOk());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
        Journal testJournal = journalList.get(journalList.size() - 1);
        assertThat(testJournal.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testJournal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateJournalWithPatch() throws Exception {
        // Initialize the database
        journalRepository.saveAndFlush(journal);

        int databaseSizeBeforeUpdate = journalRepository.findAll().size();

        // Update the journal using partial update
        Journal partialUpdatedJournal = new Journal();
        partialUpdatedJournal.setId(journal.getId());

        partialUpdatedJournal.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restJournalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJournal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJournal))
            )
            .andExpect(status().isOk());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
        Journal testJournal = journalList.get(journalList.size() - 1);
        assertThat(testJournal.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testJournal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingJournal() throws Exception {
        int databaseSizeBeforeUpdate = journalRepository.findAll().size();
        journal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJournalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, journal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(journal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJournal() throws Exception {
        int databaseSizeBeforeUpdate = journalRepository.findAll().size();
        journal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJournalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(journal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJournal() throws Exception {
        int databaseSizeBeforeUpdate = journalRepository.findAll().size();
        journal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJournalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(journal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Journal in the database
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJournal() throws Exception {
        // Initialize the database
        journalRepository.saveAndFlush(journal);

        int databaseSizeBeforeDelete = journalRepository.findAll().size();

        // Delete the journal
        restJournalMockMvc
            .perform(delete(ENTITY_API_URL_ID, journal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Journal> journalList = journalRepository.findAll();
        assertThat(journalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
