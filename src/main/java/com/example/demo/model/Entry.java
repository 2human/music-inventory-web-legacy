package com.example.demo.model;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

public class Entry {
	
	@Id
	@GeneratedValue
	@Column(name="entry_id")
	private int id;
	@Column(name="collection_name")
	private String collectionName;
	@Column(name="source_number")
	private int sourceNumber;
	@Column(name="entry_location")
	private String location;
	@Column(name="entry_title")
	private String title;
	@Column(name="entry_credit")
	private String credit;
	@Column(name="entry_vocal_part")
	private String vocalPart;
	@Column(name="entry_key")
	private String key;
	@Column(name="entry_melodic_incipit")
	private String melodicIncipit;
	@Column(name="entry_is_secular")
	private String isSecular;
	
	public Entry() {
		
	}

	
	
	public Entry(int id, String collectionName, int sourceNumber, String location, String title, String credit,
			String vocalPart, String key, String melodicIncipit, String isSecular) {
		this.id = id;
		this.collectionName = collectionName;
		this.sourceNumber = sourceNumber;
		this.location = location;
		this.title = title;
		this.credit = credit;
		this.vocalPart = vocalPart;
		this.key = key;
		this.melodicIncipit = melodicIncipit;
		this.isSecular = isSecular;
	}



	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getCollectionName() {
		return collectionName;
	}
	public void setCollectionName(String collectionName) {
		this.collectionName = collectionName;
	}
	public int getSourceNumber() {
		return sourceNumber;
	}
	public void setSourceNumber(int sourceNumber) {
		this.sourceNumber = sourceNumber;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getCredit() {
		return credit;
	}
	public void setCredit(String credit) {
		this.credit = credit;
	}
	public String getVocalPart() {
		return vocalPart;
	}
	public void setVocalPart(String vocalPart) {
		this.vocalPart = vocalPart;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getMelodicIncipit() {
		return melodicIncipit;
	}
	public void setMelodicIncipit(String melodicIncipit) {
		this.melodicIncipit = melodicIncipit;
	}
	public String getIsSecular() {
		return isSecular;
	}
	public void setIsSecular(String isSecular) {
		this.isSecular = isSecular;
	}	
	@Override
	public String toString() {
		return "Entry [id=" + id + ", collectionName=" + collectionName + ", sourceNumber=" + sourceNumber
				+ ", location=" + location + ", title=" + title + ", credit=" + credit + ", vocalPart=" + vocalPart
				+ ", key=" + key + ", melodicIncipit=" + melodicIncipit + ", isSecular=" + isSecular + "]";
	}
	
	
}
