package com.example.demo.controller;

/**
 * @author farsor
 * controller for handling rest operations for entry table in collections database
 */

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.example.demo.dao.EntryRepo;
import com.example.demo.model.Entry;

@RestController
public class EntryController {

	@Autowired
	EntryRepo repo;
	
	
	//get all entries
	@RequestMapping(method = RequestMethod.GET, value="/entries")
	public List<Entry> getAll(){
		return repo.findAll();
	}
	
	
	//views page containing information for individual entry
	@RequestMapping("/getEntry")
	public ModelAndView getEntry(@RequestParam int id) {
		ModelAndView mv = new ModelAndView("showEntry.html");	//web page displaying interface
		Entry entry =  repo.findById(id).orElse(new Entry());
		mv.addObject(entry);
		return mv;		
	}
	
	
	//view page containing information for entry within text boxes with entry id as parameter
	@RequestMapping("/editEntry")
	public ModelAndView editEntry(@RequestParam int id) {
		ModelAndView mv = new ModelAndView("editEntry.html");
		Entry entry =  repo.findById(id).orElse(new Entry());
		mv.addObject(entry);
		return mv;		
	}
	
	//updates entry information when user clicks "submit" in editEntry form
	@RequestMapping(method = RequestMethod.POST, value = "/entries")
	public Entry postEntry(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
			@RequestParam String location, @RequestParam String title, @RequestParam String credit,
			@RequestParam String vocalPart, @RequestParam String key, @RequestParam String melodicIncipit, 
			@RequestParam String textIncipit, @RequestParam String isSecular) {
				//construct/new entry object to database with update information
				Entry entry = new Entry(id, collection, sourceNumber, location, title, credit, vocalPart, key, melodicIncipit, textIncipit, isSecular);
				repo.save(entry);
				entry =  repo.findById(id).orElse(new Entry());
				return entry;
		}
	
	//updates entry information when user clicks "submit" in editEntry form
	@RequestMapping("/updateEntry")
	public ModelAndView updateEntry(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
							@RequestParam String location, @RequestParam String title, @RequestParam String credit,
							@RequestParam String vocalPart, @RequestParam String key, @RequestParam String melodicIncipit, 
							@RequestParam String textIncipit, @RequestParam String isSecular) {
		//construct/new entry object to database with update information
		Entry entry = new Entry(id, collection, sourceNumber, location, title, credit, vocalPart, key, melodicIncipit, textIncipit, isSecular);
		repo.save(entry);
		
		//generate page with updated information
		ModelAndView mv = new ModelAndView("editEntry.html");
		entry =  repo.findById(id).orElse(new Entry());
		mv.addObject(entry);
		//display page
		return mv;
	}
	
	//update entry and return JSON object instead of web page
		@RequestMapping("/updateEntryTable")
		public Entry updateEntryTable(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
								@RequestParam String location, @RequestParam String title, @RequestParam String credit,
								@RequestParam String vocalPart, @RequestParam String key, @RequestParam String melodicIncipit, 
								@RequestParam String textIncipit, @RequestParam String isSecular) {
			//construct/new entry object to database with update information
			Entry entry = new Entry(id, collection, sourceNumber, location, title, credit, vocalPart, key, melodicIncipit, textIncipit, isSecular);
			repo.save(entry);
			entry =  repo.findById(id).orElse(new Entry());
			return entry;
		}
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/entries", params = {"searchText", "table"})
	public Set<Entry> search(@RequestParam String searchText, @RequestParam String table) {
		//set that will contain results found
		Set<Entry> entrySet = new HashSet<Entry>();		

		//search all fields to determine if there are any matches, 
		//adding them to a set so that duplicates are not retained
		try {
			entrySet.add(repo.findById(Integer.parseInt(searchText)).orElse(new Entry()));
			} catch(Exception e) {
				System.out.println("NaN entered as ID");
			}
		entrySet.addAll(repo.findByCollection(searchText));
		try {
			entrySet.addAll(repo.findBySourceNumber(Integer.parseInt(searchText)));
		} catch(Exception e) {
			System.out.println("NaN entered as sourceNumber");
		}
		entrySet.addAll(repo.findByLocation(searchText));
		entrySet.addAll(repo.findByTitle(searchText));
		entrySet.addAll(repo.findByCredit(searchText));
		entrySet.addAll(repo.findByVocalPart(searchText));
		entrySet.addAll(repo.findByKey(searchText));
		entrySet.addAll(repo.findByMelodicIncipit(searchText));
		entrySet.addAll(repo.findByTextIncipit(searchText));
		entrySet.addAll(repo.findByIsSecular(searchText));
		
		return entrySet;
	}
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/entries", params = {"searchText", "table", "field"})
	public Set<Entry> search(@RequestParam String searchText, @RequestParam String table, @RequestParam String field) {
		List<String> fields = new ArrayList<String>(Arrays.asList(field.split(",")));
		Set<Entry> entrySet = new HashSet<Entry>();
		System.out.println(field);
		for(String f: fields) {
			switch(f) {
				case "id":			
					try {
						entrySet.add(repo.findById(Integer.parseInt(searchText)).orElse(new Entry()));
						} catch(Exception e) {
							System.out.println("NaN entered as ID");
						}
					break;
				case "collection":
					entrySet.addAll(repo.findByCollection(searchText));
					break;
				case "sourceNumber":
					try {
						entrySet.addAll(repo.findBySourceNumber(Integer.parseInt(searchText)));
					} catch(Exception e) {
						System.out.println("NaN entered as sourceNumber");
					}
					break;
				case "location":
					entrySet.addAll(repo.findByLocation(searchText));
					break;
				case "title":
					entrySet.addAll(repo.findByTitle(searchText));
					break;
				case "credit":
					entrySet.addAll(repo.findByCredit(searchText));
					break;
				case "vocalPart":
					entrySet.addAll(repo.findByVocalPart(searchText));
					break;
				case "key":
					entrySet.addAll(repo.findByKey(searchText));
					break;
				case "melodicIncipit":
					entrySet.addAll(repo.findByMelodicIncipit(searchText));
					break;
				case "textIncipit":
					entrySet.addAll(repo.findByTextIncipit(searchText));
					break;
				case "isSecular":
					entrySet.addAll(repo.findByIsSecular(searchText));
					break;
			}
		}
		return entrySet;
	}
	
