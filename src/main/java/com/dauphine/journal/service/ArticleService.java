package com.dauphine.journal.service;

import com.dauphine.journal.domain.Article;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Article}.
 */
public interface ArticleService {
    /**
     * Save a article.
     *
     * @param article the entity to save.
     * @return the persisted entity.
     */
    Article save(Article article);

    /**
     * Updates a article.
     *
     * @param article the entity to update.
     * @return the persisted entity.
     */
    Article update(Article article);

    /**
     * Partially updates a article.
     *
     * @param article the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Article> partialUpdate(Article article);

    /**
     * Get all the articles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Article> findAll(Pageable pageable);

    /**
     * Get the "id" article.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Article> findOne(Long id);

    /**
     * Delete the "id" article.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
