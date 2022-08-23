package com.toohuman.controller.source;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.toohuman.dao.SourcesRepo;
import com.toohuman.filters.SourceResultFilter;
import com.toohuman.model.Sources;

//TODO change it so that source number does not stay the same in creating new sources
//TODO learn difference between post and put request, and add to all controllers
@RestController
@CrossOrigin(origins = { "http://www.sacredmusicinventory.org", "http://www.sacredmusicinventory.com",
		"http://sacredmusicinventory.com", "http://sacredmusicinventory.org",
		"http://musicinventoryapp.com", "http://www.musicinventoryapp.com",
		"https://musicinventoryapp.com", "https://www.musicinventoryapp.com",
		"http://localhost:3000", "localhost:3000"}, maxAge = 3600)
public class SourcesKeywordSearchController {
	
	@Autowired
	SourcesRepo repo;	
	
	//keyword search with no keywords
	@RequestMapping(method = RequestMethod.GET, value="/sources", params = {})
	public List<Sources> getAll(){
		return repo.findAll();
	}	
		
	@RequestMapping(method = RequestMethod.GET, value = "/sources", params = {"searchText", "table"})
	public Set<Sources> searchByKeyword(@RequestParam String searchText, @RequestParam String table) {	

		//set that will contain results found
		Set<Sources> resultSet = getKeywordSearchResultSet(searchText);
		
		return resultSet;
	}
	
	//get results checking only the keywords
	public Set<Sources> getKeywordSearchResultSet(String searchText){
		String[] keywords = searchText.split(" ");				//split so that each keyword is searched individually
		Set<Sources> resultSet = getInitialResultSet(keywords[0]);//construct initial results from searching database with first keyword	
		System.out.println("Keyword: " + keywords[0]);
		resultSet = getFilteredKeywordResultSet(keywords, resultSet, 1);
		return resultSet;
	}
	
	private Set<Sources> getInitialResultSet(String keyword){
		Set<Sources> workingSet = new HashSet<Sources>();		//search all fields to determine if there are any matches, 
		//adding them to a set so that duplicates are not retained
		try {
			workingSet.add(repo.findById(Integer.parseInt(keyword)).orElse(new Sources()));
		} catch(Exception e) {
//			System.out.println("NaN entered as ID");
		}
		workingSet.addAll(repo.findByCollection(keyword));
		try {
			workingSet.addAll(repo.findBySourceNumber(Double.parseDouble(keyword)));
		} catch(Exception e) {
//			System.out.println("NaN entered as sourceNumber");
		}
		workingSet.addAll(repo.findByCallNumber(keyword));
		workingSet.addAll(repo.findByAuthor(keyword));
		workingSet.addAll(repo.findByTitle(keyword));
		workingSet.addAll(repo.findByInscription(keyword));
		workingSet.addAll(repo.findByDescription(keyword));
		
		return workingSet;
	}
	
	//filter an existing result set based on array of keywords
	public Set<Sources> getFilteredKeywordResultSet(String[] keywords, Set<Sources> resultSet, int startingIndex){
		Set<Sources> workingSet = new HashSet<Sources>();			//placeholder set
		
		for(int i = startingIndex; i < keywords.length; i++) {				//starting at second keyword, filter by each keyword
			workingSet = resultSet;
			resultSet = SourceResultFilter.getFilteredByKeywordSet(keywords[i], workingSet);	//filter results by current keyword			
		}
		
		return resultSet;		
	}
	
}
