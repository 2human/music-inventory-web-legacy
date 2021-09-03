
/**
 * 
 */
//TODO incorporate template strings
//TODO change from id's to classes in html
//TODO retain formatting on updates when there are multiple lines so that new lines are not deleted


//display checkboxes corresponding to fields of table radio button selection
const tableButtons = document.getElementById('tableSelect');    //div containing buttons that determine which table to search
const fieldDiv = document.getElementById('fieldSelect');  //div that displays checkboxes for selecting data fields to search
const searchBtn = document.getElementById('submitSearch');
const modal = document.getElementById("myModal");     
const pageBtnDiv = document.getElementById('pageBtns');            //get page number button div
const pageBtnDivBot = document.getElementById('pageBtnsBot');
const searchResultsTable = document.getElementById('searchResultsTable');
const searchForm = document.getElementById('search');
const modalForm = document.getElementById("modalForm");
const resultsMessage = document.getElementById("resultsMsg");     
const resultsPerPageDiv = document.getElementById('resultsPerPage');    

let searchProperties;
let searchResultsData;

insertFieldCheckboxes();
initializeEventListeners();

function insertFieldCheckboxes(){
    fieldDiv.innerHTML = getTableFieldsHTML(getTableSelection()); //display fields for that element
}

//gets table currently selected with radio button
function getTableSelection(){
    return tableButtons.children.find( button => button.checked === true);
}

function initializeEventListeners(){
    //event listener that generates fieldSelect div containing buttons corresponding to fields within table
    tableButtons.addEventListener("click", insertFieldCheckboxes);;
    //event listener / handler for submitting search 
    searchBtn.addEventListener("click", executeSearch);
    //create event listener for buttons
    pageBtnDiv.addEventListener("click", selectResultPage);    
    //TODO: remove so that there is only one listener for both page buttons
    pageBtnDivBot.addEventListener("click", (event) => {
        selectResultPage(event);
        scrollToTop(event);
    });
    searchResultsTable.ondblclick = openEditorModal;
}

function executeSearch(event){  
    event.preventDefault();   
    let xhr = new XMLHttpRequest();
    xhr.open('GET', getHTTPRequestURL(searchForm), true);
    xhr.send();
    xhr.onload = function(){     
        let request = this;
        if(requestSuccessful(request.status)){
            searchResultsData = JSON.parse(request.responseText);
            generateSearchResultsDisplay();
        } 
    }
}

//TODO this has to be fixed so that it goes by domain name
//generate request url with search params and table selection
function getHTTPRequestURL(form){    
    return 'http://localhost:8080/' + getTableSelection() + '?' + getSearchParams(form);
}

//get URI search param string from form
function getSearchParams(form){
    let formData = new FormData(form);  //get data input from form
    let searchObj = new URLSearchParams(formData);  //search param object
    let params = searchObj.toString();       //get string of search parameters
    return params;
}

function generateSearchResultsDisplay(){
    initializeSearchProperties();    
    insertSearchResults();
    insertPageButtons();    
    insertResultsPerPageSelector();
}
function getTableSelection(){
    //determine which table radio button is selected
    let searchForm = document.getElementById('search');
    return searchForm.elements['table'].value;  //get value of selected table
}

function requestSuccessful(requestStatus){
    return requestStatus == 200;
}

function initializeSearchProperties(){
    searchProperties = new function(){
        this.curPage = 1,
        this.resultsPerPage = 100,
        this.totalResults = searchResultsData.length,
        this.totalPages = Math.floor(this.totalResults / this.resultsPerPage + 1),
        this.resultsPerPageOptions = ['All', 500, 100, 25]
    };
}

function insertSearchResults(){    
    searchResultsTable.innerHTML = getResultTableHTML(getTableSelection(), searchResultsData);
}

function getResultTableHTML(dataType, data){
    if(!searchResultsData[0]) return '';    //return empty string if data is empty
    return  '<table id="table">' + 
                getTableHeaderHTML(dataType) +
                getTableBodyHTML(dataType, data) +
            '</table>';
}

