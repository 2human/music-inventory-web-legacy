import { getFieldCheckboxesHTML } from "./js/html/FieldCheckboxes.js";
import { getAdvancedSearchHTML } from "./js/html/AdvancedSearch.js";
import { getEditFormHTML, getDeletePromptHTML, getEditFormBtnHTML } from "./js/html/EditRowForm.js"; 
import { getResultTableHTML, getTableRowHTML } from "./js/html/ResultTable.js"; 
import { getPageBtnsHTML } from "./js/html/PageButtons.js";
import { getSortByColumnProps } from "./js/functions/SortByColumn.js";
import { getResultsMessage } from "./js/html/SearchResultsMessage.js";
import { getResultsPerPageSelectorHTML } from "./js/html/ResultsPerPageSelector.js";
import { getSingleView } from "./js/html/ViewRow.js";
import { getCreateRowFormHTML } from "./js/html/CreateRowForm.js";

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
const modalContentDiv = document.getElementById("modal-content");
const resultsMessage = document.getElementById("results-message");     
const resultsPerPageDiv = document.getElementById('results-per-page');
const advancedSearchInput = document.getElementById('advanced-search-input'); 
const advancedSearchToggle = document.getElementById('advanced-search-toggle'); 
const marginHackTopDiv = document.getElementById('margin-hack-top');
const marginHackBotDiv = document.getElementById('margin-hack-bot');
const searchPropertiesDiv = document.getElementById('search-properties');
const createCollectionBtn = document.getElementById('create-collection');
const createSourceBtn = document.getElementById('create-source');
const createEntryBtn = document.getElementById('create-entry');

//TODO make this better
let searchProperties;
let searchResultsData = [];
let xhr;

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
    createCollectionBtn.addEventListener("click", event => openCreateRowModal(event, 'collections'));
    createSourceBtn.addEventListener("click", event => openCreateRowModal(event, 'sources'));
    createEntryBtn.addEventListener("click", event => openCreateRowModal(event, 'entries'));
}

function handleTableSelect(){    
    updateDataType();
    closeAdvancedSearch();
    //TODO check to see if advanced search is open then make it so advanced search stays open if it is
    insertFieldCheckboxes();    
}

//update search properties data type based on current field selection
function updateDataType(){
    searchProperties.dataType = getTableSelection();
}

function closeAdvancedSearch(){
    let arrow = advancedSearchToggle.getElementsByTagName("I")[0];
    //change direction of arrow
    arrow.classList.remove('up-arrow');
    arrow.classList.remove('btn-text__up-arrow');
    arrow.classList.add('down-arrow');  
    arrow.classList.add('btn-text__down-arrow');  
    //remove advanced search form
    advancedSearchInput.innerHTML = '';
    //change text of advanced search toggle
    advancedSearchToggle.childNodes[0].nodeValue = 'Open Advanced Search'; //change inner text without affecting nodes
}

function executeSearch(event){  
    event.preventDefault();

    const dataType = getTableSelection();
    
    clearSearchResultSection();
    insertLoadingSpinner(searchResultsDiv);

    if(xhr) {
        xhr.abort(); //abandon requests in progress
    }
    xhr = new XMLHttpRequest();
    console.log(getHTTPRequestURL(searchForm, dataType));;
    xhr.open('GET', getHTTPRequestURL(searchForm, dataType), true);
    xhr.send();

    xhr.onload = function(){     
        let request = this;
        if(requestSuccessful(request.status)){     
            searchResultsData = JSON.parse(request.responseText);
            generateSearchResultsDisplay(dataType);
        } else {                 
            displaySearchErrorMessage();
        }
    }

    xhr.onerror = () => {        
        displaySearchErrorMessage();
    }
}

function insertLoadingSpinner(element) {    
    element.innerHTML = getSpinnerHTML();
}

function getSpinnerHTML() {
    return '<div class="spinner__container"><div class="spinner__animation"/></div>';
}

function clearSearchResultSection() {    
    searchResultsDiv.innerHTML = '';
    pageBtnDiv.innerHTML = '';          //add button html to page
    pageBtnDivBot.innerHTML = '';
    resultsMessage.innerHTML = '';
    resultsPerPageDiv.innerHTML = '';
}

