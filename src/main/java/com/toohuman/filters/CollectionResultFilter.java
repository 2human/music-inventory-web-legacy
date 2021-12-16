package com.toohuman.filters;

import java.util.HashSet;
import java.util.Set;

import com.toohuman.model.Collection;

public class CollectionResultFilter {
	
	public static Set<Collection> getFilteredByIdSet(String id, Set<Collection> resultSet){
		Set<Collection> workingSet = new HashSet<Collection>();
		for(Collection result: resultSet) {
			try {
				if(result.getId() == Integer.parseInt(id)) workingSet.add(result);
//					resultSet.add(repo.findById(Integer.parseInt(curKeyword)).orElse(new Entry()));
			} catch(Exception e) {
//					System.out.println("NaN entered as ID");
			}			
		}
		return workingSet;
	}
	
	public static Set<Collection> getFilteredByCollectionSet(String collection, Set<Collection> resultSet){
		Set<Collection> workingSet = new HashSet<Collection>();
		for(Collection result: resultSet) {
			if(result.getCollection().toLowerCase().indexOf(collection.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}
	
	public static Set<Collection> getFilteredByDescriptionSet(String description, Set<Collection> resultSet){
		Set<Collection> workingSet = new HashSet<Collection>();
		for(Collection result: resultSet) {
			if(result.getDescription().toLowerCase().indexOf(description.toLowerCase()) != -1) workingSet.add(result);			
		}
		return workingSet;		
	}	
	
	//get filtered result set by filtering existing set, checking all fields
	public static Set<Collection> getFilteredResultSet(String keyword, Set<Collection> curResultSet){
		Set<Collection> workingSet = new HashSet<Collection>();
		//check each current result, adding only those containing current keyword to filtered set
		for(Collection curResult: curResultSet) {
			try {
				if(curResult.getId() == Integer.parseInt(keyword)) workingSet.add(curResult);
//				resultSet.add(repo.findById(Integer.parseInt(curKeyword)).orElse(new Entry()));
				} catch(Exception e) {
//					System.out.println("NaN entered as ID");
				}
			if(curResult.getCollection().indexOf(keyword) != -1) workingSet.add(curResult);
			if(curResult.getDescription().toLowerCase().indexOf(keyword.toLowerCase()) != -1) workingSet.add(curResult);
		}
		return workingSet;
	}		
		

}
