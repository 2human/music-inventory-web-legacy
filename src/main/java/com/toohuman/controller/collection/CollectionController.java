package com.toohuman.controller.collection;

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

import com.toohuman.dao.CollectionRepo;
import com.toohuman.filters.CollectionResultFilter;
import com.toohuman.model.Collection;

@RestController
@CrossOrigin(origins = { "http://www.sacredmusicinventory.org", "http://www.sacredmusicinventory.com",
		"http://sacredmusicinventory.com", "http://sacredmusicinventory.org",
		"http://musicinventoryapp.com", "http://www.musicinventoryapp.com",
		"https://musicinventoryapp.com", "https://www.musicinventoryapp.com",
		"http://localhost:3000", "localhost:3000"}, maxAge = 3600)
public class CollectionController {

	@Autowired
	CollectionRepo repo;
	
	//get all collection information
	@RequestMapping(method = RequestMethod.GET, value="/collections", params = {})
	public List<Collection> getAll(){
		return repo.findAll();
	}
		
	//get search results by searching all fields
	@RequestMapping(method = RequestMethod.GET, value = "/collections", params = {"searchText", "table"})
	public Set<Collection> searchByKeyword(@RequestParam String searchText, @RequestParam String table) {
		Set<Collection> resultSet = getKeywordSearchResultSet(searchText);
		return resultSet;
	}	
	
	//fetch search results for search containing parameters of specific fields
	@RequestMapping(value = "/collections", params = {"searchText", "table", "field"})
	public Set<Collection> searchByKeywordWithFields(@RequestParam String searchText, @RequestParam String table, @RequestParam String field) {
		List<String> fields = new ArrayList<String>(Arrays.asList(field.split(",")));
		String[] keywords = searchText.split(" ");
		Set<Collection> resultSet = getInitialResultSet(keywords[0], fields);
		Set<Collection> oldResultSet = new HashSet<Collection>();	
		for(int i = 1; i < keywords.length; i++) {
			oldResultSet = resultSet;
			resultSet = getFilteredResultSet(keywords[i], oldResultSet, fields);			
		}
		return resultSet;
	}
	
		
	//get initial result set by querying SELECTED fields within database
	private Set<Collection> getInitialResultSet(String keyword, List<String> fields){
		Set<Collection> workingSet = new HashSet<Collection>();		
		for(String field: fields) {
			switch(field) {
				case "id":
					//TODO make it so this does not return a null source object when integer input
					try {
						workingSet.add(repo.findById(Integer.parseInt(keyword)).orElse(new Collection()));
					} catch(Exception e) {
						System.out.println("NaN entered as ID");
					}
					break;
				case "collection":
					System.out.println("Run 2");
					workingSet.addAll(repo.findByCollection(keyword));
					break;
				case "description":
					workingSet.addAll(repo.findByDescription(keyword));
					break;
			}
		}
		return workingSet;
	}	
		
