
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

let searchPageProperties;
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
    pageBtnDivBot.addEventListener("click", selectResultPage);
    searchResultsTable.ondblclick = editTableRow;
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
    initializeSearchPageProperties();    
    insertSearchResults();
    insertPageButtons();
    insertResultsPerPageSelector();
}

/**
 * 
 * @returns Name of table selected.
 */
function getTableSelection(){
    //determine which table is going to be searched
    let searchForm = document.getElementById('search');
    return searchForm.elements['table'].value;  //get value of selected table
}

function requestSuccessful(requestStatus){
    return requestStatus == 200;
}

function openModal(){
    modal.style.display = "block";
}

function closeModal(){
    modal.style.display = "none";
}

function initializeSearchPageProperties(){
    searchPageProperties = new function(){
        this.curPage = 1,
        this.resultsPerPage = 100,
        this.totalResults = searchResultsData.length,
        this.totalPages = Math.floor(this.totalResults / this.resultsPerPage + 1)
    };
}

function insertSearchResults(){    
    searchResultsTable.innerHTML = getResultTableHTML();
}

function getResultTableHTML(){
    switch(getTableSelection()){
        case "sources":
            return getSourceResultTableHTML(searchResultsData);
        case "entries":
            return getEntryResultTableHTML(searchResultsData);
        case "collections":
            return getCollectionResultTableHTML(searchResultsData);
    }
}

//construct string with HTML for source table results
function getSourceResultTableHTML(sources){
    let pageNum = searchPageProperties.curPage,
        resultsPerPage = searchPageProperties.resultsPerPage;
    if(typeof sources[0] === "undefined"){
        return '';
    } else{
        sources = sources.sort((a, b) => {
            return a.id - b.id;
        });
        let output = '<table id="table">' + 
                '<tr>' +
                    '<th id="id">ID</td>' +
                    '<th id="collection">Collection</td>' +
                    '<th id="sourceNumber">Source Number</td>' +
                    '<th id="callNumber">Call Number</td>' +
                    '<th id="author">Author</td>' +
                    '<th id="title">Title</td>' +
                    '<th id="inscription">Inscription</td>' +
                    '<th id="description">Description</td>' +
                '</tr>';
        for(let pageLimit = pageNum * resultsPerPage, index = pageLimit - resultsPerPage, totalResults = sources.length;
             index < pageLimit && index < totalResults; index++){
            //pageLimit - last result index of results array to be displayed on page
            //pageNum - page number being displayed
            //index - current index being added to table; starts at pageLimit-pageNum
            //totalResults - length of response object with search results
            output += 
                '<tr class="sourceRow">' +
                    '<td id="id"><a href="http://localhost:8080/getSource?id=' + sources[index].id +'">' + sources[index].id + '</a></td>' +
                    '<td id="collection">' + sources[index].collection + '</td>' +
                    '<td id="sourceNumber">' + sources[index].sourceNumber + '</td>' +
                    '<td id="callNumber">' + sources[index].callNumber + '</td>' +
                    '<td id="author">' + sources[index].author + '</td>' +
                    '<td id="title">' + sources[index].title + '</td>' +
                    '<td id="inscription" contenteditable="false">' + sources[index].inscription + '</td>' +
                    '<td id="description">' + sources[index].description + '</td>' +
                '</tr>';
            }
            output += '</table>';
            return output;
        }
}

