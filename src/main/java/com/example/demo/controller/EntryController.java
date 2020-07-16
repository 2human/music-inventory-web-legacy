package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.EntryRepo;
import com.example.demo.model.Entry;

@RestController
public class EntryController {

	@Autowired
	EntryRepo repo;
	
	@GetMapping(value="/entries")
	public List<Entry> getAll(){
		return repo.findAll();
	}
}