//TODO this has to be fixed so that it goes by domain name
//generate request url with search params and table selection
function getHTTPRequestURL(form, dataType){    
    return webHostURL + "/" + dataType + '?' + getSearchParams(form);
}

//get URI search param string from form
function getSearchParams(form){
    let formData = new FormData(form);  //get data input from form
    let searchObj = new URLSearchParams(formData);  //search param object
    let params = searchObj.toString();       //get string of search parameters
    return params;
}

function generateSearchResultsDisplay(dataType){
    initializeSearchProperties(dataType, searchResultsData);    
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
        this.totalPages = Math.ceil(this.totalResults / this.resultsPerPage),
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
    let cellClicked = getTableCellClicked(event.target);
    let tableRow = cellClicked.parentElement;
    modalContentDiv.innerHTML = getSingleView(searchProperties.dataType, getRowData(tableRow));  
    openModal();
    addModalEventListeners(cellClicked);
}

//creates proper spacing within search results div, allowing result div not to appear before a search is executed
function insertMarginHacks(){
    marginHackTopDiv.innerHTML = '&nbsp;';
    marginHackBotDiv.innerHTML = '&nbsp;';
}

function insertSearchPropertiesDivStyle(){
    searchPropertiesDiv.style.display = 'flex';
}

function displaySearchErrorMessage() {
    clearSearchResultSection();      
    insertMarginHacks();
    resultsMessage.innerHTML = "There was an error with your search. Please check your connection and try again."
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
        constructEditorModal(cellClicked);
        openModal();
        focusSelectedField(cellClicked);
        addEditFormEventListeners(cellClicked);
        addModalEventListeners();
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

function constructEditorModal(cellClicked){
    let tableRow = cellClicked.parentElement;
    modalContentDiv.innerHTML = getEditFormHTML(searchProperties.dataType, getRowData(tableRow));    
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
    return Array.from(getEditRowForm().childNodes).find( row => row.id === clickedId) || null;
}

function getEditRowForm() {
    return document.getElementById('edit-row-form');
}

function addEditFormEventListeners(cellClicked) {
    const tableRow = cellClicked.parentElement;        //table row element of cell clicked
    const updateBtn = document.getElementById('updateRow'); 
    const deleteBtn = document.getElementById("deleteRow");
    updateBtn.addEventListener("click", event => updateTableRow(event, tableRow)); 
    deleteBtn.addEventListener("click", () => showDeleteRowPrompt(tableRow)); 
    const closeModalBtn = document.getElementById("closeModal");       // Get the <span> element that closes the modal 
    //clicking x will close modal
    closeModalBtn.onclick = function() {
        closeModal();
    }    
}

function addModalEventListeners(){    
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
    const modalMessageDiv = document.getElementById('modal-message');
    insertMiniLoadingSpinner(modalMessageDiv);
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', getHTTPRequestURL(getEditRowForm(), getTableSelection()), true);
    console.log(getHTTPRequestURL(getEditRowForm(), getTableSelection()));
    xhr.onload = function(){
        let request = this;
        if(requestSuccessful(request.status)) {
            let updatedRowData = JSON.parse(request.responseText);
            //update data array then insert data into table row
            updateSearchResultsData(updatedRowData);
            updateSearchResultsDisplay(tableRow, updatedRowData);
            closeModal();
        } else {
            displayUpdateRowErrorMessage(modalMessageDiv);
        }
    };
    xhr.onerror = () => {
        displayUpdateRowErrorMessage(modalMessageDiv);
    };
    xhr.send();
}

//update data array with new data instead of making new http request
function updateSearchResultsData(updatedRowData){
    searchResultsData[searchResultsData.findIndex( data => data.id === updatedRowData.id)] = updatedRowData;
}

//updated data being displayed
function updateSearchResultsDisplay(tableRow, updatedRowData){
    tableRow.innerHTML = getTableRowHTML(searchProperties.dataType, updatedRowData, domainURL)
}

function displayUpdateRowErrorMessage(messageDiv) {
    messageDiv.innerHTML = 'There was an error updating this row. Please check your connection and try again.';
}

//prompts user before deleting table row
function showDeleteRowPrompt(tableRow) {
    const actionDiv = document.getElementById('modal-action-div');
    actionDiv.innerHTML = getDeletePromptHTML();
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    confirmDeleteBtn.addEventListener("click", event => deleteTableRow(event, tableRow));
    cancelDeleteBtn.addEventListener("click", () => hideDeleteRowPrompt(actionDiv, tableRow));
}

//delete row currently being viewed in edit form
function deleteTableRow(event, tableRow){ 
    event.preventDefault();

    const modalMessageDiv = document.getElementById('modal-message');
    insertMiniLoadingSpinner(modalMessageDiv);

    let xhr = new XMLHttpRequest();
    console.log(getHTTPRequestURL(getEditRowForm(), getTableSelection()));
    xhr.open('DELETE', getHTTPRequestURL(getEditRowForm(), getTableSelection()), true);
    xhr.send();
    xhr.onload = function(){
        if(requestSuccessful(this.status)) {
            alert('Row successfully deleted.');
            tableRow.innerHTML = ""; 
            closeModal();
        } else {
            displayDeleteRowErrorMessage(modalMessageDiv);
        }
    };

    xhr.onerror = () => {
        displayDeleteRowErrorMessage(modalMessageDiv);
    };
}

function displayDeleteRowErrorMessage(messageDiv) {
    messageDiv.innerHTML = 'There was an error deleting this row. Please check your connection and try again.'
}

//restores default buttons when user chooses not to delete row
function hideDeleteRowPrompt(actionDiv, tableRow){
    actionDiv.innerHTML = getEditFormBtnHTML();    
    const updateBtn = document.getElementById('updateRow'); 
    const deleteBtn = document.getElementById("deleteRow");
    updateBtn.addEventListener("click", event => updateTableRow(event, tableRow)); 
    deleteBtn.addEventListener("click", () => showDeleteRowPrompt(tableRow)); 
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

function openCreateRowModal(event, dataType) {
    event.preventDefault();
    constructCreateRowModal(dataType);
    openModal();
    addCreateRowEventListeners(dataType);
    addModalEventListeners();    
}

function constructCreateRowModal(dataType) {
    modalContentDiv.innerHTML = getCreateRowFormHTML(dataType);
}

function addCreateRowEventListeners(dataType) {
    const createRowBtn = document.getElementById('create-form-submit');
    const clearFormBtn = document.getElementById("create-form-clear");
    createRowBtn.addEventListener("click", event => createTableRow(event, dataType)); 
    clearFormBtn.addEventListener("click", () => clearCreateRowForm(dataType)); 
    const closeModalBtn = document.getElementById("closeModal");       // Get the <span> element that closes the modal 
    //clicking x will close modal
    closeModalBtn.onclick = function() {
        closeModal();
    }   
}

function createTableRow(event, dataType) {
    event.preventDefault();
    const modalMessageDiv = document.getElementById('modal-message');
    insertMiniLoadingSpinner(modalMessageDiv);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', getHTTPRequestURL(getCreateRowForm(), dataType), true);
    console.log(getHTTPRequestURL(getCreateRowForm(), dataType));
    console.log('creating');
    xhr.onload = function(){
        if(requestSuccessful(this.status)) {
            displayCreateRowSucces(modalMessageDiv);
        } else {
            displayCreateRowErrorMessage(modalMessageDiv);
        }
    };

    xhr.onerror = function(){
        displayCreateRowErrorMessage(modalMessageDiv);
    };

    xhr.send();
}    

function insertMiniLoadingSpinner(element) {    
    element.innerHTML = getMiniSpinnerHTML();
}

function getMiniSpinnerHTML() {
    return '<div class="spinner__animation spinner__animation--mini"/>';
}

function displayCreateRowSucces(messageDiv) {
    messageDiv.innerHTML = 'Row create successfully.'
}

function displayCreateRowErrorMessage(messageDiv) {
    messageDiv.innerHTML = 'There was an error creating a new row. Please check your connection and try again.';
}

function getCreateRowForm() {
    return document.getElementById('create-row-form');
}

function clearCreateRowForm(dataType) {
    constructCreateRowModal(dataType);
    addCreateRowEventListeners(dataType);
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

