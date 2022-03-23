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
		"http://musicinventoryapp.com", "http://www.musicinventoryapp.com"}, maxAge = 3600)
public class SourcesAdvancedSearchController {
	
	@Autowired
	SourcesRepo repo;
	
	@RequestMapping(method = RequestMethod.GET, value = "/sources", params = {"searchText", "table", "id", "sourceNumber", "collection",
																			"callNumber", "author", "title", "inscription", "description"})
	public Set<Sources> advancedSearch(@RequestParam String searchText, @RequestParam String table, @RequestParam String id,
			@RequestParam String sourceNumber, @RequestParam String collection, @RequestParam String callNumber, @RequestParam String author,
			@RequestParam String title, @RequestParam String inscription, @RequestParam String description) {
		System.out.println("advancedsearch");
		
		Set<Sources> resultSet = getAdvancedResultSet(searchText, id, collection, sourceNumber, callNumber,	//filter by each individual field
				author, title, inscription, description);

		return resultSet;		
	}
	
	//get results by checking each field in advanced search
	private Set<Sources> getAdvancedResultSet(String searchText, String id, String collection, String sourceNumber, 
			String callNumber, String author, String title, String inscription, String description){
		Set<Sources> resultSet = new HashSet<Sources>();	//search all fields to determine if there are any matches, 
		boolean databaseQueried = false;	//determine if DB should be queried or resultSet should be filtered
		
		if(id.length() > 0) {
			if(databaseQueried) {	
				resultSet = SourceResultFilter.getFilteredByIdSet(id, resultSet);
			}
			else {				
				try {
					resultSet.add(repo.findById(Integer.parseInt(id)).orElse(new Sources()));
				} catch(Exception e) {
					System.out.println("NaN entered as ID");
				}		
				databaseQueried = true;
			}
		}
		
		if(collection.length() > 0) {
			if(databaseQueried) {
				resultSet = SourceResultFilter.getFilteredByCollectionSet(collection, resultSet);
			}
			else {
				resultSet.addAll(repo.findByCollection(collection));	
				databaseQueried = true;			
			}
		}
		
		if(sourceNumber.length() > 0) {
			if(databaseQueried) {
				resultSet = SourceResultFilter.getFilteredBySourceNumberSet(sourceNumber, resultSet);
			}
			else {
				try {
					double srcNum = Double.parseDouble(sourceNumber);
					//if whole number, get all sub sources within that source (same integer with decimal points)
					if(srcNum == Math.floor(srcNum)) {
						resultSet.addAll(repo.findByRoundedSourceNumber(srcNum));						
					}
					//otherwise get exact match
					else {
						resultSet.addAll(repo.findBySourceNumber(srcNum));
					}
				} catch(Exception e) {
					System.out.println("NaN entered as sourceNumber");
				}				
				databaseQueried = true;
			}
		}
		
		if(callNumber.length() > 0) {
			if(databaseQueried) {
				resultSet = SourceResultFilter.getFilteredByCallNumberSet(callNumber, resultSet);
			}
			else {
				resultSet.addAll(repo.findByCallNumber(callNumber));	
				databaseQueried = true;			
			}
		}
		
		if(author.length() > 0) {
			if(databaseQueried) {
				resultSet = SourceResultFilter.getFilteredByAuthorSet(author, resultSet);
			}
			else {
				resultSet.addAll(repo.findByAuthor(author));	
				databaseQueried = true;			
			}
		}
		
		if(title.length() > 0) {
			if(databaseQueried) {
				resultSet = SourceResultFilter.getFilteredByTitleSet(title, resultSet);	
			}
			else {
				resultSet.addAll(repo.findByTitle(title));	
				databaseQueried = true;		
			}
		}
		
		if(inscription.length() > 0) {
			if(databaseQueried) {	
				resultSet = SourceResultFilter.getFilteredByInscriptionSet(inscription, resultSet);
			}
			else {
				resultSet.addAll(repo.findByInscription(inscription));	
				databaseQueried = true;		
			}
		}
		
		if(description.length() > 0) {
			if(databaseQueried) {		
				resultSet = SourceResultFilter.getFilteredByDescriptionSet(description, resultSet);
			}
			else {
				resultSet.addAll(repo.findByDescription(description));
				databaseQueried = true;		
			}
		}	
		
		if(databaseQueried) {	
			resultSet = getFilteredKeywordResultSet(searchText.split(" "), resultSet, 0);
		}
		else {
			resultSet = getKeywordSearchResultSet(searchText);
		}		
		
		return resultSet;			
	}
	
	//TODO: this is repeated in keyword search controller; get rid of this
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
//				System.out.println("NaN entered as ID");
		}
		workingSet.addAll(repo.findByCollection(keyword));
		try {
			workingSet.addAll(repo.findBySourceNumber(Double.parseDouble(keyword)));
		} catch(Exception e) {
//				System.out.println("NaN entered as sourceNumber");
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
