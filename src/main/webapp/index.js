// import { isArrow } from "./js/test.js";
import { getFieldCheckboxesHTML } from "./js/html/Checkbox.js";
import { getAdvancedSearchHTML } from "./js/html/AdvancedSearch.js";
import { getModalFormHTML } from "./js/html/ModalForm.js"; 
import { getResultTableHTML, getTableRowHTML } from "./js/html/ResultTable.js"; 
import { getPageBtnsHTML } from "./js/html/PageButtons.js";
import { getSortByColumnProps } from "./js/functions/SortByColumn.js";
import { getResultsMessage } from "./js/html/SearchResultsMessage.js";
import { getResultsPerPageSelectorHTML } from "./js/html/ResultsPerPageSelector.js";


const webHostURL = "http://localhost:8080";
const domainURL = "http://localhost:8080";

// const webHostURL = "http://ec2-3-128-55-111.us-east-2.compute.amazonaws.com";
// const domainURL = "http://www.sacredmusicinventory.org"

const tableButtons = document.getElementById('tableSelect');    
const fieldDiv = document.getElementById('fieldSelect');
const searchBtn = document.getElementById('submitSearch');
const modal = document.getElementById("myModal");     
const pageBtnDiv = document.getElementById('pageBtns');
const pageBtnDivBot = document.getElementById('pageBtnsBot');
const searchResultsDiv = document.getElementById('searchResultsDiv');
const searchForm = document.getElementById('search');
const modalForm = document.getElementById("modalForm");
const resultsMessage = document.getElementById("resultsMsg");     
const resultsPerPageDiv = document.getElementById('resultsPerPage');    
const advancedSearchInput = document.getElementById('advancedSearchInput');
const advancedSearchToggle = document.getElementById('advancedSearchArrow');

let searchProperties;
let searchResultsData = [];

insertFieldCheckboxes();        //insert field checkboxes for default table selection
initializeEventListeners();

function insertFieldCheckboxes(){
    fieldDiv.innerHTML = getFieldCheckboxesHTML(getTableSelection()); //display fields for that element
}

function initializeEventListeners(){
    //event listener that generates fieldSelect div containing buttons corresponding to fields within table
    tableButtons.addEventListener("click", () => {  closeAdvancedSearch();
                                                    insertFieldCheckboxes();
                                                });
    //event listener / handler for submitting search 
    searchBtn.addEventListener("click", executeSearch);
    //create event listener for buttons
    pageBtnDiv.addEventListener("click", selectResultPage);
    pageBtnDivBot.addEventListener("click", (event) => {
        selectResultPage(event);
        scrollToTop(event);
    });
    resultsPerPageDiv.addEventListener("click", event => setResultsPerPage(event, searchProperties.resultsPerPageOptions));
    searchResultsDiv.ondblclick = openEditorModal;
    searchResultsDiv.addEventListener("click", handleTableClick);
    advancedSearchToggle.addEventListener("click", toggleAdvancedSearch);    
}

function closeAdvancedSearch(){
    advancedSearchToggle.classList.remove('upArrow');
    advancedSearchToggle.classList.add('downArrow');    
    advancedSearchInput.innerHTML = '';
}

function executeSearch(event){  
    event.preventDefault();   
    let xhr = new XMLHttpRequest();
    console.log(getHTTPRequestURL(searchForm));;
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
    return webHostURL + "/" + getTableSelection() + '?' + getSearchParams(form);
}

//get URI search param string from form
function getSearchParams(form){
    let formData = new FormData(form);  //get data input from form
    let searchObj = new URLSearchParams(formData);  //search param object
    let params = searchObj.toString();       //get string of search parameters
    return params;
}

