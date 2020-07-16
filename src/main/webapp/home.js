/**
 * 
 */
console.log("updated1");


let tables = document.getElementById("tableSelect");
tables.addEventListener("click", (event) => {
    let target = event.target;
    console.log("selected");
    switch(target.value){
        case "collections":
            console.log('collections');
            break;
        case "sources":
            console.log('sources');
            break;

        case "entries":
            console.log("entries");
            break;
    }
});

//"Get Sources" button that displays all sources upon click
let srcBtn = document.getElementById('getSrcBtn');
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


    }
    
});

//event listener for submit 
let searchBtn = document.getElementById('submitSearch');
searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("clicked");
    let searchParams = getSearchParams(document.forms[0]);       //get string of search parameters
    console.log(searchParams);    
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:8080/search?' + searchParams;
    console.log(url);
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function(){     

        console.log(this.status);
        if(this.status === 200){ 

            let sourceTabelStr = createSourceTableStr(this.responseText);
            let resultDiv = document.getElementById('resultTable');
            resultTable.innerHTML = sourceTabelStr;
            //event listener for search result table
            let resultTable = document.getElementById('table');
            resultTable.addEventListener("click", (event) => {

                 let cell = event.target;
                if(cell.nodeName !== "TH" && cell.id !== "id"){

                    cell.setAttribute("contenteditable", true);
                    console.log('editable');
                }
            });
        }
    }
        
});



function getSearchParams(form){
    let formData = new FormData(form);  //get data input from form
    let searchObj = new URLSearchParams(formData);  //search param object
    let params = searchObj.toString();       //get string of search parameters
    return params;
}

function createSourceTableStr(xhrResponseText){                     
    let sources = JSON.parse(xhrResponseText);
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
    for(const index in sources){
        output += 
            '<tr>' +
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

function createEntryTableStr(xhrResponseText){                     
    let entries = JSON.parse(xhrResponseText);
    entries = entries.sort((a, b) => {
        return a.id - b.id;
    });
    console.log(entries[0].id);
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
    for(const index in entries){
        output += '<tr>' +
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