function getTableHeaderHTML(dataType){   
    switch(dataType){
        case "entries": 
            return getEntryTableHeaderHTML();
        case "sources":
            return getSourceTableHeaderHTML();
        case "collections":
            return getCollectionTableHeaderHTML();
    }
}

function getEntryTableHeaderHTML(){
    return  '<tr>' +
                '<th id="id">ID</td>' +
                '<th id="collection">Collections</td>' +
                '<th id="sourceNumber">Source Number</td>' +
                '<th id="location">Location</td>' +
                '<th id="title">Title</td>' +
                '<th id="credit">Credit</td>' +
                '<th id="vocalPart">Vocal Part</td>' +
                '<th id="key">Key</td>' +
                '<th id="melodicIncipit">Melodic Incipit</td>' +
                '<th id="textIncipit">Text Incipit</td>' +
                '<th id="isSecular">Secular</td>' +
            '</tr>';
}

function getSourceTableHeaderHTML(){
    return '<tr>' +
                '<th id="id">ID</td>' +
                '<th id="collection">Collection</td>' +
                '<th id="sourceNumber">Source Number</td>' +
                '<th id="callNumber">Call Number</td>' +
                '<th id="author">Author</td>' +
                '<th id="title">Title</td>' +
                '<th id="inscription">Inscription</td>' +
                '<th id="description">Description</td>' +
            '</tr>';
}

function getCollectionTableHeaderHTML(){
    return '<tr class="collectionRow">' +
                '<th id="id">ID</td>' +
                '<th id="collection">Collection</td>' +
                '<th id="description">Description</td>' +
            '</tr>';
}

function getTableBodyHTML(dataType, data){  
    data.sort((a, b) => a.id - b.id);    
    let htmlStr = '';
    //get range of results to display
    let lastResultIndex = searchProperties.curPage * searchProperties.resultsPerPage;
    let firstResultIndex = lastResultIndex - searchProperties.resultsPerPage;
    //start at first result for data range and end at last result or final result in data set
    for(let index = firstResultIndex; index < lastResultIndex && index < searchProperties.totalResults; index++){
            htmlStr += getTableRowHTML(dataType, data[index]);;
        }
    return htmlStr;    
}

function getTableRowHTML(dataType, data){   
    switch(dataType){
        case "entries": 
            return getEntryTableRowHTML(data);
        case "sources":
            return getSourceTableRowHTML(data);
        case "collections":
            return getCollectionTableRowHTML(data);
    }
}

function getSourceTableRowHTML(source){
    return '<tr class="sourceRow">' +
                `<td id="id"><a href="http://localhost:8080/getSource?id=${source.id}" target="_blank">${source.id}</a></td>` +
                `<td id="collection">${source.collection}</td>` +
                `<td id="sourceNumber">${source.sourceNumber}</td>` +
                `<td id="callNumber">${source.callNumber}</td>` +
                `<td id="author">${source.author}</td>` +
                `<td id="title">${source.title}</td>` +
                `<td id="inscription" contenteditable="false">${source.inscription}</td>` +
                `<td id="description">${source.description}</td>` +
            '</tr>';
}

function getEntryTableHTML(entries){
    return  '<table id="table">' +
                getEntryTableHeaderHTML() +
                getTableBodyHTML(entries) +                    
            '</table>';
      
}

function getEntryTableRowHTML(entry){
    return '<tr class="entryRow">' +
                `<td id="id"><a href="http://localhost:8080/getEntry?id=${entry.id}" target="_blank">${entry.id}</a></td>` +
                `<td id="collection">${entry.collection}</td>` +
                `<td id="sourceNumber">${entry.sourceNumber}</td>` +
                `<td id="location">${entry.location}</td>` +
                `<td id="title">${entry.title}</td>` +
                `<td id="credit">${entry.credit}</td>` +
                `<td id="vocalPart">${entry.vocalPart}</td>` +
                `<td id="key">${entry.key}</td>` +
                `<td id="melodicIncipit">${entry.melodicIncipit}</td>` +
                `<td id="textIncipit">${entry.textIncipit}</td>` +
                `<td id="isSecular">${entry.isSecular}</td>` +
            '</tr>'; 
}