function generateSearchResultsDisplay(){
    initializeSearchProperties(getTableSelection(), searchResultsData);    
    insertSearchResults();
    insertPageButtons();  
    insertResultsMessage();  
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

//contains data for how to format search results.
function initializeSearchProperties(table, data){
    searchProperties = new function(){
        this.curPage = 1,                   //result page currently being viewed
        this.dataType = table,              //data type corresponds to table selection
        this.resultsPerPage = 25,
        this.totalResults = data.length,   
        this.totalPages = Math.floor(this.totalResults / this.resultsPerPage + 1),
        this.resultsPerPageOptions = [10, 25, 100, 500],    //user options for results per pages
        this.sortBy = {column: 'id', order: 'ascending'}    //determines how to sort result data in table
        this.domainURL = domainURL,                         //domain for web app 
        this.webHostURL = webHostURL;                       //direct URL to server
    };
}

function insertSearchResults(){    
    searchResultsDiv.innerHTML = getResultTableHTML(searchProperties, searchResultsData);
}

function insertPageButtons(){
    let btnHTML = '';                   //no buttons by default
    if(searchProperties.totalPages > 1){
        btnHTML = getPageBtnsHTML(searchProperties); //construct page buttons for search results        
    }
    pageBtnDiv.innerHTML = btnHTML;          //add button html to page
    pageBtnDivBot.innerHTML = btnHTML;
}

//insert messaging displaying total results, and range of results being displayed
function insertResultsMessage(){
    resultsMessage.innerHTML = getResultsMessage(searchProperties);
}

//TODO change name and put scroll to within if
function scrollToTop(event){  
    if(event.target.nodeName === 'BUTTON'){ //only scroll to top if button was clicked, not random part of div
        window.scrollTo(0, 130);
    }
}

//inserts links that allow user to select desired results per page
function insertResultsPerPageSelector(){       
    if(searchProperties.totalResults !== 0){
        resultsPerPageDiv.innerHTML = getResultsPerPageSelectorHTML(searchProperties);
    } else resultsPerPageDiv.innerHTML = '';
}

function setResultsPerPage(event){
    let clicked = event.target;
    if(clicked.className === 'resultsPerPageLink'){ //make sure link was clicked and not random part of page
        let resultsPerPage = clicked.id;
        searchProperties.curPage = 1;
        if(resultsPerPage == 'All'){
            searchProperties.resultsPerPage = searchProperties.totalResults;
            searchProperties.totalPages = 1;
        } else{
            searchProperties.resultsPerPage = resultsPerPage;
            searchProperties.totalPages = Math.floor(searchProperties.totalResults / searchProperties.resultsPerPage + 1);
        }
        searchResultsDiv.innerHTML = getResultTableHTML(searchProperties, searchResultsData);
        insertPageButtons(searchProperties);
        insertResultsMessage();
        insertResultsPerPageSelector();
    } 
}

function openEditorModal(event){
    let cellClicked = getCellClicked(event.target);
    if(isEditableCell(cellClicked)){     //if cell clicked is not table header and not the id column
        constructModal(cellClicked);
        openModal();
        focusSelectedField(cellClicked);
        addModalEventListeners(cellClicked);
    }
}

function getCellClicked(element){
    if(element.nodeName === 'PRE'){ //some cells have pre-divs within, in which case parent cell must be returned
        return element.parentElement;
    }
    else return element;
}

//makes sure that cell clicked in table is not part of header and is not database ID
function isEditableCell(cellClicked){
    return cellClicked.nodeName == "TD" && cellClicked.id !== "id"
}

function constructModal(cellClicked){
    let tableRow = cellClicked.parentElement;
    modalForm.innerHTML = getModalFormHTML(searchProperties.dataType, getRowData(tableRow));     
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
function focusSelectedField(cellClicked){
    getMatchingFormField(cellClicked).focus();  //focus field in form corresponding to field clicked
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

function addModalEventListeners(cellClicked){    
    let updateBtn = document.getElementById('updateRow');
    let tableRow = cellClicked.parentElement;        //table row element of cell clicked
    updateBtn.addEventListener("click", event => updateTableRow(event, tableRow));  
    let deleteBtn = document.getElementById("deleteRow");
    deleteBtn.addEventListener("click", (event) => deleteTableRow(event, tableRow)); 
    let closeModalBtn = document.getElementById("closeModal");       // Get the <span> element that closes the modal 
    //clicking x will close modal
    closeModalBtn.onclick = function() {
        closeModal();
    }    
    //clicking outside of modal content will close modal
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
    //make it so that hitting escape will close modal
    document.onkeydown = function(event) {
        event = event || window.event;
        if (event.key === 'Escape') {
            closeModal();
        }
    };
}

function closeModal(){
    modal.style.display = "none";
}

function updateTableRow(event, tableRow){
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', getHTTPRequestURL(modalForm), true);
    console.log(getHTTPRequestURL(modalForm));
    xhr.send();
    closeModal();
    xhr.onload = function(){
        let request = this;
        let updatedRowData = JSON.parse(request.responseText);
        //update data array then insert data into table row
        updateSearchResultsData(updatedRowData);
        updateSearchResultsDisplay(tableRow, updatedRowData);
    }
}

//update data array with new data instead of making new http request
function updateSearchResultsData(updatedRowData){
    searchResultsData[searchResultsData.findIndex( data => data.id === updatedRowData.id)] = updatedRowData;
}

//updated data being displayed
function updateSearchResultsDisplay(tableRow, updatedRowData){
    tableRow.innerHTML = getTableRowHTML(searchProperties.dataType, updatedRowData, domainURL)
}


function deleteTableRow(event, tableRow){    
    event.preventDefault();
    let xhr = new XMLHttpRequest();
    console.log(getHTTPRequestURL(modalForm));
    xhr.open('DELETE', getHTTPRequestURL(modalForm), true);
    xhr.send();
    xhr.onload = function(){
        let rowID = tableRow.children[0].innerText;
        alert('Source with ID ' + rowID + ' deleted.');
        tableRow.innerHTML = ""; 
        closeModal();
    }
}

//view search results page in response to user clicking resultsPageBtn
function selectResultPage(event){    
    let btnClicked = event.target;      //get button clicked
    if(btnClicked.nodeName === 'BUTTON'){   //make sure that button was clicked, and not "..." text 
        if(btnClicked.innerText === 'Next'){    //if next button was clicked, increment page number
            searchProperties.curPage++;
        } else if(btnClicked.innerText === 'Previous'){ //if previous button was clicked, decrement page number
            searchProperties.curPage--;
        } else{                             //if page number was clicked, set page to page number
        searchProperties.curPage = parseInt(btnClicked.innerText);
        }              
        searchResultsDiv.innerHTML = getResultTableHTML(searchProperties, searchResultsData);
        insertPageButtons(searchProperties);
        insertResultsMessage();
    }
}

function toggleAdvancedSearch(event){
    if(event.target.className === 'downArrow'){
        openAdvancedSearch();
    } else{
        closeAdvancedSearch();
        insertFieldCheckboxes(searchProperties.dataType);
    }
}

function openAdvancedSearch(){
    advancedSearchToggle.classList.remove('downArrow');
    advancedSearchToggle.classList.add('upArrow');
    fieldDiv.innerHTML = '';
    advancedSearchInput.innerHTML = getAdvancedSearchHTML(searchProperties.dataType);
}

function handleTableClick(event){
    if(isTableHeaderText(event.target)){  
        sortByColumn(event.target);
    }
}

function isTableHeaderText(clicked){
    return clicked.className.indexOf('headerText') !== -1;
}

function sortByColumn(elementClicked){
    setSortProps(getSortByColumnProps(searchProperties.sortBy, elementClicked));
    resetPageNumber();
    insertSearchResults();
    insertPageButtons();  
    insertResultsMessage();  
    insertResultsPerPageSelector();
}

function setSortProps(sortByProps){
    searchProperties.sortBy = sortByProps; 
}

function resetPageNumber(){
    searchProperties.curPage = 1;
}