	//updates entry information when user clicks "submit" in editEntry form
	@RequestMapping(value = "/createEntry", params = {"collection", "sourceNumber", "location", "title", "credit", "vocalPart",
													"key", "melodicIncipit", "textIncipit", "isSecular"})
	public ModelAndView createEntry(@RequestParam String collection, @RequestParam int sourceNumber,
							@RequestParam String location, @RequestParam String title, @RequestParam String credit,
							@RequestParam String vocalPart, @RequestParam String key, @RequestParam String melodicIncipit, 
							@RequestParam String textIncipit, @RequestParam String isSecular) {
		//construct/new entry object to database with update information
		Entry entry = new Entry(collection, sourceNumber, location, title, credit, vocalPart, key, melodicIncipit, textIncipit, isSecular);
		repo.save(entry);
		
		//generate page with updated information
		ModelAndView mv = new ModelAndView("createEntrySuccess.html");
		mv.addObject(entry);
		//display page
		return mv;
	}
	
	@RequestMapping(value = "/createEntry", params = {})
	public ModelAndView createEntry() {
		ModelAndView mv = new ModelAndView("createEntry.html");
		return mv;		
	}
	
	@RequestMapping(value = "/deleteEntry", params = {"collection", "sourceNumber", "location", "title", "credit", "vocalPart",
			"key", "melodicIncipit", "textIncipit", "isSecular"})
	public ModelAndView deleteEntry(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
									@RequestParam String location, @RequestParam String title, @RequestParam String credit,
									@RequestParam String vocalPart, @RequestParam String key, @RequestParam String melodicIncipit, 
									@RequestParam String textIncipit, @RequestParam String isSecular) {
		//construct/new entry object to database with update information
		Entry entry =  repo.findById(id).orElse(new Entry());
		repo.delete(entry);		
		//generate page with updated information
		ModelAndView mv = new ModelAndView("editEntry.html");
		entry =  repo.findById(id - 1).orElse(new Entry());			//find previous entry to display after deletion
		mv.addObject(entry);
		//display page
		return mv;
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/entries", params = {"collection", "sourceNumber", "location", "title", "credit", "vocalPart",
			"key", "melodicIncipit", "textIncipit", "isSecular"})
	public Entry delete(@RequestParam int id, @RequestParam String collection, @RequestParam int sourceNumber,
									@RequestParam String location, @RequestParam String title, @RequestParam String credit,
									@RequestParam String vocalPart, @RequestParam String key, @RequestParam String melodicIncipit, 
									@RequestParam String textIncipit, @RequestParam String isSecular) {
		//construct/new entry object to database with update information
		Entry entry =  repo.findById(id).orElse(new Entry());
		repo.delete(entry);	
		return entry;
	}
}
