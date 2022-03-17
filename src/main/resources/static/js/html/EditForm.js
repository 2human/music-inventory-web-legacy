/**
 * 
 * @param {*} dataType Data type corresponding to selected table.
 * @param {*} data Single table row of data to populate form
 * @returns Form containing table row of data for modal.
 */
 export function getEditFormHTML(dataType, data){    
    switch(dataType){
        case "entries":
            return getEntryFormHTML(data);
        case "sources":
            return getSourceFormHTML(data);
        case "collections":
            return getCollectionFormHTML(data);
    }
}

export function getDeletePromptHTML() {
    return `
        <div id="modal-action-div" class="edit-form__btn-group">
            <span class="u-text-medium u-margin-right-small">Are you sure you would like to delete this row?</span>
            <button id="confirm-delete-btn" class="btn btn--blue u-margin-right-small">Confirm</button>
            <button id="cancel-delete-btn" class="btn btn--blue">Cancel</button>
        </div>
        `;
    
}

//create form that pre-fills data from table row
function getEntryFormHTML(entry){
    return `
            <label for="ID" class="form__label form__label--modal">ID:</label>
            <input type="text" id="id" class="form__input form__input--extra-long modal__input" name="id" value="${entry.id}" readonly><br>

            <label for="collection" class="form__label form__label--modal">Collection:</label>
            <input type="text" id="collection" class="form__input form__input--extra-long modal__input" name="collection" value="${entry.collection}" onfocus="this.select()"><br>

            <label for="sourceNumber" class="form__label form__label--modal">Source Number:</label>
            <input type="text" id="sourceNumber" class="form__input form__input--extra-long modal__input" name="sourceNumber" value="${entry.sourceNumber}" onfocus="this.select()"><br>
            
            <label for="location" class="form__label form__label--modal">Location:</label>
            <input type="text" id="location" class="form__input form__input--extra-long modal__input" name="location" value="${entry.location}" onfocus="this.select()"><br>

            <label for="title" class="form__label form__label--modal">Title:</label>
            <input type="text" id="title" class="form__input form__input--extra-long modal__input" name="title" value="${entry.title}" onfocus="this.select()"><br>

            <label for="composer" class="form__label form__label--modal">Composer:</label>
            <input type="text" id="composer" class="form__input form__input--extra-long modal__input" name="composer" value="${entry.composer}" onfocus="this.select()"><br>

            <label for="vocalPart" class="form__label form__label--modal">Vocal Part:</label>
            <input type="text" id="vocalPart" class="form__input form__input--extra-long modal__input" name="vocalPart" value="${entry.vocalPart}" onfocus="this.select()"><br>

            <label for="key" class="form__label form__label--modal">Key:</label>
            <input type="text" id="key" class="form__input form__input--extra-long" name="key modal__input" value="${entry.key}" onfocus="this.select()"><br>

            <label for="melodicIncipit" class="form__label form__label--modal">Melodic Incipit:</label>
            <input type="text" id="melodicIncipit" class="form__input form__input--extra-long modal__input" name="melodicIncipit" value="${entry.melodicIncipit}" onfocus="this.select()"><br>

            <label for="textIncipit" class="form__label form__label--modal">Text Incipit:</label>
            <input type="text" id="textIncipit" class="form__input form__input--extra-long modal__input" name="textIncipit" value="${entry.textIncipit}" onfocus="this.select()"><br>

            <label for="isSecular" class="form__label form__label--modal">Secular:</label>
            <input type="text" id="isSecular" class="form__input form__input--extra-long modal__input" name="isSecular" value="${entry.isSecular}" onfocus="this.select()"><br>

            <label for="notes" class="form__label form__label--modal">Notes:</label>
            <input type="text" id="notes" class="form__input form__input--extra-long modal__input" name="notes" value="${entry.notes}" onfocus="this.select()"><br>
            
            ${getModalActionDivHTML()}
            `;
}

//create form that pre-fills data from table row
function getSourceFormHTML(source){
    return `
            <label for="ID" class="form__label form__label--modal">ID:</label>
            <input type="text" id="id" class="form__input form__input--extra-long modal__input" name="id" value="${source.id}" readonly><br>

            <label for="collection" class="form__label form__label--modal">Collection:</label>
            <input type="text" id="collection" class="form__input form__input--extra-long modal__input" name="collection" value="${source.collection}" onfocus="this.select()"><br>

            <label for="sourceNumber" class="form__label form__label--modal">Source Number:</label>
            <input type="text" id="sourceNumber" class="form__input form__input--extra-long modal__input" name="sourceNumber" value="${source.sourceNumber}" onfocus="this.select()"><br>

            <label for="callNumber" class="form__label form__label--modal">Call Number:</label>
            <input type="text" id="callNumber" class="form__input form__input--extra-long modal__input" name="callNumber" value="${source.callNumber}" onfocus="this.select()"><br>

            <label for="author" class="form__label form__label--modal">Author:</label>
            <input type="text" id="author" class="form__input form__input--extra-long modal__input" name="author" value="${source.author}" onfocus="this.select()"><br>

            <label for="title" class="form__label form__label--modal">Title:</label>
            <input type="text" id="title" class="form__input form__input--extra-long modal__input" name="title" value="${source.title}" onfocus="this.select()"><br>

            <label for="inscription" class="form__label form__label--modal form__label--textarea">Inscription:</label>
            <textarea inline="text" id="inscription" class="form__textarea" name="inscription" onfocus="this.select()">${source.inscription}</textarea><br>

            <label for="description" class="form__label form__label--modal form__label--textarea">Description:</label>      
            <textarea inline="text" id="description" class="form__textarea" name="description" onfocus="this.select()">${source.description}</textarea><br>
            
            ${getModalActionDivHTML()}
            `;

}

function getCollectionFormHTML(collection){
    return `
            <label for="ID" class="form__label form__label--modal">ID:</label> 
            <input type="text" id="id" class="form__input form__input--extra-long modal__input" name="id" value="${collection.id}" readonly><br> 

            <label for="collection" class="form__label form__label--modal">Collection:</label> 
            <input type="text" id="collection" class="form__input form__input--extra-long modal__input" name="collection" value="${collection.collection}" onfocus="this.select()"><br> 

            <label for="description" class="form__label form__label--modal">Description:</label> 
            <textarea th:inline="text" id="description" class="form__textarea" name="description modal__input" onfocus="this.select()">${collection.description}</textarea><br> 
            
            ${getModalActionDivHTML()}
            `;
}

function getModalActionDivHTML() {
    return `
        <div id="modal-action-div" class="edit-form__btn-group">
            ${getModalBtnHTML()}
        </div>
    `;
}

export function getModalBtnHTML() {
    return `    
        <button id="updateRow" class="btn btn--blue u-margin-right-small">Update</button>
        <button id="deleteRow" class="btn btn--blue">Delete</button>    
    `;
}