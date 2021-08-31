package com.toohuman.musicentriesweb.controller;

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

import com.toohuman.musicentriesweb.dao.SourcesRepo;
import com.toohuman.musicentriesweb.model.Sources;

//TODO change it so that source number does not stay the same in creating new sources
//TODO learn difference between post and put request, and add to all controllers
@RestController
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
	public Set<Sources> search(@RequestParam String searchText, @RequestParam String table) {
		
		Set<Sources> sourceSet = new HashSet<Sources>();
		switch(table) {
		case "sources":
			try {
				sourceSet.add(repo.findById(Integer.parseInt(searchText)).orElse(new Sources()));
				} catch(Exception e) {
					System.out.println("NaN entered as ID");
				}
				sourceSet.addAll(repo.findByCollection(searchText));
				try {
					sourceSet.addAll(repo.findBySourceNumber(Integer.parseInt(searchText)));
				} catch(Exception e) {
					System.out.println("NaN entered as sourceNumber");
				}
				sourceSet.addAll(repo.findByCallNumber(searchText));
				sourceSet.addAll(repo.findByAuthor(searchText));
				sourceSet.addAll(repo.findByTitle(searchText));
				sourceSet.addAll(repo.findByInscription(searchText));
				sourceSet.addAll(repo.findByDescription(searchText));			
		}
		return sourceSet;
	}
	
	//get request for sources
	@RequestMapping(method = RequestMethod.GET, value = "/sources", params = {"searchText", "table", "field"})
	public Set<Sources> search(@RequestParam String searchText, @RequestParam String table, @RequestParam String field) {
		List<String> fields = new ArrayList<String>(Arrays.asList(field.split(",")));
		Set<Sources> sourceSet = new HashSet<Sources>();
		System.out.println(field);
			for(String f: fields) {
				switch(f) {
					case "id":
						//TODO make it so this does not return a null source object when integer input
						try {
						sourceSet.add(repo.findById(Integer.parseInt(searchText)).orElse(new Sources()));
						} catch(Exception e) {
							System.out.println("NaN entered as ID");
						}
						break;
					case "collection":
						System.out.println("Run 2");
						sourceSet.addAll(repo.findByCollection(searchText));
						break;
					case "sourceNumber":
						try {
							sourceSet.addAll(repo.findBySourceNumber(Integer.parseInt(searchText)));
						} catch(Exception e) {
							System.out.println("NaN entered as sourceNumber");
						}
						break;
					case "callNumber":
						sourceSet.addAll(repo.findByCallNumber(searchText));
						break;
					case "author":
						sourceSet.addAll(repo.findByAuthor(searchText));
						break;
					case "title":
						sourceSet.addAll(repo.findByTitle(searchText));
						break;
					case "inscription":
						sourceSet.addAll(repo.findByInscription(searchText));
						break;
					case "description":
						sourceSet.addAll(repo.findByDescription(searchText));
						break;
			}				
		}
		return sourceSet;
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
