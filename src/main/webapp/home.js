
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

insertFieldCheckboxes();

function insertFieldCheckboxes(){
    fieldDiv.innerHTML = getTableFieldsHTML(getTableSelection()); //display fields for that element
}

function getTableSelection(){    
    for(const tableButton of tableButtons.children){             //for all table radio buttons
        if(tableButton.checked === true){                   //if button is selected
            return tableButton.value;
        }
    }
}

    //event listener that generates fieldSelect div containing buttons corresponding to fields within table
tableButtons.addEventListener("click", insertFieldCheckboxes);

//event listener / handler for submitting search 
searchBtn.addEventListener("click", performSearch);

function performSearch(event){  
    event.preventDefault();   
    let xhr = new XMLHttpRequest();
    console.log(getSearchRequestURL());
    xhr.open('GET', getSearchRequestURL(), true);
    xhr.send();
    xhr.onload = function(){     
        console.log(this.status);
        if(requestSuccessful(this.status)){
            generateSearchResults(this);
        }
    }  
}

//TODO this has to be fixed so that it goes by domain name
//generate request url with search params and table selection
function getSearchRequestURL(){    
    return 'http://localhost:8080/' + getTableSelection() + '?' + getSearchParams();
}

function generateSearchResults(request){
    let resultTableHTMLStr,    //string containing html to display results of search            
        resultTable = document.getElementById('resultTable'),
        searchResultsArr = JSON.parse(request.responseText),   //convert JSON object to JS object; can be array
                                                            //of entries, sources, or collections
        curPage = 1,    //current page of search results being viewed, 1 to start          
        resultsPerPage = 100,   //number of results to be displayed per page; 100 to start
        totalResults = searchResultsArr.length;
        totalPages = Math.floor(totalResults / resultsPerPage + 1);
    
    //TODO turn below into method that takes any type of table
    //construct HTML and add to page
    resultTable.innerHTML = createHTMLTableStr(getTableSelection(), searchResultsArr, curPage, resultsPerPage);

    let pageNumberDiv = document.getElementById('pageBtns'),            //get page number button div
        pageNumberDivBot = document.getElementById('pageBtnsBot'),
        btnHTML = createSearchPageButtons(curPage, resultsPerPage, totalPages, totalResults); //construct page buttons for search results
    pageNumberDiv.innerHTML = btnHTML;          //add button html to page
    pageNumberDivBot.innerHTML = btnHTML;

    let resultsPerPageDiv = document.getElementById('resultsPerPage');            
    if(totalResults != 0){
    let resultsPerPageHTML = createResultsPerPageHTML(resultsPerPage);
    resultsPerPageDiv.innerHTML = resultsPerPageHTML;
    } else resultsPerPageDiv.innerHTML = '';
    resultsPerPageDiv.addEventListener("click", (event) => {
        let clicked = event.target;
        if(clicked.nodeName === 'A'){
            curPage = 1;
            if(clicked.id == 'All'){
                resultsPerPage = totalResults;
                totalPages = 1;
            } else{
                resultsPerPage = clicked.id;
                totalPages = Math.floor(totalResults / resultsPerPage + 1);
            }
            //reset page results according to selection of results per page
            resultTableHTMLStr = createHTMLTableStr(getTableSelection(), searchResultsArr, curPage, resultsPerPage);
            resultTable.innerHTML = resultTableHTMLStr;     //add html to page
            btnHTML = createSearchPageButtons(curPage, resultsPerPage, totalPages, totalResults); //construct page buttons for search results
            pageNumberDiv.innerHTML = btnHTML;          //add button html to page
            pageNumberDivBot.innerHTML = btnHTML;
            if(totalResults != 0){
            resultsPerPageHTML = createResultsPerPageHTML(clicked.id);
            resultsPerPageDiv.innerHTML = resultsPerPageHTML;
            } else resultsPerPageDiv.innerHTML = '';

        } 
    });

    //create event listener for buttons
    pageNumberDiv.addEventListener("click", (event) => {                
        let btnClicked = event.target;      //get button clicked
        if(btnClicked.innerText === 'Next'){    //if next button was clicked, increment page number
            curPage++;
        } else if(btnClicked.innerText === 'Previous'){ //if previous button was clicked, decrement page number
            curPage--;
        } else{                             //if page number was clicked, set page to page number
        curPage = btnClicked.innerText;
        }
        if(btnClicked.nodeName === 'BUTTON'){   //make sure that button was clicked, and not "..." text                    
            resultTable.innerHTML = createHTMLTableStr(getTableSelection(), searchResultsArr, curPage, resultsPerPage);
            btnHTML = createSearchPageButtons(curPage, resultsPerPage, totalPages, totalResults);
            pageNumberDivBot.innerHTML = btnHTML;
            pageNumberDiv.innerHTML = btnHTML;
        }
    });
    //TODO: remove so that there is only one listener for both page buttons
    pageNumberDivBot.addEventListener("click", (event) => {                
        let btnClicked = event.target;      //get button clicked
        if(btnClicked.innerText === 'Next'){    //if next button was clicked, increment page number
            curPage++;
        } else if(btnClicked.innerText === 'Previous'){ //if previous button was clicked, decrement page number
            curPage--;
        } else{                             //if page number was clicked, set page to page number
        curPage = btnClicked.innerText;
        }
        if(btnClicked.nodeName === 'BUTTON'){   //make sure that button was clicked, and not "..." text
            //create table string according to which one is being searched
            resultTableHTMLStr = createHTMLTableStr(tableSelection, searchResultsArr, curPage, resultsPerPage);
            resultTable.innerHTML = resultTableHTMLStr;
            btnHTML = createSearchPageButtons(curPage, resultsPerPage, totalPages, totalResults);
            pageNumberDiv.innerHTML = btnHTML;
            pageNumberDivBot.innerHTML = btnHTML;
            window.scrollTo(0, 130);                    //scroll to top of page
        }
    });

    resultTable.ondblclick = function(event){
        console.log("modal");
        let cell = event.target;     //get cell that was clicked
        if(cell.nodeName !== "TH" && cell.id !== "id"){     //if cell clicked is not table header and not the id column
            let row = cell.parentElement,        //table row element of cell clicked
                modalForm = document.getElementById("modalForm"),   //div that will contain form
                formHTML;   //html containing form that will be displayed in modal
            //TODO set up so that form is displaying lines properly
            //construct modal form depending on what table is being viewed
            formHTML = getFormHTML(row);
            modalForm.innerHTML = formHTML;
            let selected = matchClicked(document.getElementById('tableUpdateForm').childNodes, cell);
            let modal = document.getElementById("myModal");         
            let span = document.getElementsByClassName("close")[0];           
            modal.style.display = "block";// Get the <span> element that closes the modal
            let updateBtn = document.getElementById('updateRow');
            selected.focus();
            updateBtn.addEventListener("click", (event) => {
                event.preventDefault();
                //get string of search parameters
                let modalForm = document.getElementById("tableUpdateForm");
                let searchParams = getSearchParams(modalForm);
                let xhr = new XMLHttpRequest();
                let url = 'http://localhost:8080/' + getTableSelection() + '?' + getSearchParams();
                console.log(url);
                xhr.open('POST', url, true);
                xhr.send();
                xhr.onload = function(){
                    let updatedRowData = JSON.parse(request.responseText),
                        updatedRowHTML = createTableRow(getTableSelection(), updatedRowData);
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
                let searchParams = getSearchParams(modalForm);
                let xhr = new XMLHttpRequest();
                let url = 'http://localhost:8080/' + getTableSelection() + '?' + getSearchParams();
                console.log(url);
                xhr.open('DELETE', url, true);
                xhr.send();
                xhr.onload = function(){
                    row.innerHTML = ""; 
                    modal.style.display = "none";
                    alert('Source with ID ' + rowID + ' deleted.')
                }


            }); 
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }
            
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
            }

            //make it so that hitting escape will close modal
            document.onkeydown = function(event) {
                event = event || window.event;
                if (event.keyCode == 27) {
                    modal.style.display = "none";
                }
            };
        }
    }

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

