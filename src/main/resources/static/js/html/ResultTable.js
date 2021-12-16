/**
 * 
 * @param {*} searchProperties Object containing data for how to format search results.
 * @param {*} data Search result data.
 * @returns Table containing search results.
 */
export function getResultTableHTML(searchProperties, data){
    if(!data[0]) return '';    //return empty string if data is empty
    return  `
            <table id=${searchProperties.dataType}Table class="table">
                ${getTableColGroupHTML(searchProperties.dataType)}
                ${getTableHeaderHTML(searchProperties)}
                ${getTableBodyHTML(searchProperties, data)}
            </table>
                `;
}

function getTableColGroupHTML(dataType){
    switch(dataType){
        case "entries": 
            return getEntryTableColGroupHTML();
        case "sources":
            return getSourceTableColGroupHTML();
        case "collections":
            return getCollectionTableColGroupHTML();
    }
}

function getEntryTableColGroupHTML(){
    return `
        <colgroup>
            <col class="table__entry-column--id">
            <col class="table__entry-column--collection">
            <col class="table__entry-column--source-number">
            <col class="table__entry-column--location">
            <col class="table__entry-column--title">
            <col class="table__entry-column--composer">
            <col class="table__entry-column--vocal-part">
            <col class="table__entry-column--key">
            <col class="table__entry-column--melodic-incipit">
            <col class="table__entry-column--text-incipit">
            <col class="table__entry-column--is-secular">
            <col class="table__entry-column--notes">
        </colgroup>    
        `;

}

function getSourceTableColGroupHTML(){
    return `
        <colgroup>
            <col class="table__source-column--id">
            <col class="table__source-column--collection">
            <col class="table__source-column--source-number">
            <col class="table__source-column--call-number">
            <col class="table__source-column--author">
            <col class="table__source-column--title">
            <col class="table__source-column--inscriptions">
            <col class="table__source-column--description">
        </colgroup>    
        `;

}


function getCollectionTableColGroupHTML(){
    return `
        <colgroup>
            <col class="table__collection-column--id">
            <col class="table__collection-column--collection">
            <col class="table__collection-column--description">
        </colgroup>    
            `;
}



function getTableHeaderHTML(searchProperties){   
    switch(searchProperties.dataType){
        case "entries": 
            return getEntryTableHeaderHTML(searchProperties);
        case "sources":
            return getSourceTableHeaderHTML(searchProperties);
        case "collections":
            return getCollectionTableHeaderHTML(searchProperties);
    }
}

function getEntryTableHeaderHTML(searchProperties){
    return  `
            <tr id="entriesTableHead">
                <th id="id" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">ID${getArrowIfNeeded('id', searchProperties)}</a></th>
                <th id="collection" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Collection${getArrowIfNeeded('collection', searchProperties)}</a></th>
                <th id="sourceNumber" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Source Number${getArrowIfNeeded('sourceNumber', searchProperties)}</a></th>
                <th id="location" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Location${getArrowIfNeeded('location', searchProperties)}</a></th>
                <th id="title" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Title${getArrowIfNeeded('title', searchProperties)}</a></th>
                <th id="composer" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Composer${getArrowIfNeeded('composer', searchProperties)}</a></th>
                <th id="vocalPart" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Vocal Part${getArrowIfNeeded('vocalPart', searchProperties)}</a></th>
                <th id="key" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Key${getArrowIfNeeded('key', searchProperties)}</a></th>
                <th id="melodicIncipit" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Melodic Incipit${getArrowIfNeeded('melodicIncipit', searchProperties)}</a></th>
                <th id="textIncipit" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Text Incipit${getArrowIfNeeded('textIncipit', searchProperties)}</a></th>
                <th id="isSecular" class="table__header table__entry-cell--is-secular"><a href="javascript:void(0)" class="table__header-text btn-text">Secular${getArrowIfNeeded('isSecular', searchProperties)}</a></th>
                <th id="notes" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Notes${getArrowIfNeeded('notes', searchProperties)}</a></th>
            </tr>
            `;
}

//determine if arrow, which indicates column being sorted, should be inserted
function getArrowIfNeeded(columnName, searchProperties){
    if(sortingByColumn(columnName, searchProperties)){
        if(searchProperties.sortBy.order === 'ascending'){
            return getDownwardArrowHTML();
        } else if(searchProperties.sortBy.order === 'descending'){
            return getUpwardArrowHTML();
        }
    } else{
        return '';
    }    
}

//determine if column is that which data is being sorted by
function sortingByColumn(columnName, searchProperties){
    return columnName === searchProperties.sortBy.column
}

function getDownwardArrowHTML(){
    return '<i class="table__header-text down-arrow btn-text__down-arrow"></i>';
}

function getUpwardArrowHTML(){
    return '<i class="table__header-text up-arrow btn-text__up-arrow"></i>';
}


function getSourceTableHeaderHTML(searchProperties){
    return `<tr id="sourcesTableHead">
                <th id="id" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">ID${getArrowIfNeeded('id', searchProperties)}</a></th>
                <th id="collection" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Collection${getArrowIfNeeded('collection', searchProperties)}</a></th>
                <th id="sourceNumber" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Source Number${getArrowIfNeeded('sourceNumber', searchProperties)}</a></th>
                <th id="callNumber" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Call Number${getArrowIfNeeded('callNumber', searchProperties)}</a></th>
                <th id="author" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Author${getArrowIfNeeded('author', searchProperties)}</a></th>
                <th id="title" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Title${getArrowIfNeeded('title', searchProperties)}</a></th>
                <th id="inscription" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Inscriptions${getArrowIfNeeded('inscription', searchProperties)}</a></th>
                <th id="description" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Description${getArrowIfNeeded('description', searchProperties)}</a></th>
            </tr>`;
}

