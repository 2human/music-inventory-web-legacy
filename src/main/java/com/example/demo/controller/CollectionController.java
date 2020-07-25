package com.example.demo.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.dao.CollectionRepo;
import com.example.demo.model.Collection;

@RestController
public class CollectionController {

	@Autowired
	CollectionRepo repo;
	
	//get all collection information
	@GetMapping(value="/collections", params = {})
	public List<Collection> getAll(){
		return repo.findAll();
	}
		
	//get search results by searching all fields
	@RequestMapping(value = "/collections", params = {"searchText", "table"})
	public Set<Collection> search(@RequestParam String searchText, @RequestParam String table) {
		
		Set<Collection> collectionSet = new HashSet<Collection>();
			//search all fields to determine if there are any matches, 
			//adding them to a set so that duplicates are not retained
			try {
				collectionSet.add(repo.findById(Integer.parseInt(searchText)).orElse(new Collection()));
				} catch(Exception e) {
					System.out.println("NaN entered as ID");
				}
			collectionSet.addAll(repo.findByCollection(searchText));				
			collectionSet.addAll(repo.findByDescription(searchText));
		return collectionSet;
	}
	
	//fetch search results for search containing parameters of specific fields
	@RequestMapping(value = "/collections", params = {"searchText", "table", "field"})
	public Set<Collection> search(@RequestParam String searchText, @RequestParam String table, @RequestParam String field) {
		List<String> fields = new ArrayList<String>(Arrays.asList(field.split(",")));	//split field parameter into array
		Set<Collection> collectionSet = new HashSet<Collection>();					//set that will contain search results
		//iterate through all selected fields to determine if there are any matches, 
		//adding them to a set so that duplicates are not retained
		for(String f: fields) {
			switch(f) {
				case "id":
					try {
						collectionSet.add(repo.findById(Integer.parseInt(searchText)).orElse(new Collection()));
						} catch(Exception e) {
							System.out.println("NaN entered as ID");
						}
					break;
				case "collection":
					collectionSet.addAll(repo.findByCollection(searchText));
					break;
				case "description":
					collectionSet.addAll(repo.findByDescription(searchText));
					break;
			}
		}
		return collectionSet;
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
//		Sources sources =  repo.findById(id);
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
	
	//update collection information in database and return updated page
	@RequestMapping("/updateCollectionTable")
	public Collection updateCollectionTable(@RequestParam int id, @RequestParam(value="collection") String collectionName, @RequestParam String description) {
		//construct collection object and update database
		Collection collection = new Collection(id, collectionName, description);
		repo.save(collection);
		collection =  repo.findById(id).orElse(new Collection());
		return collection;
	}
	
	//update collection information in database and return updated page
	@RequestMapping(value = "/createCollection", params = {"collection", "description"})
	public ModelAndView createCollection(@RequestParam(value="collection") String collectionName, @RequestParam String description) {
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
	@RequestMapping(value = "/createCollection", params = {})
	public ModelAndView createCollection() {
		ModelAndView mv = new ModelAndView("createCollection.html");
		return mv;
	}
	
	//update collection information in database and return updated page
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
	
}
