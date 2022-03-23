/**
 * 
 * @param {*} dataType Data type corresponding to selected table.
 * @param {*} data Single table row of data to populate form
 * @returns Form containing table row of data for modal.
 */
 export function getCreateRowFormHTML(dataType){    
  switch(dataType){
      case "entries":
          return getCreateEntryFormHTML();
      case "sources":
          return getCreateSourceFormHTML();
      case "collections":
          return getCreateCollectionFormHTML();
  }
}

//create form that pre-fills data from table row
function getCreateEntryFormHTML(){
  return `
        <span class="close" id="closeModal">&times;</span>
        <form id="create-row-form" class="edit-form">
          <label for="collection" class="form__label form__label--modal">Collection:</label>
          <input type="text" id="collection" class="form__input form__input--extra-long modal__input" name="collection" onfocus="this.select()"><br>

          <label for="sourceNumber" class="form__label form__label--modal">Source Number:</label>
          <input type="text"
                  ${getNumberInputOnlyAttribute()}
                  class="form__input form__input--extra-long modal__input" 
                  name="sourceNumber" onfocus="this.select()"><br>
          
          <label for="location" class="form__label form__label--modal">Location:</label>
          <input type="text" id="location" class="form__input form__input--extra-long modal__input" name="location" onfocus="this.select()"><br>

          <label for="title" class="form__label form__label--modal">Title:</label>
          <input type="text" id="title" class="form__input form__input--extra-long modal__input" name="title" onfocus="this.select()"><br>

          <label for="composer" class="form__label form__label--modal">Composer:</label>
          <input type="text" id="composer" class="form__input form__input--extra-long modal__input" name="composer" onfocus="this.select()"><br>

          <label for="vocalPart" class="form__label form__label--modal">Vocal Part:</label>
          <input type="text" id="vocalPart" class="form__input form__input--extra-long modal__input" name="vocalPart" onfocus="this.select()"><br>

          <label for="key" class="form__label form__label--modal">Key:</label>
          <input type="text" id="key" class="form__input form__input--extra-long modal__input" name="key" onfocus="this.select()"><br>

          <label for="melodicIncipit" class="form__label form__label--modal">Melodic Incipit:</label>
          <input type="text" id="melodicIncipit" class="form__input form__input--extra-long modal__input" name="melodicIncipit" onfocus="this.select()"><br>

          <label for="textIncipit" class="form__label form__label--modal">Text Incipit:</label>
          <input type="text" id="textIncipit" class="form__input form__input--extra-long modal__input" name="textIncipit" onfocus="this.select()"><br>

          <label for="isSecular" class="form__label form__label--modal">Secular:</label>
          <input type="text" id="isSecular" class="form__input form__input--extra-long modal__input" name="isSecular" onfocus="this.select()"><br>

          <label for="notes" class="form__label form__label--modal">Notes:</label>
          <input type="text" id="notes" class="form__input form__input--extra-long modal__input" name="notes" onfocus="this.select()"><br>

          ${getMessageDiv()}
          
          <div id="modal-action-div" class="edit-form__btn-group">
            <button id="create-form-submit" class="btn btn--blue u-margin-right-small">Create</button>
            <button id="create-form-clear" class="btn btn--blue">Clear</button>  
          </div>
        </form>
          `;
}

//create form that pre-fills data from table row
function getCreateSourceFormHTML(){
  return `
        <span class="close" id="closeModal">&times;</span>
        <form id="create-row-form" class="edit-form">

          <label for="collection" class="form__label form__label--modal">Collection:</label>
          <input type="text" id="collection" class="form__input form__input--extra-long modal__input" name="collection" onfocus="this.select()"><br>

          <label for="sourceNumber" class="form__label form__label--modal">Source Number:</label>
          <input type="text"
                  ${getNumberInputOnlyAttribute()}
                  class="form__input form__input--extra-long modal__input" 
                  name="sourceNumber" onfocus="this.select()"><br>

          <label for="callNumber" class="form__label form__label--modal">Call Number:</label>
          <input type="text" id="callNumber" class="form__input form__input--extra-long modal__input" name="callNumber" onfocus="this.select()"><br>

          <label for="author" class="form__label form__label--modal">Author:</label>
          <input type="text" id="author" class="form__input form__input--extra-long modal__input" name="author" onfocus="this.select()"><br>

          <label for="title" class="form__label form__label--modal">Title:</label>
          <input type="text" id="title" class="form__input form__input--extra-long modal__input" name="title" onfocus="this.select()"><br>

          <label for="inscription" class="form__label form__label--modal form__label--textarea">Inscription:</label>
          <textarea inline="text" id="inscription" class="form__textarea" name="inscription" onfocus="this.select()"></textarea><br>

          <label for="description" class="form__label form__label--modal form__label--textarea">Description:</label>      
          <textarea inline="text" id="description" class="form__textarea" name="description" onfocus="this.select()"></textarea><br>

          ${getMessageDiv()}
          
          <div id="modal-action-div" class="edit-form__btn-group">
            <button id="create-form-submit" class="btn btn--blue u-margin-right-small">Create</button>
            <button id="create-form-clear" class="btn btn--blue">Clear</button>  
          </div>
        </form>
          `;

}

function getCreateCollectionFormHTML(){
  return `
        <span class="close" id="closeModal">&times;</span>
        <form id="create-row-form" class="edit-form">

          <label for="collection" class="form__label form__label--modal">Collection:</label> 
          <input type="text" id="collection" class="form__input form__input--extra-long modal__input" name="collection" onfocus="this.select()"><br> 

          <label for="description" class="form__label form__label--modal form__label--textarea">Description:</label> 
          <textarea th:inline="text" id="description" class="form__textarea" name="description" onfocus="this.select()"></textarea><br> 

          ${getMessageDiv()}
          
          <div id="modal-action-div" class="edit-form__btn-group">
            <button id="create-form-submit" class="btn btn--blue u-margin-right-small">Create</button>
            <button id="create-form-clear" class="btn btn--blue">Clear</button>  
          </div>
        </form>
          `;
}

function getMessageDiv() {
  return '<div id="modal-message" class="u-center-text u-text-bold"></div>';
}

function getNumberInputOnlyAttribute() {
  return `onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')"`;
}