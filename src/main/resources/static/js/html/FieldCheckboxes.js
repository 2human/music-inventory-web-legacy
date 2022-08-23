

/**
 * 
 * @param {*} tableSelection Table surrently selected
 * @returns Checkboxes corresponding to fields within selected table.
 */
export function getFieldCheckboxesHTML(tableSelection){
    //generate fields corresponding to those within sources table 
    switch(tableSelection){
        //source radio button clicked
        case "sources":
            return getSourceFieldsCheckboxesHMTML();
        //entries radio button clicked
        case "entries": 
            return getEntryFieldsCheckboxesHTML();
        case "collections": 
            return getCollectionFieldsCheckboxesHTML();
    }
}

function getSourceFieldsCheckboxesHMTML(){
    return `
            <span class="u-text-top"><b>Field(s): </b></span>
            <div class="form__checkbox-section">
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="id" value="id">
                    <label for="id" class="form__label--field-select"> ID</label>                    
                </div>

                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="collection" value="collection">
                    <label for="collection" class="form__label--field-select"> Collection</label>
                </div>
                    
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="sourceNumber" value="sourceNumber">
                    <label for="sourceNumber" class="form__label--field-select"> Source Number</label>
                </div>
                    
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="callNumber" value="callNumber">
                    <label for="callNumber" class="form__label--field-select"> Call Number</label>
                </div>
                    
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="author" value="author">
                    <label for="author" class="form__label--field-select"> Author</label>
                </div>
                    
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="title" value="title">
                    <label for="title" class="form__label--field-select"> Title</label>
                </div>
                    
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="inscription" value="inscription">
                    <label for="inscription" class="form__label--field-select"> Inscriptions</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="description" value="description">
                    <label for="description" class="form__label--field-select"> Description </label>
                </div>

            </div>
            `;
}

function getEntryFieldsCheckboxesHTML(){  
    return `
            <span class="u-text-top"><b>Field(s): </b></span>
            <div class="form__checkbox-section">
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="id" value="id">
                    <label for="id" class="form__label--field-select"> ID</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="collection" value="collection">
                    <label for="collection" class="form__label--field-select"> Collection</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="sourceNumber" value="sourceNumber">
                    <label for="sourceNumber" class="form__label--field-select"> Source Number</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="location" value="location">
                    <label for="location" class="form__label--field-select"> Location</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="title" value="title">
                    <label for="title" class="form__label--field-select"> Title</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="composer" value="composer">
                    <label for="composer" class="form__label--field-select"> Composer</label>                     
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="vocalPart" value="vocalPart">
                    <label for="vocalPart" class="form__label--field-select"> Vocal Part</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="key" value="key">
                    <label for="key" class="form__label--field-select"> Key</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="melodicIncipit" value="melodicIncipit">
                    <label for="melodicIncipit" class="form__label--field-select"> Melodic Incipit</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="textIncipit" value="textIncipit">
                    <label for="textIncipit" class="form__label--field-select"> Text Incipit</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="isSecular" value="isSecular">
                    <label for="isSecular" class="form__label--field-select"> Secular</label>
                </div>
                           
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="notes" value="notes">
                    <label for="notes" class="form__label--field-select"> Notes</label>                    
                </div>

            </div>
                    `;
}

function getCollectionFieldsCheckboxesHTML(){    
    return `
            <span class="u-text-top"><b>Field(s): </b></span>
            <div class="form__checkbox-section">
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="id" value="id">
                    <label for="id" class="form__label--field-select"> ID</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="collection" value="collection">
                    <label for="collection" class="form__label--field-select"> Collection</label>
                </div>
                
                <div class="form__checkbox-group">
                    <input class="form__checkbox" type="checkbox" name="field" id="description" value="description">
                    <label for="description" class="form__label--field-select"> Description</label>
                </div>
            </div>
                `;
}