//construct string with HTML for entry table results
//entries - array of entry objects constructed from XHRResponse
//pageNum - current page of search results being viewed
//resultsPerPage - results displayed on each page of search results
function getEntryResultTableHTML(entries){
    let pageNum = searchPageProperties.curPage,
        resultsPerPage = searchPageProperties.resultsPerPage;
    //no results found
    if(typeof entries[0] === "undefined"){
        return '';
    } else{         //results found
        entries = entries.sort((a, b) => {
            return a.id - b.id;
        }); 
        let output = '<table id="table">' + 
                '<tr>' +
                    '<th id="id">ID</td>' +
                    '<th id="collection">Collection</td>' +
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
            for(let pageLimit = pageNum * resultsPerPage, index = pageLimit - resultsPerPage, totalResults = entries.length;
                    index < pageLimit && index < totalResults; index++){
                   //pageLimit - last result index of results array to be displayed on page
                   //pageNum - page number being displayed
                   //index - current index being added to table; starts at pageLimit-pageNum
                   //totalResults - length of response object with search results
            output += '<tr class="entryRow">' +
                    '<td id="id"><a href="http://localhost:8080/getEntry?id=' + entries[index].id +'">' + entries[index].id + '</a></td>' +
                    '<td id="collection">' + entries[index].collection + '</td>' +
                    '<td id="sourceNumber">' + entries[index].sourceNumber + '</td>' +
                    '<td id="location">' + entries[index].location + '</td>' +
                    '<td id="title">' + entries[index].title + '</td>' +
                    '<td id="credit">' + entries[index].credit + '</td>' +
                    '<td id="vocalPart">' + entries[index].vocalPart + '</td>' +
                    '<td id="key">' + entries[index].key + '</td>' +
                    '<td id="melodicIncipit">' + entries[index].melodicIncipit + '</td>' +
                    '<td id="textIncipit">' + entries[index].textIncipit + '</td>' +
                    '<td id="isSecular">' + entries[index].isSecular + '</td>' +
                '</tr>';        
        
            }
            output += '</table>';
            return output;
        }
}

//construct string with HTML for entry table results
//collections - array of collection objects constructed from XHRResponse
//pageNum - current page of search results being viewed
//resultsPerPage - results displayed on each page of search results
function getCollectionResultTableHTML(collections){    
    let pageNum = searchPageProperties.curPage,
        resultsPerPage = searchPageProperties.resultsPerPage;
    if(typeof collections[0] === "undefined"){
        return '';
    } else{
        collections = collections.sort((a, b) => {
            return a.id - b.id;
        }); 
        let output = '<table id="table">' + 
                '<tr class="collectionRow">' +
                    '<th id="id">ID</td>' +
                    '<th id="collection">Collection</td>' +
                    '<th id="description">Description</td>' +
                '</tr>';
        for(let pageLimit = pageNum * resultsPerPage, index = pageLimit - resultsPerPage, totalResults = collections.length;
            index < pageLimit && index < totalResults; index++){
            output += '<tr class="collectionRow">' +
                    '<td id="id"><a href="http://localhost:8080/getCollection?id=' + collections[index].id +'">' + collections[index].id + '</a></td>' +
                    '<td id="collection">' + collections[index].collection + '</td>' +
                    '<td id="description">' + collections[index].description + '</td>' +
                '</tr>';        
        
            }
            output += '</table>';
            return output;
        }
}

function insertPageButtons(){
    let btnHTML;
    if(searchPageProperties.totalPages > 1){
        btnHTML = getPageSelectorBtnsHTML(); //construct page buttons for search results        
    }
    pageBtnDiv.innerHTML = btnHTML;          //add button html to page
    pageBtnDivBot.innerHTML = btnHTML;
    resultsMessage.innerHTML = getResultsMessage();

}

function getResultsMessage(){
    let curPage = searchPageProperties.curPage,
        resultsPerPage = searchPageProperties.resultsPerPage,
        totalPages = searchPageProperties.totalPages,
        totalResults = searchPageProperties.totalResults;
    if(totalResults == 0){
        return '<b>No results found...<b><br><br>'
    }    
    if(searchPageProperties.totalPages === 1){
        if(totalResults === 1){
            return '<b>Displaying ' + totalResults + ' result...</b><br><br>';
        }
        return '<b>Displaying ' + totalResults + ' results...</b><br>';
    }

    let upperResult = curPage == totalPages ? totalResults : parseInt(curPage * resultsPerPage);    //last result number on current page
    return '<br><b>Displaying ' + parseInt((curPage - 1) * resultsPerPage + 1) + '-' + 
            upperResult + ' of ' + totalResults + ' results...</b><br>';    
}

