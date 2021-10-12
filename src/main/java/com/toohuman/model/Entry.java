package com.toohuman.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="entries")
public class Entry {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entry_id", nullable = false, unique = true)
	private int id;
	@Column(name="collection_name")
	private String collection;
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
	@Column(name="entry_text_incipit")
	private String textIncipit;
	@Column(name="entry_is_secular")
	private String isSecular;
	
	private static final String[] FIELD_LIST = {"id", "collection", "sourceNumber", "location", "title", "credit",
                                                "vocalPart", "key", "melodicIncipit", "textIncipit", "isSecular"};
	
	public Entry() {
		
	}

	
	
	public Entry(int id, String collection, int sourceNumber, String location, String title, String credit,
			String vocalPart, String key, String melodicIncipit, String textIncipit, String isSecular) {
		this.id = id;
		this.collection = collection;
		this.sourceNumber = sourceNumber;
		this.location = location;
		this.title = title;
		this.credit = credit;
		this.vocalPart = vocalPart;
		this.key = key;
		this.melodicIncipit = melodicIncipit;
		this.textIncipit = textIncipit;
		this.isSecular = isSecular;
	}

	public Entry(String collection, int sourceNumber, String location, String title, String credit,
			String vocalPart, String key, String melodicIncipit, String textIncipit, String isSecular) {
		this.collection = collection;
		this.sourceNumber = sourceNumber;
		this.location = location;
		this.title = title;
		this.credit = credit;
		this.vocalPart = vocalPart;
		this.key = key;
		this.melodicIncipit = melodicIncipit;
		this.textIncipit = textIncipit;
		this.isSecular = isSecular;
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
	public String getTextIncipit() {
		return textIncipit;
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
	
	public String[] getFieldList() {
		return FIELD_LIST;
	}



	@Override
	public String toString() {
		return "Entry [id=" + id + ", collection=" + collection + ", sourceNumber=" + sourceNumber + ", location="
				+ location + ", title=" + title + ", credit=" + credit + ", vocalPart=" + vocalPart + ", key=" + key
				+ ", melodicIncipit=" + melodicIncipit + ", textIncipit=" + textIncipit + ", isSecular=" + isSecular
				+ "]";
	}	

	
	
}
