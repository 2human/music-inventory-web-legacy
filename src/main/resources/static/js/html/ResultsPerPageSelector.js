

/**
 * 
 * @param {*} searchProperties Object containing data about how to format search results.
 * @returns HTML with results per page options.
 */
export function getResultsPerPageSelectorHTML(searchProperties){
    let resultsPerPageHTML = 'Results Per Page: ';
    searchProperties.resultsPerPageOptions.forEach( resultsOption => {
        if(searchProperties.resultsPerPage == resultsOption){             //if current selection
            resultsPerPageHTML += resultsOption + '  ';     //add only text with no hyperlink
        } else{                                             //otherwise construct text with hyperlink
            resultsPerPageHTML += `<a href="javascript:void(null);" id="${resultsOption}" class="resultsPerPageLink">${resultsOption}</a>   `;
        }
    });
    return resultsPerPageHTML;
}