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
public class SourcesKeywordFieldsSearchController {
	
	@Autowired
	SourcesRepo repo;
	
	//get request for sources
	@RequestMapping(method = RequestMethod.GET, value = "/sources", params = {"searchText", "table", "field"})
	public Set<Sources> search(@RequestParam String searchText, @RequestParam String table, @RequestParam String field) {
		
		System.out.println("fieldsearch");
		List<String> fields = new ArrayList<String>(Arrays.asList(field.split(",")));
		String[] keywords = searchText.split(" ");
		Set<Sources> resultSet = getInitialResultSet(keywords[0], fields);
		Set<Sources> oldResultSet = new HashSet<Sources>();	
		for(int i = 1; i < keywords.length; i++) {
			oldResultSet = resultSet;
			resultSet = getFilteredResultSet(keywords[i], oldResultSet, fields);			
		}
		return resultSet;
	}
	
	//get initial result set by querying SELECTED fields within database
	private Set<Sources> getInitialResultSet(String keyword, List<String> fields){
		Set<Sources> workingSet = new HashSet<Sources>();		
		for(String field: fields) {
			switch(field) {
				case "id":
					//TODO make it so this does not return a null source object when integer input
					try {
						workingSet.add(repo.findById(Integer.parseInt(keyword)).orElse(new Sources()));
					} catch(Exception e) {
						System.out.println("NaN entered as ID");
					}
					break;
				case "collection":
					workingSet.addAll(repo.findByCollection(keyword));
					break;
				case "sourceNumber":
					try {
						double srcNum = Double.parseDouble(keyword);
						//if whole number, get all sub sources within that source (same whole number followed by decimal points)
						if(isWholeNumber(srcNum)) {
							workingSet.addAll(repo.findByRoundedSourceNumber(srcNum));						
						}
						//if decimal, only get exact matches
						else {
							workingSet.addAll(repo.findBySourceNumber(srcNum));
						}
					} catch(Exception e) {
						System.out.println("NaN entered as sourceNumber");
					}
					break;
				case "callNumber":
					workingSet.addAll(repo.findByCallNumber(keyword));
					break;
				case "author":
					workingSet.addAll(repo.findByAuthor(keyword));
					break;
				case "title":
					workingSet.addAll(repo.findByTitle(keyword));
					break;
				case "inscription":
					workingSet.addAll(repo.findByInscription(keyword));
					break;
				case "description":
					workingSet.addAll(repo.findByDescription(keyword));
					break;
			}
		}
		return workingSet;
	}	
	
	private static boolean isWholeNumber(double number) {
		return number == Math.floor(number);
	}
	
	//get filtered result set by filtering existing set, checking all fields
	private Set<Sources> getFilteredResultSet(String keyword, Set<Sources> curResultSet, List<String> fields){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources curResult: curResultSet) {
			for(String field: fields) {
				switch(field) {
					case "id":
						//TODO make it so this does not return a null source object when integer input
						try {
							if(curResult.getId() == Integer.parseInt(keyword)) workingSet.add(curResult);
						} catch(Exception e) {
							System.out.println("NaN entered as ID");
						}
						break;
					case "collection":
						if(curResult.getCollection().indexOf(keyword) != -1) workingSet.add(curResult);
						break;
					case "sourceNumber":
						try {
							if(curResult.getSourceNumber() == Double.parseDouble(keyword)) workingSet.add(curResult);
						} catch(Exception e) {
							System.out.println("NaN entered as sourceNumber");
						}
						break;
					case "callNumber":
						if(curResult.getCallNumber().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
						break;
					case "author":
						if(curResult.getAuthor().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
						break;
					case "title":
						if(curResult.getTitle().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
						break;
					case "inscription":
						if(curResult.getInscription().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
						break;
					case "description":
						if(curResult.getDescription().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
						break;
				}
			}
			
		}
		return workingSet;
	}	
	

	
}