function getCollectionResultTableHTML(collections){    
    return  '<table id="table">' + 
                getCollectionTableHeaderHTML() + 
                getTableBodyHTML(collections) + 
            '</table>';
}

function getCollectionTableRowHTML(collection){
    return '<tr class="collectionRow">' +
                `<td id="id"><a href="http://localhost:8080/getCollection?id=${collection.id}" target="_blank">${collection.id}</a></td>` +
                `<td id="collection">${collection.collection}</td>` +
                `<td id="description">${collection.description}</td>` +
            '</tr>';        
}

function insertPageButtons(){
    let btnHTML = '';
    if(searchProperties.totalPages > 1){
        btnHTML = getPageSelectorBtnsHTML(); //construct page buttons for search results        
    }
    pageBtnDiv.innerHTML = btnHTML;          //add button html to page
    pageBtnDivBot.innerHTML = btnHTML;
    resultsMessage.innerHTML = getResultsMessage();

}

//construct buttons that allow user to select search result page
function getPageSelectorBtnsHTML(){
    let maxButtons = 8;    
    let bounds = getPageBtnBounds(searchProperties, maxButtons);
    let btnHTMLStr = getPreviousAndFirstPageBtnsHTML(searchProperties.curPage, bounds.lowerBound) +
        getInnerPageBtnsHtML(searchProperties, bounds) +
        getLastAndNextPageBtnsHTML(searchProperties, bounds.upperBound);    
    return btnHTMLStr;
}

//
function getPageBtnBounds(searchProperties, maxButtons){
    //determines range of buttons to create when navigating search page results
    //first and last page buttons always created, so the boundaries for buttons that can possibly be created here
    //are between the 2nd and 2nd to last pages
    //increment equally in each direction to start, then allocate rest to whatever boundary remains
    //until max buttons reached
    let totalButtons = 0,                       //current tally of buttons that will be created
        lowerBound = searchProperties.curPage,           //lower and upper bounds start at current page
        upperBound = searchProperties.curPage,           //and are incremented until their boundaries are reached
        totalPages = searchProperties.totalPages;
    while(totalButtons < maxButtons &&
         (lowerBound > 2 || upperBound < totalPages - 1)){  //both 2nd page button and 2nd to last have yet to be created 
        if(lowerBound > 2){                      //second page not added
            lowerBound--;
            totalButtons++;
        }
        if(upperBound < totalPages - 1 && totalButtons !== maxButtons){ //second to last page not added and all buttons not created
            upperBound++;           
            totalButtons++;
        }        
    }
    return { upperBound: upperBound, lowerBound: lowerBound }
}

//TODO remove 'curPage' from button class
function getPreviousAndFirstPageBtnsHTML(curPage, lowerBound){    
    //disable buttons if first page currently being viewd
    let htmlStr = getPageBtnHTML('Previous', curPage) + 
                getPageBtnHTML(1, curPage);
    if(lowerBound > 2){     //if second page button will not be created
        htmlStr += '...';    //put dots between first and proceeding buttons
    }
    return htmlStr;
}

function getPageBtnHTML(pageNumber, curPage){
    if(isDisabledBtn(pageNumber, curPage)){
        return getDisabledPageBtnHTML(pageNumber);
    } else{
        return getActivePageBtnHTML(pageNumber);
    }
}

//destermine if button should be disabled
function isDisabledBtn(pageNumber, curPage){
    if(curPage === pageNumber){     //page corresponding to page button number selected
        return true;
    } else if(pageNumber === 'Previous' && curPage === 1){  //cannot select previous if on first page
        return true;
    } else if (pageNumber === 'Next' && curPage === searchProperties.totalPages){   //cannot select next if of last page
        return true;
    } else{
        return false;
    }    
}

