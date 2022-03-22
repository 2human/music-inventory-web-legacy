

export function getSingleView(dataType, data){
    switch(dataType){
        case "entries": 
            return getSingleEntryView(data);
        case "sources":
            return getSingleSourceView(data);
        case "collections":
            return getSingleCollectionView(data);
    }
}

function getSingleEntryView(entry) {
    return `
        <table class="table table--single-view">
            <colgroup>
                <col class="table__single-view-column--label">
                <col class="table__single-view-column--data">
            </colgroup> 
            <tr class="table__row">
                <td class="table__data">Id:</td>
                <td class="table__data">${entry.id}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Collection:</td>
                <td class="table__data">${entry.collection}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Source Number:</td>
                <td class="table__data">${entry.sourceNumber}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Location:</td>
                <td class="table__data">${entry.location}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Title:</td>
                <td class="table__data">${entry.title}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Composer:</td>
                <td class="table__data">${entry.composer}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Vocal Part:</td>
                <td class="table__data">${entry.vocalPart}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Key:</td>
                <td class="table__data">${entry.key}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Melodic Incipit:</td>
                <td class="table__data">${entry.melodicIncipit}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Text Incipit:</td>
                <td class="table__data">${entry.textIncipit}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Secular:</td>
                <td class="table__data">${entry.isSecular}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Notes:</td>
                <td class="table__data">${entry.notes}</td>
            </tr>
        </table>
            `;
}

function getSingleSourceView(source) {
    return `
        <table class="table table--single-view">
            <colgroup>
                <col class="table__single-view-column--label">
                <col class="table__single-view-column--data">
            </colgroup>    
            <tr class="table__row">
                <td class="table__data">Id:</td>
                <td class="table__data">${source.id}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Collection:</td>
                <td class="table__data">${source.collection}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Source Number:</td>
                <td class="table__data">${source.sourceNumber}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Call Number:</td>
                <td class="table__data">${source.callNumber}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Author:</td>
                <td class="table__data">${source.author}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Title:</td>
                <td class="table__data">${source.title}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Inscription:</td>
                <td class="table__data u-retain-indentation">${source.inscription}</td>
            </tr>
            <tr class="table__row">
                <td class="table__data">Description:</td>
                <td class="table__data u-retain-indentation">${source.description}</td>
            </tr>
        </table>
        `
        //change these to onclick, etc...
        // <div class="view-data-buttons">
        //     <a class="btn" href="@{http://www.musicinventoryapp.com/getSource(id=${source.getId() - 1})}">Previous</a>
        //     <a class="btn" href="@{http://www.musicinventoryapp.com/editSource(id=${source.getId()})}">Edit Mode</a>
        //     <a class="btn" href="@{http://www.musicinventoryapp.com/getSource(id=${source.getId() + 1})}">Next</a>
        // </div>
}

function getSingleCollectionView(collection) {
    return `
        <div class="u-retain-indentation">
            ${collection.description}
        </div>
    `;
}