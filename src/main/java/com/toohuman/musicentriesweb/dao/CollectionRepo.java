package com.toohuman.musicentriesweb.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toohuman.musicentriesweb.model.Collection;

public interface CollectionRepo extends JpaRepository<Collection, Integer>{

	@Query("from Collection where collection LIKE %?1%")
	List<Collection> findByCollection(String collection);

	@Query("from Collection where description LIKE %?1%")
	List<Collection> findByDescription(String description);
}
