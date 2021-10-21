package com.toohuman.controller;

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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.toohuman.dao.EntryRepo;
import com.toohuman.model.Entry;

@RestController
@CrossOrigin
public class EntryController {

	@Autowired
	EntryRepo repo;
	
	//get all entries
	@RequestMapping(method = RequestMethod.GET, value="/entries")
	public List<Entry> getAll(){
		return repo.findAll();
	}
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/entries", params = {"searchText", "table"})
	public Set<Entry> search(@RequestParam String searchText, @RequestParam String table) {
		System.out.println("keywordSearch");
		String[] keywords = searchText.split(" ");
		//set that will contain results found
		Set<Entry> resultSet = getInitialResultSet(keywords[0]);	//query database for initial results
		Set<Entry> oldResultSet = new HashSet<Entry>();	
		
		//iterate through each keyword, and filter out results that do not contain keyword
		for(int i = 1; i < keywords.length; i++) {					
			oldResultSet = resultSet;
			resultSet = getFilteredResultSet(keywords[i], oldResultSet);
		}		
		return resultSet;
	}
	
	//get initial result set by querying ALL fields within database
	private Set<Entry> getInitialResultSet(String keyword){
		Set<Entry> resultSet = new HashSet<Entry>();		//search all fields to determine if there are any matches, 
		//adding them to a set so that duplicates are not retained
		try {
			resultSet.add(repo.findById(Integer.parseInt(keyword)).orElse(new Entry()));
			} catch(Exception e) {
				System.out.println("NaN entered as ID");
			}
		resultSet.addAll(repo.findByCollection(keyword));
		try {
			resultSet.addAll(repo.findBySourceNumber(Integer.parseInt(keyword)));
		} catch(Exception e) {
			System.out.println("NaN entered as sourceNumber");
		}
		resultSet.addAll(repo.findByLocation(keyword));
		resultSet.addAll(repo.findByTitle(keyword));
		resultSet.addAll(repo.findByComposer(keyword));
		resultSet.addAll(repo.findByVocalPart(keyword));
		resultSet.addAll(repo.findByKey(keyword));
		resultSet.addAll(repo.findByMelodicIncipit(keyword));
		resultSet.addAll(repo.findByTextIncipit(keyword));
		resultSet.addAll(repo.findByIsSecular(keyword));
		
		return resultSet;
	}
	
