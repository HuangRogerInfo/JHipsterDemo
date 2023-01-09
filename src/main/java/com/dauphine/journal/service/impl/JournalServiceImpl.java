package com.dauphine.journal.service.impl;

import com.dauphine.journal.domain.Journal;
import com.dauphine.journal.repository.JournalRepository;
import com.dauphine.journal.service.JournalService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Journal}.
 */
@Service
@Transactional
public class JournalServiceImpl implements JournalService {

    private final Logger log = LoggerFactory.getLogger(JournalServiceImpl.class);

    private final JournalRepository journalRepository;

    public JournalServiceImpl(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    @Override
    public Journal save(Journal journal) {
        log.debug("Request to save Journal : {}", journal);
        return journalRepository.save(journal);
    }

    @Override
    public Journal update(Journal journal) {
        log.debug("Request to update Journal : {}", journal);
        return journalRepository.save(journal);
    }

    @Override
    public Optional<Journal> partialUpdate(Journal journal) {
        log.debug("Request to partially update Journal : {}", journal);

        return journalRepository
            .findById(journal.getId())
            .map(existingJournal -> {
                if (journal.getTitle() != null) {
                    existingJournal.setTitle(journal.getTitle());
                }
                if (journal.getDescription() != null) {
                    existingJournal.setDescription(journal.getDescription());
                }

                return existingJournal;
            })
            .map(journalRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Journal> findAll() {
        log.debug("Request to get all Journals");
        return journalRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Journal> findOne(Long id) {
        log.debug("Request to get Journal : {}", id);
        return journalRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Journal : {}", id);
        journalRepository.deleteById(id);
    }
}
