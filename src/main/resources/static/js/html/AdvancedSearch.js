/**
 * 
 * @param {*} dataType Data type corresponding to selected table.
 * @returns HTML form containing additional search fields.
 */
export function getAdvancedSearchHTML(dataType){
    switch(dataType){
        case "sources":
            return getAdvancedSearchHTMLSources();
        case "entries":
            return getAdvancedSearchHTMLEntries();      
        case "collections":
            return getAdvancedSearchHTMLCollections();      
    }
}

function getAdvancedSearchHTMLEntries(){
    return `
    <div class="advanced-search__row">
        <div class="advanced-search__group">
            <input type="text" id="id" name="id" class="form__input form__input--short advanced-search__input" placeholder="Id">
            <label class="advanced-search__label" for="Id">Id</label>
        </div>

        <div class="advanced-search__group">
            <input type="text" id="sourceNumber" name="sourceNumber" class="form__input form__input--short advanced-search__input" placeholder="Source Number">
            <label class="advanced-search__label" for="sourceNumber">Source Number</label>
        </div>

        <div class="advanced-search__group">
            <input type="text" id="location" name="location" class="form__input form__input--short advanced-search__input" placeholder="Location">
            <label class="advanced-search__label" for="location">Location</label>
        </div>

        <div class="advanced-search__group">
            <select id="isSecular" name="isSecular" class="form__select form__input--short advanced-search__select" placeholder=""> 
                <option value=""></option>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
            <label class="advanced-search__label" for="isSecular">Secular?</label>
        </div>
    </div>
    
    <div class="advanced-search__row">
        <div class="advanced-search__group">          
            <input type="text" id="collection" name="collection" class="form__input form__input--long advanced-search__input" placeholder="Collection">
            <label class="advanced-search__label" for="collection">Collection</label>
        </div>
        
        <div class="advanced-search__group">
            <input type="text" id="title" name="title" class="form__input form__input--long advanced-search__input" placeholder="Title">
            <label class="advanced-search__label" for="title">Title</label>
        </div>
    </div>
        
    <div class="advanced-search__row">
        <div class="advanced-search__group">        
            <input type="text" id="composer"  name="composer" class="form__input form__input--long advanced-search__input" placeholder="Composer">
            <label class="advanced-search__label" for="composer">Composer</label>
        </div>

        <div class="advanced-search__group">
            <input type="text" id="vocalPart" name="vocalPart" class="form__input form__input--long advanced-search__input" placeholder="Vocal Part">
            <label class="advanced-search__label" for="vocalPart">Vocal Part</label>
        </div>
    </div>
        
    <div class="advanced-search__row">
        <div class="advanced-search__group">       
            <input type="text" id="key" name="key" class="form__input form__input--long advanced-search__input" placeholder="Key">
            <label class="advanced-search__label" for="key">Key</label>
        </div>

        <div class="advanced-search__group">
            <input type="text" id="melodicIncipit" name="melodicIncipit" class="form__input form__input--long advanced-search__input" placeholder="Melodic Incipit">
            <label class="advanced-search__label u-inline-block" for="melodicIncipit">Melodic Incipit</label>
            <span class="advanced-search__pitches-only">
                Pitches Only<a href="javascriptvoid(0)">(?)</a>:  
                <input type="hidden" name="pitchesOnly" value="">  
                <input type="checkbox" id="pitchesOnly" name="pitchesOnly" value="true">
            </span>
        </div>
    </div>
            
    <div class="advanced-search__row">
        <div class="advanced-search__group">    
            <input type="text" id="textIncipit" name="textIncipit" class="form__input form__input--long advanced-search__input" placeholder="Text Incipit">
            <label class="advanced-search__label" for="textIncipit">Text Incipit</label>
        </div>

        <div class="advanced-search__group">
            <input type="text" id="notes" name="notes" class="form__input form__input--long advanced-search__input" placeholder="Notes">
            <label class="advanced-search__label" for="notes">Notes</label>
        </div>
    </div>
            `;
}

function getAdvancedSearchHTMLSources(){
    return `
    <div class="advanced-search__row">
        <div class="advanced-search__group">
            <input type="text" id="id" name="id" class="form__input form__input--short advanced-search__input" placeholder="Id">
            <label class="advanced-search__label" for="id">Id</label>
        </div>


        <div class="advanced-search__group">
            <input type="text" id="sourceNumber" name="sourceNumber" class="form__input form__input--short advanced-search__input" placeholder="Source Number">
            <label class="advanced-search__label" for="sourceNumber">Source Number</label>
        </div>
    </div>

    <div class="advanced-search__row">
        <div class="advanced-search__group">
            <input type="text" id="collection" name="collection" class="form__input form__input--long advanced-search__input" placeholder="Collection">
            <label class="advanced-search__label" for="collection">Collection</label>
        </div>

        <div class="advanced-search__group">
            <input type="text" id="callNumber" name="callNumber" class="form__input form__input--long advanced-search__input" placeholder="Call Number">
            <label class="advanced-search__label" for="callNumber">Call Number</label>
        </div>
    </div>

    <div class="advanced-search__row">    
        <div class="advanced-search__group">
            <input type="text" id="author"  name="author" class="form__input form__input--long advanced-search__input" placeholder="Author">
            <label class="advanced-search__label" for="author">Author</label>
        </div>
        
        <div class="advanced-search__group">
            <input type="text" id="title" name="title" class="form__input form__input--long advanced-search__input" placeholder="Title">
            <label class="advanced-search__label" for="title">Title</label>
        </div>
    </div>

    <div class="advanced-search__row">
        <div class="advanced-search__group">
            <input type="text" id="inscription" name="inscription" class="form__input form__input--long advanced-search__input" placeholder="Inscription">
            <label class="advanced-search__label" for="inscription">Inscription</label>
        </div>

        <div class="advanced-search__group">
            <input type="text" id="description" name="description" class="form__input form__input--long advanced-search__input" placeholder="Description">
            <label class="advanced-search__label" for="description">Description</label>
        </div>
    </div>
            
            `;
}

function getAdvancedSearchHTMLCollections(){
    return `
            
        <div class="advanced-search__row">
            <div class="advanced-search__group">
                <input type="text" id="id" name="id" placeholder="Id" class="form__input form__input--short advanced-search__input">
                <label class="advanced-search__label" for="Id">Id</label>
            </div>
        </div>
            
        <div class="advanced-search__row">
            <div class="advanced-search__group">
                <input type="text" id="collection" name="collection" placeholder="Collection" class="form__input form__input--long advanced-search__input">
                <label class="advanced-search__label" for="collection">Collection</label>
            </div>
        </div>
            
        <div class="advanced-search__row">
            <div class="advanced-search__group">
                <input type="text" id="description" name="description" placeholder="Description" class="form__input form__input--long advanced-search__input">
                <label class="advanced-search__label" for="description">Description:</label>
            </div>
        </div>            
            `;
}