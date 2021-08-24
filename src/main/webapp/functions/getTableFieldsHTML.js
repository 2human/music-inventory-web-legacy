/**
 * Returns checkboxes corresponding to with labels that correspond to field names which allows user to select
 * which fields to search.
 * @param {} tableSelection Table radio button that is selected
 */
 export default function getTableFieldsHTML(tableSelection){
    //generate fields corresponding to those within sources table 
    switch(tableSelection){
        //source radio button clicked
        case "sources":
            //generate html for checkboxes
            return 'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
            '<input type="checkbox" name="field" id="collection" value="collection"> Collection123 ' +
            '<input type="checkbox" name="field" id="sourceNumber" value="sourceNumber"> Source Number ' +
            '<input type="checkbox" name="field" id="callNumber" value="callNumber"> Call Number ' +
            '<input type="checkbox" name="field" id="author" value="author"> Author ' +
            '<input type="checkbox" name="field" id="title" value="title"> Title ' +
            '<input type="checkbox" name="field" id="inscription" value="inscription"> Inscription ' +
            '<input type="checkbox" name="field" id="description" value="description"> Description ';
            break;
        //entries radio button clicked
        case "entries": 
            //generate html for checkboxes
            return 'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
            '<input type="checkbox" name="field" id="collection" value="collection"> Collection ' +
            '<input type="checkbox" name="field" id="sourceNumber" value="sourceNumber"> Source Number ' +
            '<input type="checkbox" name="field" id="location" value="location"> Location ' +
            '<input type="checkbox" name="field" id="title" value="title"> Title ' +
            '<input type="checkbox" name="field" id="credit" value="credit"> Credit ' +
            '<input type="checkbox" name="field" id="vocalPart" value="vocalPart"> Vocal Part ' +
            '<input type="checkbox" name="field" id="key" value="key"> Key ' +
            '<input type="checkbox" name="field" id="melodicIncipit" value="melodicIncipit"> Melodic Incipit ' +
            '<input type="checkbox" name="field" id="textIncipit" value="textIncipit"> Text Incipit ' +
            '<input type="checkbox" name="field" id="isSecular" value="isSecular"> Secular ';
            break;
        case "collections": 
        return 'Field:  <input type="checkbox" name="field" id="id" value="id"> Id ' +
        '<input type="checkbox" name="field" id="collection" value="collection"> Collection ' +
        '<input type="checkbox" name="field" id="description" value="description"> Description';


    }
}