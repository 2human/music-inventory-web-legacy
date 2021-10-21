package com.toohuman.controller;

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
import com.toohuman.model.Sources;

//TODO change it so that source number does not stay the same in creating new sources
//TODO learn difference between post and put request, and add to all controllers
@RestController
@CrossOrigin
public class SourcesController {
	
	@Autowired
	SourcesRepo repo;
	
	
//	
//	@RequestMapping("/")
//	public String home() {
//		
//		return "home";		
//	}
	
	@RequestMapping(method = RequestMethod.GET, value="/sources", params = {})
	public List<Sources> getAll(){
		return repo.findAll();
	}
	
		
	@RequestMapping(method = RequestMethod.GET, value = "/sources", params = {"searchText", "table"})
	public Set<Sources> searchByKeyword(@RequestParam String searchText, @RequestParam String table) {	
		
		String[] keywords = searchText.split(" ");
		//set that will contain results found
		Set<Sources> resultSet = getInitialResultSet(keywords[0]);	//query database for initial results
		Set<Sources> oldResultSet = new HashSet<Sources>();	
		
		//iterate through each keyword, and filter out results that do not contain keyword
		for(int i = 1; i < keywords.length; i++) {					
			oldResultSet = resultSet;
			resultSet = getFilteredResultSet(keywords[i], oldResultSet);
		}		
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
			workingSet.addAll(repo.findBySourceNumber(Integer.parseInt(keyword)));
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
	
	//get filtered result set by filtering existing set, checking all fields
	private Set<Sources> getFilteredResultSet(String keyword, Set<Sources> curResultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		//check each current result, adding only those containing current keyword to filtered set
		for(Sources curResult: curResultSet) {
			try {
				if(curResult.getId() == Integer.parseInt(keyword)) workingSet.add(curResult);
//				resultSet.add(repo.findById(Integer.parseInt(curKeyword)).orElse(new Entry()));
				} catch(Exception e) {
//					System.out.println("NaN entered as ID");
				}
			if(curResult.getCollection().indexOf(keyword) != -1) workingSet.add(curResult);
			try {
				if(curResult.getSourceNumber() == Integer.parseInt(keyword)) workingSet.add(curResult);
			} catch(Exception e) {
//				System.out.println("NaN entered as sourceNumber");
			}
			if(curResult.getCallNumber().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
			if(curResult.getTitle().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
			if(curResult.getAuthor().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
			if(curResult.getInscription().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
			if(curResult.getInscription().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
		}
		return workingSet;
	}
	
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
					System.out.println("Run 2");
					workingSet.addAll(repo.findByCollection(keyword));
					break;
				case "sourceNumber":
					try {
						workingSet.addAll(repo.findBySourceNumber(Integer.parseInt(keyword)));
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
							workingSet.addAll(repo.findBySourceNumber(Integer.parseInt(keyword)));
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
	
	
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/sources", params = {"searchText", "table", "id", "sourceNumber", "collection",
																			"callNumber", "author", "title", "inscription", "description"})
	public Set<Sources> advancedSearch(@RequestParam String searchText, @RequestParam String table, @RequestParam String id,
			@RequestParam String sourceNumber, @RequestParam String collection, @RequestParam String callNumber, @RequestParam String author,
			@RequestParam String title, @RequestParam String inscription, @RequestParam String description) {
		System.out.println("advancedsearch");
		
		Set<Sources> resultSet = getKeywordSearchResultSet(searchText);	//filter first by keywords
		
		resultSet = getAdvancedResultSet(resultSet, id, collection, sourceNumber, callNumber,	//filter by each individual field
				author, title, inscription, description);

		return resultSet;		
	}
	
	//get results checking only the keywords
	private Set<Sources> getKeywordSearchResultSet(String searchText){
		String[] keywords = searchText.split(" ");				//split so that each keyword is searched individually
		Set<Sources> resultSet = getInitialResultSet(keywords[0]);//construct initial results from searching database with first keyword
		Set<Sources> oldResultSet = new HashSet<Sources>();			//placeholder set
		for(int i = 1; i < keywords.length; i++) {				//starting at second keyword, filter by each keyword
			oldResultSet = resultSet;
			resultSet = getFilteredResultSet(keywords[i], oldResultSet);	//filter results by current keyword			
		}		
		return resultSet;
	}
	
	//get results by checking each field in advanced search
	private Set<Sources> getAdvancedResultSet(Set<Sources> resultSet, String id, String collection, String sourceNumber, 
			String callNumber, String author, String title, String inscription, String description){
		
		if(id.length() > 0) resultSet = getFilteredByIdSet(id, resultSet);
		if(collection.length() > 0) resultSet = getFilteredByCollectionSet(collection, resultSet);
		if(sourceNumber.length() > 0) resultSet = getFilteredBySourceNumberSet(sourceNumber, resultSet);
		if(callNumber.length() > 0) resultSet = getFilteredByCallNumberSet(callNumber, resultSet);
		if(author.length() > 0) resultSet = getFilteredByAuthorSet(author, resultSet);
		if(title.length() > 0) resultSet = getFilteredByTitleSet(title, resultSet);
		if(inscription.length() > 0) resultSet = getFilteredByInscriptionSet(inscription, resultSet);
		if(description.length() > 0) resultSet = getFilteredByDescriptionSet(description, resultSet);
		
		return resultSet;	
	}	
	
	private Set<Sources> getFilteredByIdSet(String id, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			try {
				if(result.getId() == Integer.parseInt(id)) workingSet.add(result);
//				resultSet.add(repo.findById(Integer.parseInt(curKeyword)).orElse(new Entry()));
			} catch(Exception e) {
//				System.out.println("NaN entered as ID");
			}			
		}
		return workingSet;
	}
	
	private Set<Sources> getFilteredByCollectionSet(String collection, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getCollection().toLowerCase().indexOf(collection.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Sources> getFilteredBySourceNumberSet(String sourceNumber, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {			
			try {
				if(result.getSourceNumber() == Integer.parseInt(sourceNumber)) workingSet.add(result);
			} catch(Exception e) {
	//			System.out.println("NaN entered as sourceNumber");
			}			
		}
		return workingSet;		
	}
	
	private Set<Sources> getFilteredByCallNumberSet(String callNumber, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getCallNumber().toLowerCase().indexOf(callNumber) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Sources> getFilteredByAuthorSet(String author, Set<Sources> resultSet){
		System.out.println(resultSet.size());
		Set<Sources> workingSet = new HashSet<Sources>();
		
		for(Sources result: resultSet) {
			if(result.getAuthor().toLowerCase().indexOf(author.toLowerCase()) != -1) workingSet.add(result);			
		}		System.out.println(workingSet.size());
		return workingSet;		
	}
	
	private Set<Sources> getFilteredByTitleSet(String title, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getTitle().toLowerCase().indexOf(title.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Sources> getFilteredByInscriptionSet(String inscription, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getInscription().toLowerCase().indexOf(inscription.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Sources> getFilteredByDescriptionSet(String description, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getDescription().toLowerCase().indexOf(description.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}	
	
	
	@RequestMapping("/getSource")
	public ModelAndView getSources(@RequestParam int id) {
		ModelAndView mv = new ModelAndView("showSource.html");
		Sources sources =  repo.findById(id).orElse(new Sources());

//		Sources sources =  repo.findById(id)
		mv.addObject(sources);
		return mv;		
	}
	
	@RequestMapping("/getSample")
	public ModelAndView getSample(@RequestParam int id) {
		ModelAndView mv = new ModelAndView("test.html");
		return mv;		
	}
	
	
	@RequestMapping("/editSource")
	public ModelAndView editSources(@RequestParam int id) {
		ModelAndView mv = new ModelAndView("editSource.html");
		Sources sources =  repo.findById(id).orElse(new Sources());
		mv.addObject(sources);
		return mv;		
	}
	
	@RequestMapping(value = "/updateSources", params = {"id", "collection", "sourceNumber", "callNumber", "author", "title", "inscription", "description"})
	public ModelAndView updateSources(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
							@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
							@RequestParam String inscription, @RequestParam String description) {
		Sources sources = new Sources(id, collection, sourceNumber, callNumber, author, title, inscription, description);
		repo.save(sources);
		
		ModelAndView mv = new ModelAndView("editSource.html");
		sources =  repo.findById(id).orElse(new Sources());
		mv.addObject(sources);
		return mv;
	}	

	@RequestMapping(method = RequestMethod.POST, value = "/sources", params = {"id", "collection", "sourceNumber", "callNumber", "author", "title", "inscription", "description"})
	public Sources updateSourcesTable(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
					@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
					@RequestParam String inscription, @RequestParam String description) {
		Sources sources = new Sources(id, collection, sourceNumber, callNumber, author, title, inscription, description);
		repo.save(sources);
		sources =  repo.findById(id).orElse(new Sources());
		System.out.println("Returning");
		return sources;
		}
	
	
	@RequestMapping(value = "/createSources", params = {"collection", "sourceNumber", "callNumber", "author", "title", "inscription", "description"})
	public ModelAndView createSources(@RequestParam String collection, @RequestParam int sourceNumber,
							@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
							@RequestParam String inscription, @RequestParam String description) {
		Sources sources = new Sources(collection, sourceNumber, callNumber, author, title, inscription, description);
		repo.save(sources);
		
		ModelAndView mv = new ModelAndView("createSourcesSuccess.html");
		mv.addObject(sources);
		return mv;
	}
	
	
	@RequestMapping(value = "/createSources", params = {})
	public ModelAndView createSources() {
		ModelAndView mv = new ModelAndView("createSources.html");
		return mv;		
	}
	
	@RequestMapping(value = "/deleteSources", params = {"id", "collection", "sourceNumber", "callNumber", "author", "title", "inscription", "description"})
	public ModelAndView deleteSources(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
							@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
							@RequestParam String inscription, @RequestParam String description) {
		Sources sources =  repo.findById(id).orElse(new Sources());
		repo.delete(sources);
		
		ModelAndView mv = new ModelAndView("editSources.html");
		sources =  repo.findById(id - 1).orElse(new Sources());
		mv.addObject(sources);
		return mv;
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/sources", params = {"id", "collection", "sourceNumber", "callNumber", "author", "title", "inscription", "description"})
	public Sources delete(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
							@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
							@RequestParam String inscription, @RequestParam String description) {
		Sources sources =  repo.findById(id).orElse(new Sources());
		System.out.println(sources.getId());
		repo.delete(sources);
		return sources;
	}

	
}