	//get filtered result set by filtering existing set, checking all fields
	private Set<Collection> getFilteredResultSet(String keyword, Set<Collection> curResultSet, List<String> fields){
		Set<Collection> workingSet = new HashSet<Collection>();
		for(Collection curResult: curResultSet) {
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
					case "description":
						if(curResult.getDescription().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
						break;
				}
			}
			
		}
		return workingSet;
	}
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/collections", params = {"searchText", "table", "id", "collection", "description"})
	public Set<Collection> advancedSearch(@RequestParam String searchText, @RequestParam String table,
		@RequestParam String id, @RequestParam String collection, @RequestParam String description) {
		System.out.println("advancedsearch");
		
		Set<Collection> resultSet = getKeywordSearchResultSet(searchText);	//filter first by keywords
		
		resultSet = getAdvancedResultSet(resultSet, id, collection, description);	//filter by each individual field
		
		return resultSet;		
	}
	
	//get results checking only the keywords
	private Set<Collection> getKeywordSearchResultSet(String searchText){
		String[] keywords = searchText.split(" ");				//split so that each keyword is searched individually
		Set<Collection> resultSet = getInitialResultSet(keywords[0]);//construct initial results from searching database with first keyword
		Set<Collection> oldResultSet = new HashSet<Collection>();			//placeholder set
		for(int i = 1; i < keywords.length; i++) {				//starting at second keyword, filter by each keyword
			oldResultSet = resultSet;
			resultSet = CollectionResultFilter.getFilteredResultSet(keywords[i], oldResultSet);	//filter results by current keyword			
		}		
		return resultSet;
	}
	
	private Set<Collection> getInitialResultSet(String keyword){
		Set<Collection> workingSet = new HashSet<Collection>();		//search all fields to determine if there are any matches, 
		//adding them to a set so that duplicates are not retained
		try {
			workingSet.add(repo.findById(Integer.parseInt(keyword)).orElse(new Collection()));
		} catch(Exception e) {
//			System.out.println("NaN entered as ID");
		}
		workingSet.addAll(repo.findByCollection(keyword));			
		workingSet.addAll(repo.findByDescription(keyword));	
		
		return workingSet;
	}
	
	//get results by checking each field in advanced search
	private Set<Collection> getAdvancedResultSet(Set<Collection> resultSet, String id, String collection, String description){
	
		if(id.length() > 0) resultSet = CollectionResultFilter.getFilteredByIdSet(id, resultSet);
		if(collection.length() > 0) resultSet = CollectionResultFilter.getFilteredByCollectionSet(collection, resultSet);
		if(description.length() > 0) resultSet = CollectionResultFilter.getFilteredByDescriptionSet(description, resultSet);
		
		return resultSet;	
	}	
	//get page containing information for single collection
	@RequestMapping("/getCollection")
	public ModelAndView getCollection(@RequestParam int id) {
		ModelAndView mv = new ModelAndView("showCollection.html");
		Collection collection =  repo.findById(id).orElse(new Collection());
		mv.addObject(collection);
		return mv;
		
	}
	
	//TODO edit collection CSS for larger textbox
	//display form for editing collection information
	@RequestMapping("/editCollection")
	public ModelAndView editCollection(@RequestParam int id) {
		ModelAndView mv = new ModelAndView("editCollection.html");
		Collection collection =  repo.findById(id).orElse(new Collection());
		mv.addObject(collection);
		return mv;		
	}
	
	//update collection information in database and return updated page
	@RequestMapping("/updateCollection")
	public ModelAndView updateCollection(@RequestParam int id, @RequestParam(value="collection") String collectionName, @RequestParam String description) {
		//construct collection object and update database
		Collection collection = new Collection(id, collectionName, description);
		repo.save(collection);
		//generate / return page with updated information
		ModelAndView mv = new ModelAndView("editCollection.html");
		collection =  repo.findById(id).orElse(new Collection());
		mv.addObject(collection);
		return mv;
	}
	
	//update collection information in database and return updated collection object
	@RequestMapping(method = RequestMethod.POST, value = "/collections")
	public Collection createCollection(@RequestParam(value="collection") String collectionName, @RequestParam String description) {
		//construct collection object and update database
		Collection collection = new Collection(collectionName, description);
		repo.save(collection);
		collection =  repo.findById(collection.getId()).orElse(new Collection());
		return collection;
	}
	
	//update collection information in database and return updated collection object
	@RequestMapping(method = RequestMethod.PUT, value = "/collections")
	public Collection updateCollectionTable(@RequestParam int id, @RequestParam(value="collection") String collectionName, @RequestParam String description) {
		//construct collection object and update database
		Collection collection = new Collection(id, collectionName, description);
		repo.save(collection);
		collection =  repo.findById(id).orElse(new Collection());
		return collection;
	}
	
	//create a new database entry for collection and return page containing new collection information
	//and confirmation of successful creation
	@RequestMapping(value = "/createCollection", params = {"collection", "description"})
	public ModelAndView createCollectionMVC(@RequestParam(value="collection") String collectionName, @RequestParam String description) {
		//construct collection object and update database
		Collection collection = new Collection(collectionName, description);
		repo.save(collection);
		//generate / return page with updated information
		String message = "Collection with ID number " + collection.getId() + " created.";
		System.out.println(message);
		ModelAndView mv = new ModelAndView("createCollectionSuccess.html");
		mv.addObject(collection);
		return mv;
	}
	
	

	//update collection information in database and return updated page
	@RequestMapping(value = "/create-collection", params = {})
	public ModelAndView createCollection() {
		ModelAndView mv = new ModelAndView("create-collection.html");
		return mv;
	}
	
	//delete entry from view collection page, and return view of another collection
	@RequestMapping("/deleteCollection")
	public ModelAndView deleteCollection(@RequestParam int id, @RequestParam(value="collection") String collectionName, @RequestParam String description) {
		//construct collection object and update database
		Collection collection = repo.findById(id).orElse(new Collection());
		repo.delete(collection);
		//generate / return page with updated information
		ModelAndView mv = new ModelAndView("editCollection.html");
		collection = repo.findById(id - 1).orElse(new Collection());
		mv.addObject(collection);
		return mv;
	}
	
	//delete collection entry and return collection that was deleted
	@RequestMapping(method = RequestMethod.DELETE, value = "/collections", params = {"id", "collection", "description"})
	public Collection delete(@RequestParam int id, @RequestParam(value="collection") String collectionName, @RequestParam String description) {
		//construct collection object and update database
		Collection collection = repo.findById(id).orElse(new Collection());
		repo.delete(collection);
		return collection;
	}
}
