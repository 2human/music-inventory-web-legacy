package com.toohuman.controller.source;

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
@CrossOrigin(origins = { "http://www.sacredmusicinventory.org", "http://www.sacredmusicinventory.com",
		"http://sacredmusicinventory.com", "http://sacredmusicinventory.org",
		"http://musicinventoryapp.com", "http://www.musicinventoryapp.com"}, maxAge = 3600)
public class SourcesMiscController {
	
	@Autowired
	SourcesRepo repo;	
	
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
	public ModelAndView updateSources(@RequestParam int id, @RequestParam String collection, @RequestParam double sourceNumber,
							@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
							@RequestParam String inscription, @RequestParam String description) {
		Sources sources = new Sources(id, collection, sourceNumber, callNumber, author, title, inscription, description);
		repo.save(sources);
		
		ModelAndView mv = new ModelAndView("editSource.html");
		sources =  repo.findById(id).orElse(new Sources());
		mv.addObject(sources);
		return mv;
	}	

	@RequestMapping(method = RequestMethod.POST, value = "/sources", params = {"collection", "sourceNumber", "callNumber", "author", "title", "inscription", "description"})
	public Sources createSource(@RequestParam String collection, @RequestParam double sourceNumber,
					@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
					@RequestParam String inscription, @RequestParam String description) {
		Sources sources = new Sources(collection, sourceNumber, callNumber, author, title, inscription, description);
		repo.save(sources);
		sources =  repo.findById(sources.getId()).orElse(new Sources());
		System.out.println(sources.getSourceNumber());
		return sources;
		}

	@RequestMapping(method = RequestMethod.PUT, value = "/sources", params = {"id", "collection", "sourceNumber", "callNumber", "author", "title", "inscription", "description"})
	public Sources updateSource(@RequestParam int id, @RequestParam String collection, @RequestParam double sourceNumber,
					@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
					@RequestParam String inscription, @RequestParam String description) {
		Sources sources = new Sources(id, collection, sourceNumber, callNumber, author, title, inscription, description);
		repo.save(sources);
		sources =  repo.findById(id).orElse(new Sources());
		System.out.println("Returning");
		return sources;
		}
	
	
	@RequestMapping(value = "/createSources", params = {"collection", "sourceNumber", "callNumber", "author", "title", "inscription", "description"})
	public ModelAndView createSources(@RequestParam String collection, @RequestParam double sourceNumber,
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
	public ModelAndView deleteSources(@RequestParam int id, @RequestParam String collection, @RequestParam double sourceNumber,
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
	public Sources delete(@RequestParam int id, @RequestParam String collection, @RequestParam double sourceNumber,
							@RequestParam String callNumber, @RequestParam String author, @RequestParam String title,
							@RequestParam String inscription, @RequestParam String description) {
		Sources sources =  repo.findById(id).orElse(new Sources());
		System.out.println(sources.getId());
		repo.delete(sources);
		return sources;
	}

	
}