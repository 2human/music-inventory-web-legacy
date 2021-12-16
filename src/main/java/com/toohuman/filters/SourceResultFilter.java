package com.toohuman.filters;

import java.util.HashSet;
import java.util.Set;

import com.toohuman.model.Sources;

public class SourceResultFilter {
	
	
	public static Set<Sources> getFilteredByIdSet(String id, Set<Sources> resultSet){
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
	
	public static Set<Sources> getFilteredByCollectionSet(String collection, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getCollection().toLowerCase().indexOf(collection.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Sources> getFilteredBySourceNumberSet(String sourceNumber, Set<Sources> resultSet){
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
	
	public static Set<Sources> getFilteredByCallNumberSet(String callNumber, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getCallNumber().toLowerCase().indexOf(callNumber) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Sources> getFilteredByAuthorSet(String author, Set<Sources> resultSet){
		System.out.println(resultSet.size());
		Set<Sources> workingSet = new HashSet<Sources>();
		
		for(Sources result: resultSet) {
			if(result.getAuthor().toLowerCase().indexOf(author.toLowerCase()) != -1) workingSet.add(result);			
		}		System.out.println(workingSet.size());
		return workingSet;		
	}
	
	public static Set<Sources> getFilteredByTitleSet(String title, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getTitle().toLowerCase().indexOf(title.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Sources> getFilteredByInscriptionSet(String inscription, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getInscription().toLowerCase().indexOf(inscription.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Sources> getFilteredByDescriptionSet(String description, Set<Sources> resultSet){
		Set<Sources> workingSet = new HashSet<Sources>();
		for(Sources result: resultSet) {
			if(result.getDescription().toLowerCase().indexOf(description.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}	
	
	//get filtered result set by filtering existing set that came from query, checking all fields
	public static Set<Sources> getFilteredByKeywordSet(String keyword, Set<Sources> curResultSet){
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

}
