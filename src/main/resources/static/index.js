import { getFieldCheckboxesHTML } from "./js/html/FieldCheckboxes.js";
import { getAdvancedSearchHTML } from "./js/html/AdvancedSearch.js";
import { getEditFormHTML } from "./js/html/EditForm.js"; 
import { getResultTableHTML, getTableRowHTML } from "./js/html/ResultTable.js"; 
import { getPageBtnsHTML } from "./js/html/PageButtons.js";
import { getSortByColumnProps } from "./js/functions/SortByColumn.js";
import { getResultsMessage } from "./js/html/SearchResultsMessage.js";
import { getResultsPerPageSelectorHTML } from "./js/html/ResultsPerPageSelector.js";
import { getSingleView } from "./js/html/SingleView.js";

console.log(location);

////table selection messed up because not initiating when doing advanced search

const webHostURL = "http://localhost:8080";
const domainURL = "http://localhost:8080";

// const webHostURL = "http://ec2-3-128-55-111.us-east-2.compute.amazonaws.com";
// const domainURL = "http://musicinventoryapp.com";

const tableButtons = document.getElementById('table-select');    
const fieldDiv = document.getElementById('field-select');
const searchBtn = document.getElementById('submit-search');
const modal = document.getElementById("editor-modal");     
const pageBtnDiv = document.getElementById('page-buttons');
const pageBtnDivBot = document.getElementById('page-buttons-bottom');
const searchResultsDiv = document.getElementById('search-results');
const searchForm = document.getElementById('search-form');
const modalForm = document.getElementById("editor-modal-form");
const resultsMessage = document.getElementById("results-message");     
const resultsPerPageDiv = document.getElementById('results-per-page');
const advancedSearchInput = document.getElementById('advanced-search-input'); 
const advancedSearchToggle = document.getElementById('advanced-search-toggle'); 
const marginHackTopDiv = document.getElementById('margin-hack-top');
const marginHackBotDiv = document.getElementById('margin-hack-bot');
const searchPropertiesDiv = document.getElementById('search-properties');

//TODO make this better
let searchProperties;
let searchResultsData = [];

document.addEventListener("DOMContentLoaded", () => {
    searchProperties = { dataType: getTableSelection() };
    insertFieldCheckboxes();        //for default table selection
    initializeEventListeners();
});

function insertFieldCheckboxes(){
    fieldDiv.innerHTML = getFieldCheckboxesHTML(getTableSelection()); //display fields for that element
}

function initializeEventListeners(){
    //event listener that generates fieldSelect div containing buttons corresponding to fields within table
    tableButtons.addEventListener("click", handleTableSelect);
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
    // searchResultsDiv.ondblclick = openSingleView;
    searchResultsDiv.addEventListener("click", handleTableClick);
    advancedSearchToggle.addEventListener("click", toggleAdvancedSearch);    
}

function handleTableSelect(){
    
    closeAdvancedSearch();
    updateDataType();
    //TODO check to see if advanced search is open then make it so advanced search stays open if it is
    insertFieldCheckboxes();
    
}

function closeAdvancedSearch(){
    let arrow = advancedSearchToggle.getElementsByTagName("I")[0];
    arrow.classList.remove('up-arrow');
    arrow.classList.remove('btn-text__up-arrow');
    arrow.classList.add('down-arrow');  
    arrow.classList.add('btn-text__down-arrow');  
    advancedSearchInput.innerHTML = '';
    advancedSearchToggle.childNodes[0].nodeValue = 'Open Advanced Search'; //change inner text without affecting nodes
}

function updateDataType(){
    searchProperties.dataType = getTableSelection();
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
    insertMarginHacks();
    insertSearchPropertiesDivStyle();
    searchResultsDiv.style.overflow = 'auto';

}

function getTableSelection(){
    //determine which table radio button is selected
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
        this.sortBy = {column: 'collection', order: 'ascending'}    //determines how to sort result data in table
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
        window.scrollTo(0, 130);     //to be changed to target instead of scroll
    }
}