function getDisabledPageBtnHTML(pageNumber){
    return `<button class="pageBtns" disabled>${pageNumber}</button>`;
}

function getActivePageBtnHTML(pageNumber){
    return `<button class="pageBtns">${pageNumber}</button>`
}

function getInnerPageBtnsHtML(searchProperties, bounds){
    let btnHTML = "";
    //generate all buttons between lower and upper bounds (inclusive) previously determined
    for(let pageNumber = bounds.lowerBound; pageNumber <= bounds.upperBound; pageNumber++){
        //prevent duplicates of first and last page, which are always going to be created
        if(pageNumber !== 1 && pageNumber !== searchProperties.totalPages){
            btnHTML += getPageBtnHTML(pageNumber, searchProperties.curPage);
        }
    }
    return btnHTML;
}

function getLastAndNextPageBtnsHTML(searchProperties, upperBound){
    let htmlStr = '';
    let totalPages = searchProperties.totalPages;
    //if not last page, add normal page buttons
    if(upperBound < totalPages - 1){     //if there is gap between core buttons and end button
        htmlStr += '...';               //add dots
    }
    htmlStr +=   getPageBtnHTML(totalPages, searchProperties.curPage) + 
                getPageBtnHTML('Next', searchProperties.curPage);
    return htmlStr;

}

function getResultsMessage(){
    if(searchProperties.totalResults === 0){
        return getNoResultsMessage();
    }    
    else if(searchProperties.totalPages === 1){
        return getSinglePageResultsMessage(searchProperties.totalResults);
    } else{
        return getMultiPageResultsMessage(searchProperties);
    } 
}

function getNoResultsMessage(){
    return '<b>No results found...<b><br><br>';
}

function getSinglePageResultsMessage(totalResults){
    if(totalResults === 1){
        return `<b>Displaying ${totalResults} result...</b><br><br>`;   //display 'results' in singular form
    }
    return `<b>Displaying ${totalResults} results...</b><br><br>`;      //display 'results' in plural form
}

//result message containing range of results
function getMultiPageResultsMessage(searchProperties){
    let lastResult = searchProperties.curPage == searchProperties.totalPages ?  //if on last page
                searchProperties.totalResults :                                     //last result will be equal to total results
                parseInt(searchProperties.curPage * searchProperties.resultsPerPage);   //otherwise will be somewhere between
    let firstResult = parseInt((searchProperties.curPage - 1) * searchProperties.resultsPerPage + 1) ;
    return `<br><b>Displaying ${firstResult}-${lastResult} of ${searchProperties.totalResults} results...</b><br>`;   

}

function scrollToTop(event){  
    if(event.target.nodeName === 'BUTTON'){ //only scroll to top if button was clicked
        window.scrollTo(0, 130);
    }
}

function insertResultsPerPageSelector(){   
    if(searchProperties.totalPages > 1){ 
        resultsPerPageDiv.innerHTML = getResultsPerPageHTML(searchProperties.resultsPerPage, searchProperties.resultsPerPageOptions);
    } else resultsPerPageDiv.innerHTML = '';
    resultsPerPageDiv.addEventListener("click", event => setResultsPerPage(event, searchProperties.resultsPerPageOptions));
}

//generate links that allow user to select results per page
function getResultsPerPageHTML(curResultsPerPage){
    let resultsPerPageHTML = 'Results Per Page: ';
    searchProperties.resultsPerPageOptions.forEach( resultsOption => {
        if(curResultsPerPage == resultsOption){             //if current selection
            resultsPerPageHTML += resultsOption + '  ';     //add only text with no hyperlink
        } else{                                             //otherwise construct text with hyperlink
            resultsPerPageHTML += `<a href="javascript:void(null);" id="${resultsOption}" class="resultsPerPageLink">${resultsOption}</a>   `;
        }
    });
    resultsPerPageHTML += '<br><br>';
    return resultsPerPageHTML;
}