//construct buttons that allow user to select search result page
function getPageSelectorBtnsHTML(){ 
    let maxButtons = 8;    
    let bounds = getBtnPageBounds(searchPageProperties, maxButtons);
    let btnHTMLStr = getPreviousAndFirstPageBtnsHTML(searchPageProperties.curPage, bounds.lowerBound) +
        getInnerPageBtnsHtML(searchPageProperties, bounds) +
        getLastAndNextPageBtnsHTML(searchPageProperties, bounds.upperBound);    
    return btnHTMLStr;
}

//
function getBtnPageBounds(searchPageProperties, maxButtons){
    //determines range of buttons to create when navigating search page results
    //first and last page buttons always created, so the boundaries for buttons that can possibly be created here
    //are between the 2nd and 2nd to last pages
    //increment equally in each direction to start, then allocate rest to whatever boundary remains
    //until max buttons reached
    let totalButtons = 0,                       //current tally of buttons that will be created
        lowerBound = searchPageProperties.curPage,           //lower and upper bounds start at current page
        upperBound = searchPageProperties.curPage,           //and are incremented until their boundaries are reached
        totalPages = searchPageProperties.totalPages;
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
    if(pageBtnIsSelected(pageNumber, curPage)){
        return getDisabledPageBtnHTML(pageNumber);
    } else{
        return getActivePageBtnHTML(pageNumber);
    }
}

