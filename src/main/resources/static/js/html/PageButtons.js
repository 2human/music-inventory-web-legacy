//construct buttons that allow user to select search result page
export function getPageBtnsHTML(searchProperties){
    let maxButtons = 8;    
    let bounds = getPageBtnBounds(searchProperties, maxButtons);
    let btnHTMLStr = getPreviousAndFirstPageBtnsHTML(searchProperties, bounds.lowerBound) +
        getInnerPageBtnsHtML(searchProperties, bounds) +
        getLastAndNextPageBtnsHTML(searchProperties, bounds.upperBound);    
    return btnHTMLStr;
}

//
function getPageBtnBounds(searchProperties, maxButtons){
    //determines range of buttons to create when navigating search page results
    //
    //first and last page buttons always created, so the boundaries for buttons that can possibly be created here
    //are between the 2nd and 2nd to last pages
    //
    //increment equally in each direction to start, then allocate rest to whatever boundary remains
    //until max buttons reached
    let totalButtons = 0,                       //current tally of buttons that will be created
        lowerBound = searchProperties.curPage,           //lower and upper bounds start at current page
        upperBound = searchProperties.curPage,           //and are incremented until their boundaries are reached
        totalPages = searchProperties.totalPages;
    while(totalButtons < maxButtons &&
         (lowerBound > 2 || upperBound < totalPages - 1)){  //both 2nd page button and 2nd to last have yet to be created 
        if(lowerBound > 2){                      //second page not added
            lowerBound--;
            totalButtons++;
        }
        if(upperBound < totalPages - 1 && totalButtons !== maxButtons){ //second to last page not added and all buttons not created
            upperBound++;           
            totalButtons++;
        }        
    }
    return { upperBound: upperBound, lowerBound: lowerBound }
}

function getPreviousAndFirstPageBtnsHTML(searchProperties, lowerBound){    
    //disable buttons if first page currently being viewd
    let htmlStr = getPageBtnHTML('Previous', searchProperties) + 
                getPageBtnHTML(1, searchProperties);
    if(lowerBound > 2){     //if second page button will not be created
        htmlStr += '&nbsp;...&nbsp;&nbsp;&nbsp;';    //put dots between first and proceeding buttons
    }
    return htmlStr;
}

function getPageBtnHTML(pageNumber, searchProperties){
    if(isDisabledBtn(pageNumber, searchProperties)){
        return getDisabledPageBtnHTML(pageNumber);
    } else{
        return getActivePageBtnHTML(pageNumber);
    }
}

//destermine if button should be disabled
function isDisabledBtn(pageNumber, searchProperties){
    if(searchProperties.curPage === pageNumber){     //page corresponding to page button number selected
        return true;
    } else if(pageNumber === 'Previous' && searchProperties.curPage === 1){  //cannot select previous if on first page
        return true;
    } else if (pageNumber === 'Next' && searchProperties.curPage === searchProperties.totalPages){   //cannot select next if of last page
        return true;
    } else{
        return false;
    }    
}

function getDisabledPageBtnHTML(pageNumber){
    return `<button class="btn btn--blue btn__page-btn" disabled>${pageNumber}</button>`;
}

function getActivePageBtnHTML(pageNumber){
    return `<button class="btn btn--blue btn__page-btn">${pageNumber}</button>`
}

function getInnerPageBtnsHtML(searchProperties, bounds){
    let btnHTML = "";
    //generate all buttons between lower and upper bounds (inclusive) previously determined
    for(let pageNumber = bounds.lowerBound; pageNumber <= bounds.upperBound; pageNumber++){
        //prevent duplicates of first and last page, which are always going to be created
        if(pageNumber !== 1 && pageNumber !== searchProperties.totalPages){
            btnHTML += getPageBtnHTML(pageNumber, searchProperties);
        }
    }
    return btnHTML;
}

function getLastAndNextPageBtnsHTML(searchProperties, upperBound){
    let htmlStr = '';
    let totalPages = searchProperties.totalPages;
    //if not last page, add normal page buttons
    if(upperBound < totalPages - 1){     //if there is gap between core buttons and end button
        htmlStr += '&nbsp;...&nbsp;&nbsp;&nbsp;';               //add dots
    }
    htmlStr +=   getPageBtnHTML(totalPages, searchProperties) + 
                getPageBtnHTML('Next', searchProperties);
    return htmlStr;

}