function setResultsPerPage(event){
    let clicked = event.target;
    if(clicked.className === 'resultsPerPageLink'){
        let resultsPerPage = clicked.id;
        searchProperties.curPage = 1;
        if(resultsPerPage == 'All'){
            searchProperties.resultsPerPage = searchProperties.totalResults;
            searchProperties.totalPages = 1;
        } else{
            searchProperties.resultsPerPage = resultsPerPage;
            searchProperties.totalPages = Math.floor(searchProperties.totalResults / searchProperties.resultsPerPage + 1);
        }
        searchResultsTable.innerHTML = getResultTableHTML(getTableSelection(), searchResultsData);
        insertPageButtons(searchProperties);
        if(searchProperties.totalResults != 0){
            resultsPerPageHTML = getResultsPerPageHTML(resultsPerPage, searchProperties.resultsPerPageOptions);
            resultsPerPageDiv.innerHTML = resultsPerPageHTML;
        } else resultsPerPageDiv.innerHTML = '';
    } 
}

function openEditorModal(event){
    let cellClicked = event.target;
    if(isEditableCell(cellClicked)){     //if cell clicked is not table header and not the id column
        let tableRow = cellClicked.parentElement;        //table row element of cell clicked
        modalForm.innerHTML = getFormHTML(getTableSelection(), getRowData(tableRow));  
        let closeModalBtn = document.getElementById("closeModal");       // Get the <span> element that closes the modal    
        openModal();
        getMatchingFormField(cellClicked).focus();  //focus field in form corresponding to field clicked
        let updateBtn = document.getElementById('updateRow');
        updateBtn.addEventListener("click", (event) => {
            event.preventDefault();
            //get string of search parameters
            let xhr = new XMLHttpRequest();
            console.log(getHTTPRequestURL(modalForm));
            xhr.open('POST', getHTTPRequestURL(modalForm), true);
            xhr.send();
            xhr.onload = function(){
                let request = this;
                let updatedRowData = JSON.parse(request.responseText),
                    updatedRowHTML = getTableRowHTML(getTableSelection(), updatedRowData);
                console.log(updatedRowData);
                tableRow.innerHTML = updatedRowHTML; 
                modal.style.display = "none";
            }            
        });  
        let deleteBtn = document.getElementById("deleteRow");
        deleteBtn.addEventListener("click", (event) => {                        
            event.preventDefault();
            let rowID = row.children[0].innerText;
            let xhr = new XMLHttpRequest();
            console.log(getHTTPRequestURL(modalForm));
            xhr.open('DELETE', getHTTPRequestURL(modalForm), true);
            xhr.send();
            xhr.onload = function(){
                row.innerHTML = ""; 
                modal.style.display = "none";
                alert('Source with ID ' + rowID + ' deleted.')
            }


        }); 
        // When the user clicks on (x), close the modal
        closeModalBtn.onclick = function() {
            closeModal();
        }
        
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }

        //make it so that hitting escape will close modal
        document.onkeydown = function(event) {
            event = event || window.event;
            if (event.keyCode == 27) {
                closeModal();
            }
        };
    }
}

//makes sure that cell clicked in table is not part of header and is not database ID
function isEditableCell(cellClicked){
    return cellClicked.nodeName !== "TH" && cellClicked.id !== "id"
}

/**
 * Get html for form that will be displayed in search table modal.
 * @param {*} row Row selected within search table containing information that will populate modal form.
 */

