/**
 * 
 */
//TODO fix buttons so that "hide" no longer shows after table is changed
//TODO change from id's to classes in html

//"Get Sources" button that displays all sources upon click
let srcBtn = document.getElementById('sourceBtn');
srcBtn.addEventListener('click', (event) => {
    if(event.target.innerText === 'Get Sources'){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/sources', true);
        xhr.send();
        xhr.onload = function(){
            console.log(this.status);
            if(this.status === 200){ 
                let sourceTabelStr = createSourceTableStr(this.responseText);
                let resultTable = document.getElementById('resultTable');
                resultTable.innerHTML = sourceTabelStr;
                //Change button so that it will hide sources next time it is clicked
                srcBtn.innerText = 'Hide Sources';                      
            }
        }
        //Hide sources if sources are displayed already
    } else{
        document.getElementById('resultTable').innerHTML = '';
        srcBtn.innerText = 'Get Sources';
    }
});

//set up "Get Entries" button so that all entries are displayed upon click
let entryBtn = document.getElementById('entryBtn');
entryBtn.addEventListener('click', (event) => {
    if(event.target.innerText === 'Get Entries'){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/entries', true);
        xhr.send();
        xhr.onload = function(){
            console.log(this.status);
            if(this.status === 200){ 
                let entryTabelStr = createEntryTableStr(this.responseText);
                let resultTable = document.getElementById('resultTable');
                resultTable.innerHTML = entryTabelStr;
                entryBtn.innerText = 'Hide Entries';                      
            }
        }
    } else{
        document.getElementById('resultTable').innerHTML = '';
        entryBtn.innerText = 'Get Entries';
    }
});

//set up "Get Entries" button so that all entries are displayed upon click
let collectionBtn = document.getElementById('collectionBtn');
collectionBtn.addEventListener('click', (event) => {
    console.log('collection button clicked');
    if(event.target.innerText === 'Get Collections'){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/collections', true);
        xhr.send();
        console.log(this.status);
        xhr.onload = function(){
            console.log(this.status);
            if(this.status === 200){ 
                let collectionTabelStr = createCollectionTableStr(this.responseText);
                let resultTable = document.getElementById('resultTable');
                resultTable.innerHTML = collectionTabelStr;
                collectionBtn.innerText = 'Hide Collections';                      
            }
        }
    } else{
        document.getElementById('resultTable').innerHTML = '';
        collectionBtn.innerText = 'Get Collections';
    }
});

//display checkboxes corresponding to fields of table radio button selection
let tblBtn = document.getElementById('tableSelect');    //div containing buttons that determine which table to search
//event listener that generates fieldSelect div containing buttons corresponding to fields within table
tblBtn.addEventListener("click", (event) =>{            
    console.log('clicked');
    let fieldDiv = document.getElementById('fieldSelect');      //div that contains fields for respective table
               
    //generate fields corresponding to those within sources table 
    switch(event.target.value){
        //source radio button clicked
        case "sources":
            //generate html for checkboxes
            fieldDiv.innerHTML =          'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
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
            fieldDiv.innerHTML =        'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
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
        fieldDiv.innerHTML =     'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
        '<input type="checkbox" name="field" id="collection" value="collection"> Collection ' +
        '<input type="checkbox" name="field" id="description" value="description"> Description';


    }
    
});

