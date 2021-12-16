/**
 * 
 * @param {*} dataType Data type corresponding to selected table.
 * @param {*} data Single table row of data to populate form
 * @returns Form containing table row of data for modal.
 */
 export function getModalFormHTML(dataType, data){    
    switch(dataType){
        case "entries":
            return getEntryFormHTML(data);
        case "sources":
            return getSourceFormHTML(data);
        case "collections":
            return getCollectionFormHTML(data);
    }
}

//create form that pre-fills data from table row
function getEntryFormHTML(entry){
    return `<label for="ID" class="form__label">ID:</label>` +
            `<input type="text" id="id" class="form__input form__input--extra-long" name="id" value="${entry.id}" readonly><br>` +

            `<label for="collection" class="form__label">Collection:</label>` +
            `<input type="text" id="collection" class="form__input form__input--extra-long" name="collection" value="${entry.collection}" onfocus="this.select()"><br>` +

            `<label for="sourceNumber" class="form__label">Source Number:</label>` +
            `<input type="text" id="sourceNumber" class="form__input form__input--extra-long" name="sourceNumber" value="${entry.sourceNumber}" onfocus="this.select()"><br>` +
            
            `<label for="location" class="form__label">Location:</label>` +
            `<input type="text" id="location" class="form__input form__input--extra-long" name="location" value="${entry.location}" onfocus="this.select()"><br>` +

            `<label for="title" class="form__label">Title:</label>` +
            `<input type="text" id="title" class="form__input form__input--extra-long" name="title" value="${entry.title}" onfocus="this.select()"><br>` +

            `<label for="composer" class="form__label">Composer:</label>` +
            `<input type="text" id="composer" class="form__input form__input--extra-long" name="composer" value="${entry.composer}" onfocus="this.select()"><br>` +

            `<label for="vocalPart" class="form__label">Vocal Part:</label>` +
            `<input type="text" id="vocalPart" class="form__input form__input--extra-long" name="vocalPart" value="${entry.vocalPart}" onfocus="this.select()"><br>` +

            `<label for="key" class="form__label">Key:</label>` +
            `<input type="text" id="key" class="form__input form__input--extra-long" name="key" value="${entry.key}" onfocus="this.select()"><br>` +

            `<label for="melodicIncipit" class="form__label">Melodic Incipit:</label>` +
            `<input type="text" id="melodicIncipit" class="form__input form__input--extra-long" name="melodicIncipit" value="${entry.melodicIncipit}" onfocus="this.select()"><br>` +

            `<label for="textIncipit" class="form__label">Text Incipit:</label>` +
            `<input type="text" id="textIncipit" class="form__input form__input--extra-long" name="textIncipit" value="${entry.textIncipit}" onfocus="this.select()"><br>` +

            `<label for="isSecular" class="form__label">Secular:</label>` +
            `<input type="text" id="isSecular" class="form__input form__input--extra-long" name="isSecular" value="${entry.isSecular}" onfocus="this.select()"><br>` +

            `<label for="notes" class="form__label">Notes:</label>` +
            `<input type="text" id="notes" class="form__input form__input--extra-long" name="notes" value="${entry.notes}" onfocus="this.select()"><br>` +
            
            `<button id="updateRow" class="btn btn--blue">Update</button>` +
            `<button id="deleteRow" class="btn btn--blue">Delete</button>`;
}

//create form that pre-fills data from table row
function getSourceFormHTML(source){
    return `<label for="ID" class="form__label">ID:</label>` +
            `<input type="text" id="id" class="form__input form__input--extra-long" name="id" value="${source.id}" readonly><br>` +

            `<label for="collection" class="form__label">Collection:</label>` +
            `<input type="text" id="collection" class="form__input form__input--extra-long" name="collection" value="${source.collection}" onfocus="this.select()"><br>` +

            `<label for="sourceNumber" class="form__label">Source Number:</label>` +
            `<input type="text" id="sourceNumber" class="form__input form__input--extra-long" name="sourceNumber" value="${source.sourceNumber}" onfocus="this.select()"><br>` +

            `<label for="callNumber" class="form__label">Call Number:</label>` +
            `<input type="text" id="callNumber" class="form__input form__input--extra-long" name="callNumber" value="${source.callNumber}" onfocus="this.select()"><br>` +

            `<label for="author" class="form__label">Author:</label>` +
            `<input type="text" id="author" class="form__input form__input--extra-long" name="author" value="${source.author}" onfocus="this.select()"><br>` +

            `<label for="title" class="form__label">Title:</label>` +
            `<input type="text" id="title" class="form__input form__input--extra-long" name="title" value="${source.title}" onfocus="this.select()"><br>` +

            `<label for="inscription" class="form__label">Inscription:</label>` +
            `<textarea inline="text" id="inscription" class="form__textarea" name="inscription" onfocus="this.select()">${source.inscription}</textarea><br>` +

            `<label for="description" class="form__label">Description:</label>` +      
            `<textarea inline="text" id="description" class="form__textarea" name="description" onfocus="this.select()">${source.description}</textarea><br>` +

            `<button id="updateRow" class="btn btn--blue">Update</button>` +
            `<button id="deleteRow" class="btn btn--blue">Delete</button>`;

}

function getCollectionFormHTML(collection){
    return `<label for="ID" class="form__label">ID:</label>` + 
            `<input type="text" id="id" class="form__input form__input--extra-long" name="id" value="${collection.id}" readonly><br>` + 

            `<label for="collection" class="form__label">Collection:</label>` + 
            `<input type="text" id="collection" class="form__input form__input--extra-long" name="collection" value="${collection.collection}" onfocus="this.select()"><br>` + 

            `<label for="description" class="form__label">Description:</label>` + 
            `<textarea th:inline="text" id="description" class="form__textarea" name="description" onfocus="this.select()">${collection.description}</textarea><br>` + 
            
            `<button id="updateRow" class="btn btn--blue">Update</button>` +
            `<button id="deleteRow" class="btn btn--blue">Delete</button>`;
}