function getFormHTML(dataType, rowData){    
    switch(dataType){
        case "entries":
            return getEntryFormHTML(rowData);
        case "sources":
            return getSourceFormHTML(rowData);
        case "collections":
            return getCollectionFormHTML(rowData);
    }
}
//create form that pre-fills data from table row
function getEntryFormHTML(entry){
    return '<label for="Id">Id:</label>' +
            '<input type="text" id="id" class="searchBox" name="id" value="' + entry.id + '" readonly><br>' +
            '<label for="collection">Collection:</label>' +
            '<input type="text" id="collection" class="searchBox" name="collection" value="' + entry.collection + '" onfocus="this.select()"><br>' +
            '<label for="sourceNumber">Source Number:</label>' +
            '<input type="text" id="sourceNumber" class="searchBox" name="sourceNumber" value="' + entry.sourceNumber + '" onfocus="this.select()"><br>' +
            '<label for="location">Location:</label>' +
            '<input type="text" id="location" class="searchBox" name="location" value="' + entry.location + '" onfocus="this.select()"><br>' +
            '<label for="title">Title:</label>' +
            '<input type="text" id="title" class="searchBox" name="title" value="' + entry.title + '" onfocus="this.select()"><br>' +
            '<label for="credit">Credit:</label>' +
            '<input type="text" id="credit" class="searchBox" name="credit" value="' + entry.credit + '" onfocus="this.select()"><br>' +
            '<label for="vocalPart">Vocal Part:</label>' +
            '<input type="text" id="vocalPart" class="searchBox" name="vocalPart" value="' + entry.vocalPart + '" onfocus="this.select()"><br>' +
            '<label for="key">Key:</label>' +
            '<input type="text" id="key" class="searchBox" name="key" value="' + entry.key + '" onfocus="this.select()"><br>' +
            '<label for="melodicIncipit">Melodic Incipit:</label>' +
            '<input type="text" id="melodicIncipit" class="searchBox" name="melodicIncipit" value="' + entry.melodicIncipit + '" onfocus="this.select()"><br>' +
            '<label for="textIncipit">Text Incipit:</label>' +
            '<input type="text" id="textIncipit" class="searchBox" name="textIncipit" value="' + entry.textIncipit + '" onfocus="this.select()"><br>' +
            '<label for="isSecular">Secular:</label>' +
            '<input type="text" id="isSecular" class="searchBox" name="isSecular" value="' + entry.isSecular + '" onfocus="this.select()"><br>' +
            '<button id="updateRow">Update</button>' +
            '<button id="deleteRow">Delete</button>';
}

//create form that pre-fills data from table row
function getSourceFormHTML(source){
    return '<label for="id">Id:</label>' +
            '<input type="text" id="id" class="searchBox" name="id" value="' + source.id + '" readonly><br>' +
            '<label for="collection">Collection:</label>' +
            '<input type="text" id="collection" class="searchBox" name="collection" value="' + source.collection + '" onfocus="this.select()"><br>' +
            '<label for="sourceNumber">Source Number:</label>' +
            '<input type="text" id="sourceNumber" class="searchBox" name="sourceNumber" value="' + source.sourceNumber + '" onfocus="this.select()"><br>' +
            '<label for="callNumber">Call Number:</label>' +
            '<input type="text" id="callNumber" class="searchBox" name="callNumber" value="' + source.callNumber + '" onfocus="this.select()"><br>' +
            '<label for="author">Author:</label>' +
            '<input type="text" id="author" class="searchBox" name="author" value="' + source.author + '" onfocus="this.select()"><br>' +
            '<label for="title">Title:</label>' +
            '<input type="text" id="title" class="searchBox" name="title" value="' + source.title + '" onfocus="this.select()"><br>' +
            '<label for="inscription">Inscription:</label>' +
            '<textarea inline="text" id="inscription" class="searchBox" name="inscription" onfocus="this.select()">' + source.inscription + '</textarea><br>' +
            '<label for="description">Description:</label>' +        
            '<textarea inline="text" id="description" class="searchBox" name="description" onfocus="this.select()">' + source.description + '</textarea><br>' +
            '<button id="updateRow">Update</button>' +
            '<button id="deleteRow">Delete</button>';

}

function getCollectionFormHTML(collection){
    return '<label for="Id">Id:</label>' + 
            '<input type="text" id="id" class="searchBox" name="id" value="' + collection.id + '" readonly><br>' + 
            '<label for="collection">Collection:</label>' + 
            '<input type="text" id="collection" class="searchBox" name="collection" value="' + collection.collection + '" onfocus="this.select()"><br>' + 
            '<label for="description">Description:</label>' + 
            '<textarea th:inline="text" id="description" class="searchBox" name="description" onfocus="this.select()">' + collection.description + '</textarea><br>' + 
            '<button id="updateRow">Update</button>' +
            '<button id="deleteRow">Delete</button>';
}