//inserts links that allow user to select desired results per page
function insertResultsPerPageSelector(){       
    if(searchProperties.totalResults !== 0){
        resultsPerPageDiv.innerHTML = getResultsPerPageSelectorHTML(searchProperties);
    } else resultsPerPageDiv.innerHTML = '';
}

function isMagnifyBtn(cellClicked) {
    //the USE or SVG element can each be triggered when magnify button is clicked
    return cellClicked.classList.value.indexOf("btn-magnify") !== -1 ||         //SVG magnify button element triggered
        cellClicked.parentElement.classList.value.indexOf("btn-magnify") !== -1;    //USE element within SVG element triggered
}

function openSingleView(event) {
    console.log('getting single-view');
    let cellClicked = getTableCellClicked(event.target);
    let tableRow = cellClicked.parentElement;
    modalForm.innerHTML = getSingleView(searchProperties.dataType, getRowData(tableRow));  
    openModal();
    addModalEventListeners(cellClicked, false);
}

function insertMarginHacks(){
    marginHackTopDiv.innerHTML = '&nbsp;';
    marginHackBotDiv.innerHTML = '&nbsp;';
}

function insertSearchPropertiesDivStyle(){
    searchPropertiesDiv.style.display = 'flex';
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
    let cellClicked = getTableCellClicked(event.target);
    if(isEditableCell(cellClicked)){     //if cell clicked is not table header and not the id column
        constructModal(cellClicked);
        openModal();
        focusSelectedField(cellClicked);
        addModalEventListeners(cellClicked, true);
    }
}

function getTableCellClicked(element){
    let nodeName = element.nodeName;
    if(nodeName === 'PRE' || nodeName === 'svg'){ //some cells have PRE or SVG elements within, in which case parent cell must be returned
        return element.parentElement;
    } else if(nodeName === 'use') {
         //USE elements contained within SVG elements which are contained within table cell, so table cell is two elements above
        return element.parentElement.parentElement;
    } else return element;
}

//makes sure that cell clicked in table is not part of header and is not database ID
function isEditableCell(cellClicked){
    return cellClicked.nodeName == "TD" && cellClicked.id !== "expand";
}

function constructModal(cellClicked){
    let tableRow = cellClicked.parentElement;
    modalForm.innerHTML = getEditFormHTML(searchProperties.dataType, getRowData(tableRow));    
}

function getRowData(row){
    return searchResultsData.find( data => data.id === parseInt(row.id));
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

function addModalEventListeners(cellClicked, isEditorModal){    
    if(isEditorModal){
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
    if(advancedSearchClosed(event.target)){
        openAdvancedSearch();
    } else{
        closeAdvancedSearch();
        insertFieldCheckboxes(searchProperties.dataType);
    }
}

function advancedSearchClosed(target){
    //presence of downward arrow indicates that advanced search is closed
    if(arrowClicked(target)) {
        return target.className.indexOf('down-arrow') !== -1;
    }
    //when text clicked ...
    return getArrowElement(target).className.indexOf('down-arrow') !== -1;
}

function arrowClicked(target) {
    return target.nodeName === ('I');   // I element indicates arrow
}

function getArrowElement(target) {
    return target.getElementsByTagName('I')[0];
}

function openAdvancedSearch(){
    //reverse arrow type
    let arrow = advancedSearchToggle.getElementsByTagName("I")[0];
    arrow.classList.remove('down-arrow');
    arrow.classList.remove('btn-text__down-arrow');
    arrow.classList.add('up-arrow');
    arrow.classList.add('btn-text__up-arrow');
    //remove field select div
    fieldDiv.innerHTML = '';
    advancedSearchToggle.childNodes[0].nodeValue = 'Close Advanced Search';    //change text without affecting nodes
    advancedSearchInput.innerHTML = getAdvancedSearchHTML(searchProperties.dataType);
}

function handleTableClick(event){
    let cellClicked = event.target;
    if(isTableHeaderText(cellClicked)){  
        sortByColumn(cellClicked);
    } else if(isMagnifyBtn(cellClicked)){
        openSingleView(event);
    }
}

function isTableHeaderText(clicked){
    return clicked.parentElement.nodeName === 'TH';
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

