package com.dauphine.journal.service;

import com.dauphine.journal.domain.Journal;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Journal}.
 */
public interface JournalService {
    /**
     * Save a journal.
     *
     * @param journal the entity to save.
     * @return the persisted entity.
     */
    Journal save(Journal journal);

    /**
     * Updates a journal.
     *
     * @param journal the entity to update.
     * @return the persisted entity.
     */
    Journal update(Journal journal);

    /**
     * Partially updates a journal.
     *
     * @param journal the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Journal> partialUpdate(Journal journal);

    /**
     * Get all the journals.
     *
     * @return the list of entities.
     */
    List<Journal> findAll();

    /**
     * Get the "id" journal.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Journal> findOne(Long id);

    /**
     * Delete the "id" journal.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
