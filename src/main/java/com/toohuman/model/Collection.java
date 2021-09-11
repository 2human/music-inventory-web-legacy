package com.toohuman.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="collections")
public class Collection {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collection_id", nullable = false, unique = true)
	private int id;
	@Column(name="collection_name")
	private String collection;
	@Column(name="collection_description")
	private String description;
	
	public Collection() {		
	}
	
	public Collection(int id, String collection, String description) {
		super();
		this.id = id;
		this.collection = collection;
		this.description = description;
	}

	//constructor with no id as parameter for creating new entry in database
	public Collection(String collection, String description) {
		super();
		this.collection = collection;
		this.description = description;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCollection() {
		return collection;
	}

	public void setCollection(String collection) {
		this.collection = collection;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String toString() {
		return "Collection [id=" + id + ", collection=" + collection + ", description=" + description + "]";
	}	
}
