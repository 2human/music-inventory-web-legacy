export function getResultsMessage(searchProperties){
    if(searchProperties.totalResults === 0){
        return getNoResultsMessage();
    }    
    else if(searchProperties.totalPages === 1){
        return getSinglePageResultsMessage(searchProperties.totalResults);
    } else{
        return getMultiPageResultsMessage(searchProperties);
    } 
}

function getNoResultsMessage(){
    return '<b>No results found...';
}

function getSinglePageResultsMessage(totalResults){
    if(totalResults === 1){
        return `<b>Displaying ${totalResults} result...`;   //display 'results' in singular form
    }
    return `<b>Displaying ${totalResults} results...`;      //display 'results' in plural form
}

//result message containing range of results
function getMultiPageResultsMessage(searchProperties){
    let lastResult = getLastResultNumber(searchProperties);
    let firstResult = getFirstResultNumber(searchProperties);
    return `<b>Displaying ${firstResult}-${lastResult} of ${searchProperties.totalResults} results...`;
}

function getLastResultNumber(searchProperties){
    //gets last resultnumber of current search result display for search results message
    if(viewingLastPage(searchProperties)){
        return searchProperties.totalResults;   //last result number is same as total results
    } else{
        return parseInt(searchProperties.curPage * searchProperties.resultsPerPage);
    }
}

function viewingLastPage(searchProperties){
    return searchProperties.curPage == searchProperties.totalPages;
}

function getFirstResultNumber(searchProperties){
    //gets first result number of current search result display for search results message
    return parseInt((searchProperties.curPage - 1) * searchProperties.resultsPerPage + 1);
}