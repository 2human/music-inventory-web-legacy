package com.toohuman.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toohuman.model.Entry;
import com.toohuman.model.Sources;

public interface EntryRepo extends JpaRepository<Entry, Integer> {

	@Query("from Entry where collection LIKE %?1%")
	List<Entry> findByCollection(String collection);
	
	@Query("from Entry where sourceNumber=?1")
	List<Entry> findBySourceNumber(double sourceNumber);
	
	@Query("from Entry where FLOOR(sourceNumber) = FLOOR(?1)")
	List<Entry> findByRoundedSourceNumber(double sourceNumber);

	@Query("from Entry where location LIKE %?1%")
	List<Entry> findByLocation(String location);

	@Query("from Entry where title LIKE %?1%")
	List<Entry> findByTitle(String title);

	@Query("from Entry where composer LIKE %?1%")
	List<Entry> findByComposer(String composer);

	@Query("from Entry where vocalPart LIKE %?1%")
	List<Entry> findByVocalPart(String vocalPart);

	@Query("from Entry where key LIKE %?1%")
	List<Entry> findByKey(String key);

	@Query("from Entry where melodicIncipit LIKE %?1%")
	List<Entry> findByMelodicIncipit(String melodicIncipit);

	@Query("from Entry where textIncipit LIKE %?1%")
	List<Entry> findByTextIncipit(String textIncipit);

	@Query("from Entry where isSecular LIKE %?1%")
	List<Entry> findByIsSecular(String isSecular);
	
	@Query("from Entry where notes LIKE %?1%")
	List<Entry> findByNotes(String notes);
	
}

	

