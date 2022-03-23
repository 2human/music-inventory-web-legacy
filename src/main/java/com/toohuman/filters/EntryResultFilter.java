package com.toohuman.filters;

import java.util.HashSet;
import java.util.Set;

import com.toohuman.model.Entry;

public class EntryResultFilter {
	
	public static Set<Entry> getFilteredByIdSet(String id, Set<Entry> resultSet){
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
	
	public static Set<Entry> getFilteredByCollectionSet(String collection, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getCollection().toLowerCase().indexOf(collection.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Entry> getFilteredBySourceNumberSet(String sourceNumber, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {			
			try {
				double srcNumDbl = Double.parseDouble(sourceNumber);
				//if whole number, look for all numbers containing whole number, including with decimals
				if(isWholeNumber(srcNumDbl)) {
					if(Math.floor(result.getSourceNumber()) == srcNumDbl) workingSet.add(result);
				}
				//otherwise look for exact match
				else {
					if(result.getSourceNumber() == srcNumDbl) workingSet.add(result);					
				}
			} catch(Exception e) {
	//			System.out.println("NaN entered as sourceNumber");
			}			
		}
		return workingSet;		
	}
	
	private static boolean isWholeNumber(Double number) {
		return number == Math.floor(number);
	}
	
	public static Set<Entry> getFilteredByLocationSet(String location, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getLocation().toLowerCase().indexOf(location.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Entry> getFilteredByTitleSet(String title, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		System.out.println(title);
		for(Entry result: resultSet) {
			if(result.getTitle().toLowerCase().indexOf(title.toLowerCase()) != -1) workingSet.add(result);			
		}
		System.out.println(workingSet.size());
		return workingSet;		
	}
	
	public static Set<Entry> getFilteredByComposerSet(String composer, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getComposer().toLowerCase().indexOf(composer.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Entry> getFilteredByVocalPartSet(String vocalPart, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getVocalPart().toLowerCase().indexOf(vocalPart.toLowerCase()) != -1) workingSet.add(result);		
		}
		return workingSet;		
	}
	
	public static Set<Entry> getFilteredByKeySet(String key, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getKey().toLowerCase().indexOf(key.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Entry> getFilteredByMelodicIncipitSet(String melodicIncipit, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getMelodicIncipit().toLowerCase().indexOf(melodicIncipit.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	//perform notes only melodic incipit search
	public static Set<Entry> getFilteredByMelodicIncipitSetPitchesOnly(String melodicIncipit, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			//remove non-digits from both search string as well as result string to determine if digits match
			if(result.getMelodicIncipit().replaceAll("\\D","").indexOf(melodicIncipit.replaceAll("\\D","")) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	
	public static Set<Entry> getFilteredByTextIncipitSet(String textIncipit, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getTextIncipit().toLowerCase().indexOf(textIncipit.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Entry> getFilteredByIsSecularSet(String isSecular, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getIsSecular().toLowerCase().indexOf(isSecular.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}	
	
	public static Set<Entry> getFilteredByNotesSet(String notes, Set<Entry> resultSet){
		Set<Entry> workingSet = new HashSet<Entry>();
		for(Entry result: resultSet) {
			if(result.getNotes().toLowerCase().indexOf(notes.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	//get filtered result set by filtering existing set, checking all fields
	public static Set<Entry> getFilteredResultSet(String keyword, Set<Entry> curResultSet){
		Set <Entry> filteredSet = new HashSet<Entry>();
		//check each current result, adding only those containing current keyword to filtered set
		for(Entry curResult: curResultSet) {
			try {
				double keywordToDbl = Double.parseDouble(keyword);
				//if whole number, look for all numbers containing whole number, including with decimals
				if(isWholeNumber(keywordToDbl)) {
					if(Math.floor(curResult.getSourceNumber()) == keywordToDbl) filteredSet.add(curResult);
				}
				//otherwise look for exact match
				else {
					if(curResult.getSourceNumber() == keywordToDbl) filteredSet.add(curResult);					
				}
				} catch(Exception e) {
					System.out.println("NaN entered as ID");
				}
			if(curResult.getCollection().indexOf(keyword) != -1) filteredSet.add(curResult);
			try {
				if(curResult.getSourceNumber() == Double.parseDouble(keyword)) filteredSet.add(curResult);
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
			if(curResult.getNotes().toLowerCase().indexOf(keyword.toLowerCase()) != -1) filteredSet.add(curResult);
		}
		return filteredSet;
	}

}