//event listener / handler for submitting search 
let searchBtn = document.getElementById('submitSearch');
searchBtn.addEventListener("click", (event) => {
    event.preventDefault();

    //determine which table is going to be searched
    let form = document.getElementById('search');
    let tableSelection = form.elements['table'].value;  //get value of selected table
    //get string of search parameters
    let searchParams = getSearchParams(document.forms[0]);
    console.log(searchParams);
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:8080/' + tableSelection + '?' + searchParams;
    console.log(url);
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function(){     

        console.log(this.status);
        if(this.status === 200){ 
            let resultTableHTMLStr,    //string containing html to display results of search            
                resultTable = document.getElementById('resultTable');
            //construct table based on type of search
            switch(tableSelection){
                case "sources":
                    resultTableHTMLStr = createSourceTableStr(this.responseText);
                    resultTable.innerHTML = resultTableHTMLStr;
                    break;
                case "entries":
                    resultTableHTMLStr = createEntryTableStr(this.responseText);
                    resultTable.innerHTML = resultTableHTMLStr;
                    break;
                case "collections":
                    resultTableHTMLStr = createCollectionTableStr(this.responseText);
                    resultTable.innerHTML = resultTableHTMLStr;
                    break;
            }

            // event listener for search result table which displays edit modal
            resultTable.addEventListener("dblclick", (event) => {
                let cell = event.target;     //get cell that was clicked
                if(cell.nodeName !== "TH" && cell.id !== "id"){     //if cell clicked is not table header and not the id column
                    let row = cell.parentElement,        //table row element of cell clicked
                        modalForm = document.getElementById("modalForm"),   //div that will contain form
                        formHTML;   //html containing form that will be displayed in modal
                    switch(row.className){
                        case "entryRow":
                            formHTML = createEntryFormStr(row);
                            break;
                        case "sourceRow":
                            formHTML = createSourceFormStr(row);
                            break;
                        case "collectionRow":
                            formHTML = createCollectionFormStr(row);
                            break;
                    }
                    modalForm.innerHTML = formHTML;
                    let selected = matchClicked(document.getElementById('tableUpdateForm').childNodes, cell);
                    console.log(selected);
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
                        //TODO get rid of this.
                        let directoryKeyword;
                        switch (tableSelection){
                            case "entries":
                                directoryKeyword = 'Entry';
                                break;
                            case "sources":
                                directoryKeyword = 'Sources';
                                break;
                            case "collections":
                                directoryKeyword = 'Collection';
                                break;
                        }
                        let url = 'http://localhost:8080/update' + directoryKeyword + 'Table?' + searchParams;
                        console.log(url);
                        xhr.open('POST', url, true);
                        xhr.send();
                        xhr.onload = function(){
                            let updatedRowData = JSON.parse(this.responseText),
                                updatedRowHTML;
                            switch(tableSelection){
                                case "entries": 
                                    updatedRowHTML = createEntryRow(updatedRowData);
                                    break;
                                case "sources":
                                    updatedRowHTML = createSourceRow(updatedRowData);
                                    break;
                                case "collections":
                                    updatedRowHTML = createCollectionRow(updatedRowData);
                                    break;

                            }
                            row.innerHTML = updatedRowHTML;                            
                            console.log(updatedRowHTML);
                            modal.style.display = "none";
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
                }
            });
        }
    }        
});


//get URI search param string from form
function getSearchParams(form){
    let formData = new FormData(form);  //get data input from form
    let searchObj = new URLSearchParams(formData);  //search param object
    let params = searchObj.toString();       //get string of search parameters
    return params;
}

//construct string with HTML for source table results
function createSourceTableStr(xhrResponseText){                     
    let sources = JSON.parse(xhrResponseText);
    if(typeof sources[0] === "undefined"){
        return 'No results found...';
    } else{
        sources = sources.sort((a, b) => {
            return a.id - b.id;
        });
        let output = '<div><b>Displaying ' + sources.length + ' results... </b></div><br>' +
            '<table id="table">' + 
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
        for(const index in sources){
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

//construct string containing HTML for Entry table results
function createEntryTableStr(xhrResponseText){                     
    let entries = JSON.parse(xhrResponseText);
    //no results found
    if(typeof entries[0] === "undefined"){
        return 'No results found...';
    } else{         //results found
        entries = entries.sort((a, b) => {
            return a.id - b.id;
        }); 
        console.log(entries[0].id);
        let output = '<div><b>Displaying ' + entries.length + ' results... </b></div><br>' +
            '<table id="table">' + 
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
        for(const index in entries){
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

//create form that pre-fills data from table row
function createCollectionTableStr(xhrResponseText){                     
    let collections = JSON.parse(xhrResponseText);
    if(typeof collections[0] === "undefined"){
        return 'No results found...';
    } else{
        collections = collections.sort((a, b) => {
            return a.id - b.id;
        }); 
        console.log(collections[0].id);
        let output = '<div><b>Displaying ' + collections.length + ' results... </b></div><br>' +
            '<table id="table">' + 
                '<tr class="collectionRow">' +
                    '<th id="id">ID</td>' +
                    '<th id="collection">Collection</td>' +
                    '<th id="description">Description</td>' +
                '</tr>';
        for(const index in collections){
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

//create form that pre-fills data from table row
function createEntryFormStr(row){
    let rowCells = row.children;
    return '<form action="updateEntryTable" id="tableUpdateForm">' +        
        '<label for="Id">Id:</label>' +
        '<input type="text" id="id" name="id" value="' + rowCells[0].innerText + '" readonly><br>' +
        '<label for="collection">Collection:</label>' +
        '<input type="text" id="collection" name="collection" value="' + rowCells[1].innerText + '" onfocus="this.select()"><br>' +
        '<label for="sourceNumber">Source Number:</label>' +
        '<input type="text" id="sourceNumber" name="sourceNumber" value="' + rowCells[2].innerText + '" onfocus="this.select()"><br>' +
        '<label for="location">Location:</label>' +
        '<input type="text" id="location" name="location" value="' + rowCells[3].innerText + '" onfocus="this.select()"><br>' +
        '<label for="title">Title:</label>' +
        '<input type="text" id="title" name="title" value="' + rowCells[4].innerText + '" onfocus="this.select()"><br>' +
        '<label for="credit">Credit:</label>' +
        '<input type="text" id="credit" name="credit" value="' + rowCells[5].innerText + '" onfocus="this.select()"><br>' +
        '<label for="vocalPart">Vocal Part:</label>' +
        '<input type="text" id="vocalPart" name="vocalPart" value="' + rowCells[6].innerText + '" onfocus="this.select()"><br>' +
        '<label for="key">Key:</label>' +
        '<input type="text" id="key" name="key" value="' + rowCells[7].innerText + '" onfocus="this.select()"><br>' +
        '<label for="melodicIncipit">Melodic Incipit:</label>' +
        '<input type="text" id="melodicIncipit" name="melodicIncipit" value="' + rowCells[8].innerText + '" onfocus="this.select()"><br>' +
        '<label for="textIncipit">Text Incipit:</label>' +
        '<input type="text" id="textIncipit" name="textIncipit" value="' + rowCells[9].innerText + '" onfocus="this.select()"><br>' +
        '<label for="isSecular">Secular:</label>' +
        '<input type="text" id="isSecular" name="isSecular" value="' + rowCells[10].innerText + '" onfocus="this.select()"><br>' +
        '<button id="updateRow">Update</button>' +
        '<input type="submit" value="Delete" formaction="deleteEntry">' +
    '</form>';
}

//create form that pre-fills data from table row
function createSourceFormStr(row){
    let rowCells = row.children;
    return '<form action="updateSourcesTable" id="tableUpdateForm">' +        
        '<label for="id">Id:</label>' +
        '<input type="text" id="id" name="id" value="' + rowCells[0].innerText + '" readonly><br>' +
        '<label for="collection">Collection:</label>' +
        '<input type="text" id="collection" name="collection" value="' + rowCells[1].innerText + '" onfocus="this.select()"><br>' +
        '<label for="sourceNumber">Source Number:</label>' +
        '<input type="text" id="sourceNumber" name="sourceNumber" value="' + rowCells[2].innerText + '" onfocus="this.select()"><br>' +
        '<label for="callNumber">Call Number:</label>' +
        '<input type="text" id="callNumber" name="callNumber" value="' + rowCells[3].innerText + '" onfocus="this.select()"><br>' +
        '<label for="author">Author:</label>' +
        '<input type="text" id="author" name="author" value="' + rowCells[4].innerText + '" onfocus="this.select()"><br>' +
        '<label for="title">Title:</label>' +
        '<input type="text" id="title" name="title" value="' + rowCells[5].innerText + '" onfocus="this.select()"><br>' +
        '<label for="inscription">Inscription:</label>' +
        '<textarea inline="text" id="inscription" name="inscription" onfocus="this.select()">' + rowCells[6].innerText + '</textarea><br>' +
        '<label for="description">Description:</label>' +        
        '<textarea inline="text" id="description" name="description" onfocus="this.select()">' + rowCells[7].innerText + '</textarea><br>' +
        '<button id="updateRow">Update</button>' +
        '<input type="submit" value="Delete" formaction="deleteSources">' +
    '</form>';

}

function createCollectionFormStr(row){    
    let rowCells = row.children;
    return '<form action="updateCollectionTable" id="tableUpdateForm">' +
        '<label for="Id">Id:</label>' + 
        '<input type="text" id="id" name="id" value="' + rowCells[0].innerText + '" readonly><br>' + 
        '<label for="collection">Collection:</label>' + 
        '<input type="text" id="collection" name="collection" value="' + rowCells[1].innerText + '" onfocus="this.select()"><br>' + 
        '<label for="description">Description:</label>' + 
        '<textarea th:inline="text" id="description" name="description" onfocus="this.select()">' + rowCells[2].innerText + '</textarea><br>' + 
        '<button id="updateRow">Update</button>' +
        '<input type="submit" value="Delete" formaction="deleteCollection">' + 
    '</form>';
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

