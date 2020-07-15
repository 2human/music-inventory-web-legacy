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
                let srcDiv = document.getElementById('srcs');
                srcDiv.innerHTML = sourceTabelStr;
                srcBtn.innerText = 'Hide Sources';  
                    
            }
        }
    } else{
        document.getElementById('srcs').innerHTML = '';
        srcBtn.innerText = 'Get Sources';
    }
});

let tblBtn = document.getElementById('tableSelect');    //div containing buttons that determine which table to search
//event listener that generates fieldSelect div containing buttons corresponding to fields within table
tblBtn.addEventListener("click", (event) =>{            
    console.log('clicked');
    switch(event.target.value){
        case "sources":           
            //generate fields corresponding to those within sources table 
            let fieldDiv = document.getElementById('fieldSelect');  //div that contains fields
            fieldDiv.innerHTML =          'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
            '<input type="checkbox" name="field" id="collection" value="collection"> Collection ' +
            '<input type="checkbox" name="field" id="sourceNumber" value="sourceNumber"> Source Number ' +
            '<input type="checkbox" name="field" id="callNumber" value="callNumber"> Call Number ' +
            '<input type="checkbox" name="field" id="author" value="author"> Author ' +
            '<input type="checkbox" name="field" id="title" value="title"> Title ' +
            '<input type="checkbox" name="field" id="inscription" value="inscription"> Inscription ' +
            '<input type="checkbox" name="field" id="description" value="description"> Description ';

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
            let srcDiv = document.getElementById('srcs');
            srcDiv.innerHTML = sourceTabelStr;
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
    for(const id in sources){
        output += 
            '<tr>' +
                '<td id="id"><a href="http://localhost:8080/getSources?id=' + sources[id].id +'">' + sources[id].id + '</a></td>' +
                '<td id="collection">' + sources[id].collection + '</td>' +
                '<td id="sourceNumber">' + sources[id].sourceNumber + '</td>' +
                '<td id="callNumber">' + sources[id].callNumber + '</td>' +
                '<td id="author">' + sources[id].author + '</td>' +
                '<td id="title">' + sources[id].title + '</td>' +
                '<td id="inscription" contenteditable="false">' + sources[id].inscription + '</td>' +
                '<td id="description">' + sources[id].description + '</td>' +
            '</tr>';
        }
        output += '</table>';
        return output;
}