function getCollectionTableHeaderHTML(searchProperties){
    return `<tr id="collectionsTableHead">
                <th id="id" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">ID${getArrowIfNeeded('id', searchProperties)}</a></th>
                <th id="collection" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Collection${getArrowIfNeeded('collection', searchProperties)}</a></th>
                <th id="description" class="table__header"><a href="javascript:void(0)" class="table__header-text btn-text">Description${getArrowIfNeeded('description', searchProperties)}</a></th>
            </tr>`;
}

function getTableBodyHTML(searchProperties, data){  
    // data.sort((a, b) => a[searchProperties.sortBy] - b[searchProperties.sortBy]);  
    data.sort((a, b) => searchProperties.sortBy.order === 'ascending' ? sortAscending(a, b, searchProperties) :
                                                                         sortDescending(a, b, searchProperties));
    let htmlStr = '';
    //get range of results to display
    let lastResultIndex = searchProperties.curPage * searchProperties.resultsPerPage;
    let firstResultIndex = lastResultIndex - searchProperties.resultsPerPage;
    //start at first result for data range and end at last result or final result in data set
    for(let index = firstResultIndex; index < lastResultIndex && index < searchProperties.totalResults; index++){
            htmlStr += getTableRowHTML(searchProperties.dataType, data[index], searchProperties.domainURL);;
        }
    return htmlStr;    
}

function sortAscending(a, b, searchProperties){
    //first sort by current column
    if(a[searchProperties.sortBy.column] < b[searchProperties.sortBy.column]) return -1;
    if(a[searchProperties.sortBy.column] > b[searchProperties.sortBy.column]) return 1;
    //if they are the same, sort by id
    if(a.id < b.id) return -1;
    if(a.id > b.id) return 1;

}

function sortDescending(a, b, searchProperties){
    //first sort by current column
    if(a[searchProperties.sortBy.column] > b[searchProperties.sortBy.column]) return -1;
    if(a[searchProperties.sortBy.column] < b[searchProperties.sortBy.column]) return 1;
    //if they are the same, sort by id
    if(a.id > b.id) return -1;
    if(a.id < b.id) return 1;

}



export function getTableRowHTML(dataType, data, domainURL){   
    switch(dataType){
        case "entries": 
            return getEntryTableRowHTML(data, domainURL);
        case "sources":
            return getSourceTableRowHTML(data, domainURL);
        case "collections":
            return getCollectionTableRowHTML(data, domainURL);
    }
}

function getSourceTableRowHTML(source, domainURL){
    return '<tr class="table__row">' +
                `<td class="idCell table__data" id="id"><a href="${domainURL}/getSource?id=${source.id}" target="_blank">${source.id}</a></td>` +
                `<td class="collectionCell table__data" id="collection">${source.collection}</td>` +
                `<td class="sourceNumberCell table__data" id="sourceNumber">${source.sourceNumber}</td>` +
                `<td class="callNumberCell table__data" id="callNumber">${source.callNumber}</td>` +
                `<td class="authorCell table__data" id="author">${source.author}</td>` +
                `<td class="titleCell table__data" id="title">${source.title}</td>` +
                `<td class="inscriptionCell table__data u-retain-indentation" id="inscription">${source.inscription}</td>` +
                `<td class="descriptionCell table__data u-retain-indentation" id="description">${source.description}</td>` +
            '</tr>';
}

function getEntryTableRowHTML(entry, domainURL){
    return '<tr class="table__row">' +
                `<td class="idCell table__data" id="id"><a href="${domainURL}/getEntry?id=${entry.id}" target="_blank">${entry.id}</a></td>` +
                `<td class="collectionCell table__data" id="collection">${entry.collection}</td>` +
                `<td class="sourceNumberCell table__data" id="sourceNumber">${entry.sourceNumber}</td>` +
                `<td class="locationCell table__data" id="location">${entry.location}</td>` +
                `<td class="titleCell table__data" id="title">${entry.title}</td>` +
                `<td class="composerCell table__data" id="composer">${entry.composer}</td>` +
                `<td class="vocalPartCell table__data" id="vocalPart">${entry.vocalPart}</td>` +
                `<td class="keyCell table__data" id="key">${entry.key}</td>` +
                `<td class="melodicIncipitCell table__data" id="melodicIncipit">${entry.melodicIncipit}</td>` +
                `<td class="textIncipitCell table__data" id="textIncipit">${entry.textIncipit}</td>` +
                `<td class="table__data table__entry-cell--is-secular" id="isSecular">` +
                   `<input type="checkbox" class="isSecularData" ${entry.isSecular === 'true' ? "checked" : ""} disabled>` + 
                `</td>` +
                `<td class="notesCell table__data" id="notes">${entry.notes}</td>` +
            '</tr>'; 
}

function getCollectionTableRowHTML(collection, domainURL){
    return '<tr class="table__row">' +
                `<td class="idCell table__data" id="id"><a href="${domainURL}/getCollection?id=${collection.id}" target="_blank">${collection.id}</a></td>` +
                `<td class="collectionCell table__data" id="collection">${collection.collection}</td>` +
                `<td class="descriptionCell table__data" id="description">${collection.description}</td>` +
            '</tr>';        
}