//get URI search param string from form
function getSearchParams(){
    let formData = new FormData(document.forms[0]);  //get data input from form
    let searchObj = new URLSearchParams(formData);  //search param object
    let params = searchObj.toString();       //get string of search parameters
    return params;
}

function requestSuccessful(requestStatus){
    return requestStatus == 200;
}

//construct string with HTML for source table results
//sources - array of source objects constructed from XHRResponse
//pageNum - current page of search results being viewed
//resultsPerPage - results displayed on each page of search results
function createSourceTableStr(sources, pageNum, resultsPerPage){
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
                    '<td id="id"><a href="http://localhost:8080/getSources?id=' + sources[index].id +'">' + sources[index].id + '</a></td>' +
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
function createEntryTableStr(entries, pageNum, resultsPerPage){
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
function createCollectionTableStr(collections, pageNum, resultsPerPage){
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

//construct buttons that allow user to select search result page
function createSearchPageButtons(curPage, resultsPerPage, totalPages, totalResults){ 
    if(totalResults == 0){
        return '<b>No results found...<b><br><br>'
    }
    if(totalPages == 1){
        if(totalResults === 1){
            return '<b>Displaying ' + totalResults + ' result...</b><br><br>';
        }
        return '<b>Displaying ' + totalResults + ' results...</b><br><br>';
    }
    let btnHTMLStr,             //string that will hold html output for buttons
        lowerBound = curPage,   //first button to be created (after 1, which is always created)
        upperBound = curPage,   //last button to be created (before last page, which is always created)
        btnsTallied = 0,        //current tally of buttons that will be created
        startReached = curPage > 2 ? false : true,  //determine if curpage is 2nd page or later
        endReached = curPage < totalPages - 1 ? false : true,   //determine if curpage is 2nd to last page or earlier
        maxButtons = 8;
    
    //determine range of buttons to create
    while((!startReached || !endReached)){    //while neither start nor end pages have been reached,
                                                                            //and all buttons have not been created
        if(!startReached){          //while lower bound has not hit beginning page
            lowerBound--;           //decrement lower bound
            btnsTallied++;
            startReached = lowerBound > 2 ? false : true    //determine if beginning page has been reached after decrementation
            if(btnsTallied === maxButtons) break;           //always end if max buttons reached
        }
        if(!endReached){            //while upper bound has not reached end page
            upperBound++;           //increment upper bound
            btnsTallied++;
            endReached = upperBound < totalPages - 1 ? false : true;    //determine if end page has been reached after incrementation
            if(btnsTallied === maxButtons) break;           //always end if max buttons reached
        }
        
    }

    //create search page buttons
    if(curPage == 1){   //if current page is first page, disable first page button and previous button
        btnHTMLStr = '<button class="pageBtns curPage" disabled>Previous</button>' + 
                    '<button class="pageBtns curPage" disabled>1</button>';    
    } else{         //if current page not first page, add as normal buttons
        btnHTMLStr = '<button class="pageBtns">Previous</button>' +                                    
                    '<button class="pageBtns">1</button>';
        if(lowerBound > 2){     //if there is gap between first button and core buttons
            btnHTMLStr += '...';    //add dots
        }
    }
    //create inner buttons
    for(let pageNum = lowerBound; pageNum <= upperBound; pageNum++){
        if(pageNum != 1 && pageNum != totalPages){    //prevent duplicates of first and last page 
            if(pageNum == curPage){         //if current page, disable button
                btnHTMLStr += '<button class="pageBtns curPage" disabled>' + pageNum + '</button>';
            } else{                     //create normal button 
                btnHTMLStr += '<button class="pageBtns">' + pageNum + '</button>';
            }
        }
    }
    //add last page button no matter what
    if(curPage == totalPages){  //if current page is lage page, disable last page and previous page button
        btnHTMLStr +=   '<button class="pageBtns curPage" disabled>' + totalPages + '</button>' + 
        '<button class="pageBtns curPage" disabled>Next</button>';    
    } else{                     //if not last page, add normal page buttons
        if(upperBound < totalPages - 1){     //if there is gap between core buttons and end button
            btnHTMLStr += '...';               //add dots
        }
        btnHTMLStr += '<button id="curPage" class="pageBtns">' + totalPages + '</button>' + 
        '<button >Next</button>';
    } 
    let upperResult = curPage == totalPages ? totalResults : parseInt(curPage * resultsPerPage);    //last result number on current page
    btnHTMLStr += '<br><b>Displaying ' + parseInt((curPage - 1) * resultsPerPage + 1) + '-' + upperResult + ' of ' + totalResults + ' results...</b><br><br>';
    return btnHTMLStr;
}

//generate links that allow user to select results per page
function createResultsPerPageHTML(curResultsPerPage){
    let resultsPerPageHTML = 'Results Per Page: ',
        resultsPerPageOptions = ['All', 500, 100, 25];      //possible selections for results per page
    for(const resultsOption of resultsPerPageOptions){
        if(curResultsPerPage == resultsOption){             //if current selection
            resultsPerPageHTML += resultsOption + '  ';     //add only text with no hyperlink
        } else{                                             //otherwise construct text with hyperlink
            resultsPerPageHTML += '<a href="javascript:void(null);" id="' + resultsOption + '" class="resultsPerPageLinks">' + resultsOption + '</a>    '
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
    return '<td id="id"><a href="http://localhost:8080/getSources?id=' + jsonSource.id +'">' + jsonSource.id + '</a></td>' +
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

function createHTMLTableStr(tableSelection, searchResultsArr, curPage, resultsPerPage){
    switch(tableSelection){         //create table string according to which one is being searched
        case "sources":
            return createSourceTableStr(searchResultsArr, curPage, resultsPerPage);
        case "entries":
            return createEntryTableStr(searchResultsArr, curPage, resultsPerPage);
        case "collections":
            return createCollectionTableStr(searchResultsArr, curPage, resultsPerPage);
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