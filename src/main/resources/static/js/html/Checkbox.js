

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
            <b>Field(s): </b>
            <input class="form__checkbox" type="checkbox" name="field" id="id" value="id"><label for="id"> ID</label>
            <input class="form__checkbox" type="checkbox" name="field" id="collection" value="collection"><label for="id"> Collection</label>
            <input class="form__checkbox" type="checkbox" name="field" id="sourceNumber" value="sourceNumber"><label for="sourceNumber"> Source Number</label>
            <input class="form__checkbox" type="checkbox" name="field" id="callNumber" value="callNumber"><label for="callNumber"> Call Number</label>
            <input class="form__checkbox" type="checkbox" name="field" id="author" value="author"><label for="author"> Author</label>
            <input class="form__checkbox" type="checkbox" name="field" id="title" value="title"><label for="title"> Title</label>
            <input class="form__checkbox" type="checkbox" name="field" id="inscription" value="inscription"><label for="inscription"> Inscription</label>
            <input class="form__checkbox" type="checkbox" name="field" id="description" value="description"><label for="description"> Description </label>
                `;
}

function getEntryFieldsCheckboxesHTML(){  
    return `
            <span class="u-text-top"><b>Field(s): </b></span>
            <div class="form__checkbox-group">
                <input class="form__checkbox" type="checkbox" name="field" id="id" value="id"><label for="id"> ID</label>
                <input class="form__checkbox" type="checkbox" name="field" id="collection" value="collection"><label for="collection"> Collection</label>
                <input class="form__checkbox" type="checkbox" name="field" id="sourceNumber" value="sourceNumber"><label for="sourceNumber"> Source Number</label>
                <input class="form__checkbox" type="checkbox" name="field" id="location" value="location"><label for="location"> Location</label>
                <input class="form__checkbox" type="checkbox" name="field" id="title" value="title"><label for="title"> Title</label>
                <input class="form__checkbox" type="checkbox" name="field" id="composer" value="composer"><label for="composer"> Composer</label> <br>
                <input class="form__checkbox" type="checkbox" name="field" id="vocalPart" value="vocalPart"><label for="vocalPart"> Vocal Part</label>
                <input class="form__checkbox" type="checkbox" name="field" id="key" value="key"><label for="key"> Key</label>
                <input class="form__checkbox" type="checkbox" name="field" id="melodicIncipit" value="melodicIncipit"><label for="melodicIncipit"> Melodic Incipit</label>
                <input class="form__checkbox" type="checkbox" name="field" id="textIncipit" value="textIncipit"><label for="textIncipit"> Text Incipit</label>
                <input class="form__checkbox" type="checkbox" name="field" id="isSecular" value="isSecular"><label for="isSecular"> Secular</label>
                <input class="form__checkbox" type="checkbox" name="field" id="notes" value="notes"><label for="notes"> Notes</label>
            </div>
                    `;
}

function getCollectionFieldsCheckboxesHTML(){    
    return `
                <b>Field(s): </b>
                <input class="form__checkbox" type="checkbox" name="field" id="id" value="id"><label for="id"> ID</label>
                <input class="form__checkbox" type="checkbox" name="field" id="collection" value="collection"><label for="collection"> Collection</label>
                <input class="form__checkbox" type="checkbox" name="field" id="description" value="description"><label for="description"> Description</label>
                    `;
}