function pageBtnIsSelected(pageNumber, curPage){
    if(curPage === pageNumber){
        return true;
    } else if(pageNumber === 'Previous' && curPage === 1){
        return true;
    } else if (pageNumber === 'Next' && curPage === searchPageProperties.totalPages){
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

function getInnerPageBtnsHtML(searchPageProperties, bounds){
    let btnHTML = "";
    //generate all buttons between lower and upper bounds (inclusive) previously determined
    for(let pageNumber = bounds.lowerBound; pageNumber <= bounds.upperBound; pageNumber++){
        //prevent duplicates of first and last page, which are always going to be created
        if(pageNumber !== 1 && pageNumber !== searchPageProperties.totalPages){
            btnHTML += getPageBtnHTML(pageNumber, searchPageProperties.curPage);
        }
    }
    return btnHTML;
}

function getLastAndNextPageBtnsHTML(searchPageProperties, upperBound){
    let htmlStr = '';
    let totalPages = searchPageProperties.totalPages;
    //if not last page, add normal page buttons
    if(upperBound < totalPages - 1){     //if there is gap between core buttons and end button
        htmlStr += '...';               //add dots
    }
    htmlStr +=   getPageBtnHTML(totalPages, searchPageProperties.curPage) + 
                getPageBtnHTML('Next', searchPageProperties.curPage);
    return htmlStr;

}







//TODO figure out haow to make it so bottom div goes to top
//respond to result page click
function selectResultPage(event){    
    let btnClicked = event.target;      //get button clicked
    if(btnClicked.innerText === 'Next'){    //if next button was clicked, increment page number
        searchPageProperties.curPage++;
    } else if(btnClicked.innerText === 'Previous'){ //if previous button was clicked, decrement page number
        searchPageProperties.curPage--;
    } else{                             //if page number was clicked, set page to page number
    searchPageProperties.curPage = parseInt(btnClicked.innerText);
    }
    if(btnClicked.nodeName === 'BUTTON'){   //make sure that button was clicked, and not "..." text                
        searchResultsTable.innerHTML = getResultTableHTML();
        insertPageButtons(searchPageProperties);
        // window.scrollTo(0, 130);                    //scroll to top of page
    }
}

function insertResultsPerPageSelector(){
    let resultsPerPageDiv = document.getElementById('resultsPerPage');            
    if(searchPageProperties.totalResults != 0){
    let resultsPerPageHTML = createResultsPerPageHTML(searchPageProperties.resultsPerPage);
    resultsPerPageDiv.innerHTML = resultsPerPageHTML;
    } else resultsPerPageDiv.innerHTML = '';
    resultsPerPageDiv.addEventListener("click", (event) => {
        let clicked = event.target;
        if(clicked.className === 'resultsPerPageLink'){
            searchPageProperties.curPage = 1;
            if(clicked.id == 'All'){
                searchPageProperties.resultsPerPage = searchPageProperties.totalResults;
                searchPageProperties.totalPages = 1;
            } else{
                searchPageProperties.resultsPerPage = clicked.id;
                searchPageProperties.totalPages = Math.floor(searchPageProperties.totalResults / searchPageProperties.resultsPerPage + 1);
            }
            //reset page results according to selection of results per page

            searchResultsTable.innerHTML = getResultTableHTML();

            insertPageButtons(searchPageProperties);

            if(searchPageProperties.totalResults != 0){
            resultsPerPageHTML = createResultsPerPageHTML(clicked.id);
            resultsPerPageDiv.innerHTML = resultsPerPageHTML;
            } else resultsPerPageDiv.innerHTML = '';

        } 
    });
}

/**
 * Get html for form that will be displayed in search table modal.
 * @param {*} row Row selected within search table containing information that will populate modal form.
 */

function getFormHTML(row){    
    switch(row.className){
        case "entryRow":
            return createEntryFormStr(row);
        case "sourceRow":
            return createSourceFormStr(row);
        case "collectionRow":
            return createCollectionFormStr(row);
    }
}
//create form that pre-fills data from table row
function createEntryFormStr(row){
    let rowCells = row.children;
    return '<form action="updateEntryTable" id="tableUpdateForm">' +        
        '<label for="Id">Id:</label>' +
        '<input type="text" id="id" class="searchBox" name="id" value="' + rowCells[0].innerText + '" readonly><br>' +
        '<label for="collection">Collection:</label>' +
        '<input type="text" id="collection" class="searchBox" name="collection" value="' + rowCells[1].innerText + '" onfocus="this.select()"><br>' +
        '<label for="sourceNumber">Source Number:</label>' +
        '<input type="text" id="sourceNumber" class="searchBox" name="sourceNumber" value="' + rowCells[2].innerText + '" onfocus="this.select()"><br>' +
        '<label for="location">Location:</label>' +
        '<input type="text" id="location" class="searchBox" name="location" value="' + rowCells[3].innerText + '" onfocus="this.select()"><br>' +
        '<label for="title">Title:</label>' +
        '<input type="text" id="title" class="searchBox" name="title" value="' + rowCells[4].innerText + '" onfocus="this.select()"><br>' +
        '<label for="credit">Credit:</label>' +
        '<input type="text" id="credit" class="searchBox" name="credit" value="' + rowCells[5].innerText + '" onfocus="this.select()"><br>' +
        '<label for="vocalPart">Vocal Part:</label>' +
        '<input type="text" id="vocalPart" class="searchBox" name="vocalPart" value="' + rowCells[6].innerText + '" onfocus="this.select()"><br>' +
        '<label for="key">Key:</label>' +
        '<input type="text" id="key" class="searchBox" name="key" value="' + rowCells[7].innerText + '" onfocus="this.select()"><br>' +
        '<label for="melodicIncipit">Melodic Incipit:</label>' +
        '<input type="text" id="melodicIncipit" class="searchBox" name="melodicIncipit" value="' + rowCells[8].innerText + '" onfocus="this.select()"><br>' +
        '<label for="textIncipit">Text Incipit:</label>' +
        '<input type="text" id="textIncipit" class="searchBox" name="textIncipit" value="' + rowCells[9].innerText + '" onfocus="this.select()"><br>' +
        '<label for="isSecular">Secular:</label>' +
        '<input type="text" id="isSecular" class="searchBox" name="isSecular" value="' + rowCells[10].innerText + '" onfocus="this.select()"><br>' +
        '<button id="updateRow">Update</button>' +
        '<button id="deleteRow">Delete</button>' +
    '</form>';
}

//create form that pre-fills data from table row
function createSourceFormStr(row){
    let rowCells = row.children;
    return '<form action="updateSourcesTable" id="tableUpdateForm">' +        
        '<label for="id">Id:</label>' +
        '<input type="text" id="id" class="searchBox" name="id" value="' + rowCells[0].innerText + '"><br>' +
        '<label for="collection">Collection:</label>' +
        '<input type="text" id="collection" class="searchBox" name="collection" value="' + rowCells[1].innerText + '" onfocus="this.select()"><br>' +
        '<label for="sourceNumber">Source Number:</label>' +
        '<input type="text" id="sourceNumber" class="searchBox" name="sourceNumber" value="' + rowCells[2].innerText + '" onfocus="this.select()"><br>' +
        '<label for="callNumber">Call Number:</label>' +
        '<input type="text" id="callNumber" class="searchBox" name="callNumber" value="' + rowCells[3].innerText + '" onfocus="this.select()"><br>' +
        '<label for="author">Author:</label>' +
        '<input type="text" id="author" class="searchBox" name="author" value="' + rowCells[4].innerText + '" onfocus="this.select()"><br>' +
        '<label for="title">Title:</label>' +
        '<input type="text" id="title" class="searchBox" name="title" value="' + rowCells[5].innerText + '" onfocus="this.select()"><br>' +
        '<label for="inscription">Inscription:</label>' +
        '<textarea inline="text" id="inscription" class="searchBox" name="inscription" onfocus="this.select()">' + rowCells[6].innerText + '</textarea><br>' +
        '<label for="description">Description:</label>' +        
        '<textarea inline="text" id="description" class="searchBox" name="description" onfocus="this.select()">' + rowCells[7].innerText + '</textarea><br>' +
        '<button id="updateRow">Update</button>' +
        '<button id="deleteRow">Delete</button>' +
    '</form>';

}

function createCollectionFormStr(row){    
    let rowCells = row.children;
    return '<form action="updateCollectionTable" id="tableUpdateForm">' +
        '<label for="Id">Id:</label>' + 
        '<input type="text" id="id" class="searchBox" name="id" value="' + rowCells[0].innerText + '" readonly><br>' + 
        '<label for="collection">Collection:</label>' + 
        '<input type="text" id="collection" class="searchBox" name="collection" value="' + rowCells[1].innerText + '" onfocus="this.select()"><br>' + 
        '<label for="description">Description:</label>' + 
        '<textarea th:inline="text" id="description" class="searchBox" name="description" onfocus="this.select()">' + rowCells[2].innerText + '</textarea><br>' + 
        '<button id="updateRow">Update</button>' +
        '<button id="deleteRow">Delete</button>' + 
    '</form>';
}

function editTableRow(event){
    console.log("modal");
    let cellClicked = event.target;
    if(isTableData(cellClicked)){     //if cell clicked is not table header and not the id column
        let row = cellClicked.parentElement,        //table row element of cell clicked
            formHTML;   //html containing form that will be displayed in modal
        //TODO set up so that form is displaying lines properly
        //construct modal form depending on what table is being viewed
        formHTML = getFormHTML(row);
        modalForm.innerHTML = formHTML;
        let selected = matchClicked(document.getElementById('tableUpdateForm').childNodes, cellClicked);        
        let closeModalBtn = document.getElementById("closeModal");       // Get the <span> element that closes the modal    
        openModal();
        let updateBtn = document.getElementById('updateRow');
        selected.focus();
        updateBtn.addEventListener("click", (event) => {
            event.preventDefault();
            //get string of search parameters
            let modalForm = document.getElementById("tableUpdateForm");
            let xhr = new XMLHttpRequest();
            console.log(getHTTPRequestURL(modalForm));
            xhr.open('POST', getHTTPRequestURL(modalForm), true);
            xhr.send();
            xhr.onload = function(){
                let request = this;
                let updatedRowData = JSON.parse(request.responseText),
                    updatedRowHTML = createTableRow(getTableSelection(), updatedRowData);
                console.log(updatedRowData);
                row.innerHTML = updatedRowHTML; 
                modal.style.display = "none";
            }            
        });  
        let deleteBtn = document.getElementById("deleteRow");
        console.log(deleteBtn);
        deleteBtn.addEventListener("click", (event) => {                        
            event.preventDefault();
            let rowID = row.children[0].innerText;
            let modalForm = document.getElementById("tableUpdateForm");
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
function isTableData(cellClicked){
    return cellClicked.nodeName !== "TH" && cellClicked.id !== "id"
}


//returns element in modal popup form in search engine that matches the cell clicked
//so that the text may be focused/highlighted
function matchClicked(childList, cellClicked){
    let clickedId = cellClicked.id;     //id of clicked cell
    //find matching id within modal form
    for(let i = 0, len = childList.length; i < len; i++){
        if(childList[i].id == clickedId){ 
            return childList[i];        //return matched element
        }
    }
    return null;
}


//generate links that allow user to select results per page
function createResultsPerPageHTML(curResultsPerPage){
    let resultsPerPageHTML = 'Results Per Page: ',
        resultsPerPageOptions = ['All', 500, 100, 25];      //possible selections for results per page
    for(const resultsOption of resultsPerPageOptions){
        if(curResultsPerPage == resultsOption){             //if current selection
            resultsPerPageHTML += resultsOption + '  ';     //add only text with no hyperlink
        } else{                                             //otherwise construct text with hyperlink
            resultsPerPageHTML += '<a href="javascript:void(null);" id="' + resultsOption + '" class="resultsPerPageLink">' + resultsOption + '</a>    '
        }
    }
    resultsPerPageHTML += '<br><br>';
    return resultsPerPageHTML;
}

/**
 * Parse object containing information about table row into string for HTML table row.
 * @param {*} tableSelection Type of table being edited, either Collection, Source, or Entry.
 * @param {*} rowData Object containing data for table row being parsed.
 */
function createTableRow(tableSelection, rowData){    
    switch(tableSelection){
        case "entries": 
            return createEntryRow(rowData);
        case "sources":
            return createSourceRow(rowData);
        case "collections":
            return createCollectionRow(rowData);
    }
}

//create individual source search results table row using a single json object
function createSourceRow(jsonSource){
    return '<td id="id"><a href="http://localhost:8080/getSource?id=' + jsonSource.id +'">' + jsonSource.id + '</a></td>' +
    '<td id="collection">' + jsonSource.collection + '</td>' +
    '<td id="sourceNumber">' + jsonSource.sourceNumber + '</td>' +
    '<td id="callNumber">' + jsonSource.callNumber + '</td>' +
    '<td id="author">' + jsonSource.author + '</td>' +
    '<td id="title">' + jsonSource.title + '</td>' +
    '<td id="inscription" contenteditable="false">' + jsonSource.inscription + '</td>' +
    '<td id="description">' + jsonSource.description + '</td>';
}

//create individual entry search results table row using a single json object
function createEntryRow(jsonEntry){
    return '<td id="id"><a href="http://localhost:8080/getEntry?id=' + jsonEntry.id +'">' + jsonEntry.id + '</a></td>' +
    '<td id="collection">' + jsonEntry.collection + '</td>' +
    '<td id="sourceNumber">' + jsonEntry.sourceNumber + '</td>' +
    '<td id="location">' + jsonEntry.location + '</td>' +
    '<td id="title">' + jsonEntry.title + '</td>' +
    '<td id="credit">' + jsonEntry.credit + '</td>' +
    '<td id="vocalPart">' + jsonEntry.vocalPart + '</td>' +
    '<td id="key">' + jsonEntry.key + '</td>' +
    '<td id="melodicIncipit">' + jsonEntry.melodicIncipit + '</td>' +
    '<td id="textIncipit">' + jsonEntry.textIncipit + '</td>' +
    '<td id="isSecular">' + jsonEntry.isSecular + '</td>';
}

//create individual collection search results table row using a single json object
function createCollectionRow(jsonEntry){
    return '<td id="id"><a href="http://localhost:8080/getCollection?id=' + jsonEntry.id +'">' + jsonEntry.id + '</a></td>' +
    '<td id="collection">' + jsonEntry.collection + '</td>' +
    '<td id="description">' + jsonEntry.description + '</td>';
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