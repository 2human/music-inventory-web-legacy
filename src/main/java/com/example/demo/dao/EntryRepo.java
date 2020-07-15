package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Entry;

public interface EntryRepo extends JpaRepository<Entry, Integer> {

	
	
}