	//get filtered result set by filtering existing set, checking all fields
	private Set<Entry> getFilteredResultSet(String keyword, Set<Entry> curResultSet){
		Set <Entry> filteredSet = new HashSet<Entry>();
		//check each current result, adding only those containing current keyword to filtered set
		for(Entry curResult: curResultSet) {
			try {
				if(curResult.getId() == Integer.parseInt(keyword)) filteredSet.add(curResult);
//				resultSet.add(repo.findById(Integer.parseInt(curKeyword)).orElse(new Entry()));
				} catch(Exception e) {
					System.out.println("NaN entered as ID");
				}
			if(curResult.getCollection().indexOf(keyword) != -1) filteredSet.add(curResult);
			try {
				if(curResult.getSourceNumber() == Integer.parseInt(keyword)) filteredSet.add(curResult);
			} catch(Exception e) {
				System.out.println("NaN entered as sourceNumber");
			}
			if(curResult.getLocation().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
			if(curResult.getTitle().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
			if(curResult.getComposer().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
			if(curResult.getVocalPart().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
			if(curResult.getKey().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
			if(curResult.getMelodicIncipit().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
			if(curResult.getTextIncipit().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
			if(curResult.getIsSecular().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
		}
		return filteredSet;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/entries", params = {"searchText", "table", "field"})
	public Set<Entry> keywordSearchWithFields(@RequestParam String searchText, @RequestParam String table, @RequestParam String field) {
		System.out.println("fieldsearch");
		List<String> fields = new ArrayList<String>(Arrays.asList(field.split(",")));
		String[] keywords = searchText.split(" ");
		Set<Entry> resultSet = getInitialResultSet(keywords[0], fields);
		Set<Entry> oldResultSet = new HashSet<Entry>();	
		for(int i = 1; i < keywords.length; i++) {
			oldResultSet = resultSet;
			resultSet = getFilteredResultSet(keywords[i], oldResultSet, fields);			
		}
		return resultSet;		
	}
	
	//get initial result set by querying SELECTED fields within database
	private Set<Entry> getInitialResultSet(String keyword, List<String> fields){
		Set<Entry> resultSet = new HashSet<Entry>();		
		for(String field: fields) {
			switch(field) {
				case "id":			
					try {
						resultSet.add(repo.findById(Integer.parseInt(keyword)).orElse(new Entry()));
						} catch(Exception e) {
							System.out.println("NaN entered as ID");
						}
					break;
				case "collection":
					resultSet.addAll(repo.findByCollection(keyword));
					break;
				case "sourceNumber":
					try {
						resultSet.addAll(repo.findBySourceNumber(Integer.parseInt(keyword)));
					} catch(Exception e) {
						System.out.println("NaN entered as sourceNumber");
					}
					break;
				case "location":
					resultSet.addAll(repo.findByLocation(keyword));
					break;
				case "title":
					resultSet.addAll(repo.findByTitle(keyword));
					break;
				case "composer":
					resultSet.addAll(repo.findByComposer(keyword));
					break;
				case "vocalPart":
					resultSet.addAll(repo.findByVocalPart(keyword));
					break;
				case "key":
					resultSet.addAll(repo.findByKey(keyword));
					break;
				case "melodicIncipit":
					resultSet.addAll(repo.findByMelodicIncipit(keyword));
					break;
				case "textIncipit":
					resultSet.addAll(repo.findByTextIncipit(keyword));
					break;
				case "isSecular":
					resultSet.addAll(repo.findByIsSecular(keyword));
					break;
			}
		}
		return resultSet;
	}	
	
	//get filtered result set by filtering existing set, checking all fields
	private Set<Entry> getFilteredResultSet(String keyword, Set<Entry> curResultSet, List<String> fields){
		Set<Entry> filteredSet = new HashSet<Entry>();
		for(Entry curResult: curResultSet) {
			for(String field: fields) {
				switch(field) {
					case "id":	
						try {
							if(curResult.getId() == Integer.parseInt(keyword)) filteredSet.add(curResult);
		//					resultSet.add(repo.findById(Integer.parseInt(curKeyword)).orElse(new Entry()));
							} catch(Exception e) {
								System.out.println("NaN entered as ID");
							}
						break;
					case "collection":
						if(curResult.getCollection().indexOf(keyword) != -1) filteredSet.add(curResult);
						break;
					case "sourceNumber":
						try {
							if(curResult.getSourceNumber() == Integer.parseInt(keyword)) filteredSet.add(curResult);
						} catch(Exception e) {
							System.out.println("NaN entered as sourceNumber");
						}
						break;
					case "location":
						if(curResult.getLocation().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
						break;
					case "title":
						if(curResult.getTitle().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
						break;
					case "composer":
						if(curResult.getComposer().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
						break;
					case "vocalPart":
						if(curResult.getVocalPart().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
						break;
					case "key":
						if(curResult.getKey().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
						break;
					case "melodicIncipit":
						if(curResult.getMelodicIncipit().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
						break;
					case "textIncipit":
						if(curResult.getTextIncipit().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
						break;
					case "isSecular":
						if(curResult.getIsSecular().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
						break;
				}
			}
		}

		return filteredSet;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/entries", params = {"searchText", "table", "id", "sourceNumber", "location",
			"collection", "title", "composer", "vocalPart", "key", "melodicIncipit", "textIncipit", "isSecular"})
	public Set<Entry> advancedSearch(@RequestParam String searchText, @RequestParam String table, @RequestParam String id,
			@RequestParam String sourceNumber, @RequestParam String location, @RequestParam String collection, @RequestParam String title,
			@RequestParam String composer, @RequestParam String vocalPart, @RequestParam String key, @RequestParam String melodicIncipit,
			@RequestParam String textIncipit, @RequestParam String isSecular) {
		System.out.println("advancedsearch");
		
		Set<Entry> resultSet = getKeywordSearchResultSet(searchText);	//filter first by keywords
		
		resultSet = getAdvancedResultSet(resultSet, id, sourceNumber, location, collection,	//filter by each individual field
				title, composer, vocalPart, key, melodicIncipit, textIncipit, isSecular);

		return resultSet;		
	}
	
	//get results checking only the keywords
	private Set<Entry> getKeywordSearchResultSet(String searchText){
		String[] keywords = searchText.split(" ");				//split so that each keyword is searched individually
		Set<Entry> resultSet = getInitialResultSet(keywords[0]);//construct initial results from searching database with first keyword
		Set<Entry> oldResultSet = new HashSet<Entry>();			//placeholder set
		for(int i = 1; i < keywords.length; i++) {				//starting at second keyword, filter by each keyword
			oldResultSet = resultSet;
			resultSet = getFilteredResultSet(keywords[i], oldResultSet);	//filter results by current keyword			
		}		
		return resultSet;
	}
	
	//get results by checking each field in advanced search
	private Set<Entry> getAdvancedResultSet(Set<Entry> resultSet, String id, String sourceNumber, String location, String collection,
			String title, String credit, String vocalPart, String key, String melodicIncipit, String textIncipit, String isSecular){
		
		if(id.length() > 0) resultSet = getFilteredByIdSet(id, resultSet);
		if(collection.length() > 0) resultSet = getFilteredByCollectionSet(collection, resultSet);
		if(sourceNumber.length() > 0) resultSet = getFilteredBySourceNumberSet(sourceNumber, resultSet);
		if(location.length() > 0) resultSet = getFilteredByLocationSet(location, resultSet);
		if(title.length() > 0) resultSet = getFilteredByTitleSet(title, resultSet);
		if(credit.length() > 0) resultSet = getFilteredByComposerSet(credit, resultSet);
		if(vocalPart.length() > 0) resultSet = getFilteredByVocalPartSet(vocalPart, resultSet);
		if(key.length() > 0) resultSet = getFilteredByKeySet(key, resultSet);
		if(melodicIncipit.length() > 0) resultSet = getFilteredByMelodicIncipitSet(melodicIncipit, resultSet);
		if(textIncipit.length() > 0) resultSet = getFilteredByTextIncipitSet(textIncipit, resultSet);
		if(isSecular.length() > 0) resultSet = getFilteredByIsSecularSet(isSecular, resultSet);
		
		return resultSet;	
	}	
	
	private Set<Entry> getFilteredByIdSet(String id, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			try {
				if(result.getId() == Integer.parseInt(id)) workingSet.add(result);
//				resultSet.add(repo.findById(Integer.parseInt(curKeyword)).orElse(new Entry()));
			} catch(Exception e) {
//				System.out.println("NaN entered as ID");
			}			
		}
		return workingSet;
	}
	
	private Set<Entry> getFilteredByCollectionSet(String collection, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getCollection().toLowerCase().indexOf(collection.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Entry> getFilteredBySourceNumberSet(String sourceNumber, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {			
			try {
				if(result.getSourceNumber() == Integer.parseInt(sourceNumber)) workingSet.add(result);
			} catch(Exception e) {
	//			System.out.println("NaN entered as sourceNumber");
			}			
		}
		return workingSet;		
	}
	
	private Set<Entry> getFilteredByLocationSet(String location, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getLocation().toLowerCase().indexOf(location.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Entry> getFilteredByTitleSet(String title, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		System.out.println(title);
		for(Entry result: resultSet) {
			if(result.getTitle().toLowerCase().indexOf(title.toLowerCase()) != -1) workingSet.add(result);			
		}
		System.out.println(workingSet.size());
		return workingSet;		
	}
	
	private Set<Entry> getFilteredByComposerSet(String credit, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getComposer().toLowerCase().indexOf(credit.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Entry> getFilteredByVocalPartSet(String vocalPart, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getVocalPart().toLowerCase().indexOf(vocalPart.toLowerCase()) != -1) workingSet.add(result);		
		}
		return workingSet;		
	}
	
	private Set<Entry> getFilteredByKeySet(String key, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getKey().toLowerCase().indexOf(key.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Entry> getFilteredByMelodicIncipitSet(String melodicIncipit, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getMelodicIncipit().toLowerCase().indexOf(melodicIncipit.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	
	private Set<Entry> getFilteredByTextIncipitSet(String textIncipit, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getTextIncipit().toLowerCase().indexOf(textIncipit.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	private Set<Entry> getFilteredByIsSecularSet(String isSecular, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getIsSecular().toLowerCase().indexOf(isSecular.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
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
		
}
