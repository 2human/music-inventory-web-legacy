/**
 * 
 * @param {*} sortProps Object containing column name by which data is sorted, and order of sorting (asending or descending)
 * @param {*} elementClicked Event target
 * @returns Object containing data describing how to sort search results.
 */
export function getSortByColumnProps(sortProps, elementClicked){
    const columnName = getColumnName(elementClicked);
    if(sortingByDifferentColumn(sortProps, columnName)){
        return { column: columnName, order: 'ascending' }
    } else{
        return { ...sortProps, order: getOppositeSortOrder(sortProps) };
    }
}

function getColumnName(elementClicked){    
    if(isHeaderText(elementClicked)){
        return elementClicked.parentElement.id;
    } else if(isArrow(elementClicked)){ 
        //arrow is within separate element from text, so must go two levels above to get column
        return elementClicked.parentElement.parentElement.id;
    }
}

function sortingByDifferentColumn(sortProps, columnName){
    return columnName !== sortProps.column; 
}

function getOppositeSortOrder(sortProps){
    if(sortProps.order === 'ascending'){
        return 'descending';
    } else{
        return 'ascending';
    }
}

//column header text was clicked (not the arrow next to text)
function isHeaderText(elementClicked){
    return elementClicked.nodeName === 'A'; //header text is within anchor element
}

//arrow next to column label was clicked
function isArrow(elementClicked){
    return elementClicked.nodeName === 'I'; //arrows are within 
}

