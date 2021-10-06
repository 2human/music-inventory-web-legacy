CREATE TABLE IF NOT EXISTS sources(
  source_id INT NOT NULL AUTO_INCREMENT, 
  collection_name TEXT NOT NULL,
  source_number TEXT NOT NULL,
  source_call_number TEXT NOT NULL,
  source_author TEXT NOT NULL,
  source_title TEXT NOT NULL,
  source_inscription TEXT NOT NULL,
  source_description TEXT NOT NULL, 
  PRIMARY KEY (source_id)		
);

CREATE TABLE IF NOT EXISTS entries(
  entry_id INT NOT NULL AUTO_INCREMENT,
  collection_name TEXT NOT NULL,
  source_number TEXT NOT NULL,
  entry_location TEXT NOT NULL,
  entry_title TEXT NOT NULL,
  entry_credit TEXT NOT NULL,
  entry_vocal_part TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  entry_melodic_incipit TEXT NOT NULL,
  entry_text_incipit TEXT NOT NULL,
  entry_is_secular TEXT NOT NULL,
  PRIMARY KEY (entry_id)
);

CREATE TABLE IF NOT EXISTS collections(
  collection_id INT NOT NULL AUTO_INCREMENT,
  collection_name TEXT NOT NULL,
  collection_description TEXT NOT NULL,
  PRIMARY KEY (collection_id)
);