function getRowData(row){
    return searchResultsData.find( data => data.id === getRowID(row));
}

function getRowID(row){
    return parseInt(row.children[0].innerText);
}

function openModal(){
    modal.style.display = "block";
}

//focus form field corresponding to field that was clicked in table
function focusFormField(cellClicked){

}

function closeModal(){
    modal.style.display = "none";
}



//gets input element corresponding to field of cell clicked
function getMatchingFormField(cellClicked){
    let clickedId = cellClicked.id;     //id of clicked cell
    //find matching id within modal form
    for(let i = 0, len = modalForm.childNodes.length; i < len; i++){
        if(modalForm.childNodes[i].id == clickedId){ 
            return modalForm.childNodes[i];
        }
    }
    return null;
}

//TODO figure out haow to make it so bottom div goes to top
//respond to result page click
function selectResultPage(event){    
    let btnClicked = event.target;      //get button clicked
    if(btnClicked.innerText === 'Next'){    //if next button was clicked, increment page number
        searchProperties.curPage++;
    } else if(btnClicked.innerText === 'Previous'){ //if previous button was clicked, decrement page number
        searchProperties.curPage--;
    } else{                             //if page number was clicked, set page to page number
    searchProperties.curPage = parseInt(btnClicked.innerText);
    }
    if(btnClicked.nodeName === 'BUTTON'){   //make sure that button was clicked, and not "..." text                
        searchResultsTable.innerHTML = getResultTableHTML(getTableSelection(), searchResultsData);
        insertPageButtons(searchProperties);
    }
}

/**
 * Returns checkboxes corresponding to with labels that correspond to field names which allows user to select
 * which fields to search.
 * @param {} tableSelection Table radio button that is selected
 */
function getTableFieldsHTML(tableSelection){
    //generate fields corresponding to those within sources table 
    switch(tableSelection){
        //source radio button clicked
        case "sources":
            //generate html for checkboxes
            return 'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
            '<input type="checkbox" name="field" id="collection" value="collection"> Collection ' +
            '<input type="checkbox" name="field" id="sourceNumber" value="sourceNumber"> Source Number ' +
            '<input type="checkbox" name="field" id="callNumber" value="callNumber"> Call Number ' +
            '<input type="checkbox" name="field" id="author" value="author"> Author ' +
            '<input type="checkbox" name="field" id="title" value="title"> Title ' +
            '<input type="checkbox" name="field" id="inscription" value="inscription"> Inscription ' +
            '<input type="checkbox" name="field" id="description" value="description"> Description ';
            break;
        //entries radio button clicked
        case "entries": 
            //generate html for checkboxes
            return 'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
            '<input type="checkbox" name="field" id="collection" value="collection"> Collection ' +
            '<input type="checkbox" name="field" id="sourceNumber" value="sourceNumber"> Source Number ' +
            '<input type="checkbox" name="field" id="location" value="location"> Location ' +
            '<input type="checkbox" name="field" id="title" value="title"> Title ' +
            '<input type="checkbox" name="field" id="credit" value="credit"> Credit ' +
            '<input type="checkbox" name="field" id="vocalPart" value="vocalPart"> Vocal Part ' +
            '<input type="checkbox" name="field" id="key" value="key"> Key ' +
            '<input type="checkbox" name="field" id="melodicIncipit" value="melodicIncipit"> Melodic Incipit ' +
            '<input type="checkbox" name="field" id="textIncipit" value="textIncipit"> Text Incipit ' +
            '<input type="checkbox" name="field" id="isSecular" value="isSecular"> Secular ';
            break;
        case "collections": 
        return 'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
        '<input type="checkbox" name="field" id="collection" value="collection"> Collection ' +
        '<input type="checkbox" name="field" id="description" value="description"> Description';


    }
}