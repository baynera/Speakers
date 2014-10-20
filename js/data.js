(function () {
    "use strict";

    var dataLoaded = false;
    var list = new WinJS.Binding.List();

    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );


    getData().then(function (sampleItems) {
        sampleItems.forEach(function (item) {
            list.push(item);
        });
    });



    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });
    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }
    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }
    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }
    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }
    function getData() {
        // JSON request
        return WinJS.xhr({

            type: "GET",
            url: "http://10.106.77.215:42922/Speaker.svc/querySql"
        }).then(
                function (response) {
                    return OnSuccessCall(response);
                },
                function (error) {
                    var err = error;
                    console.log("XHR Error : " + error);
                },
                function (progress) { }
				);
        // .done(function complete(result) {
        // var querycollection = WinJS.Utilities.query('.win-ring');
        // querycollection.setStyle("visibility", "hidden"); 
        // console.log(dataLoaded);
        //}); // end .done

    }
    function OnSuccessCall(response) {
        var itemContent = "<p>Item Content</p>";
        var itemDescription = "Item Description";
        var groupDescription = "";
        var attendeeDescription = "";
        // These three strings encode placeholder images. You will want to set the
        // backgroundImage property in your real data to be URLs to images.
        var darkGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
        var lightGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
        var mediumGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";
        // Each of these sample groups must have a unique key to be displayed separately.
        var sampleGroups = [
            { key: "group1", title: "Speakers", subtitle: "", backgroundImage: "", description: groupDescription, loaded: true }
        ];



        //hideProgress();
        var xmlDoc;
        var sampleItems = [];
        //if (eval('(' + response.responseText + ')').queryParam == true) {


        var resulttxt = eval('(' + response.responseText + ')').querySqlResult;
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(resulttxt, "text/xml");
        }
        else {// Internet Explorer
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
        }
        var nodes = xmlDoc.querySelectorAll("Table");

        for (var i = 0; i < nodes.length; i++) {
            // determine group type
            //var myGroup;
            //if (nodes[i].childNodes[3].textContent == "Founding") {
               // myGroup = sampleGroups[0];
           // } else {
               // myGroup = sampleGroups[1];
           // }
            // populate sampleItems
            sampleItems.push({
                group: sampleGroups[0],
                name: nodes[i].childNodes[0].textContent,
                title: nodes[i].childNodes[1].textContent,
                bio: nodes[i].childNodes[3].textContent,
                logo: nodes[i].childNodes[7].textContent + "images/speakers/" + nodes[i].childNodes[2].textContent,
                slot: nodes[i].childNodes[4].textContent,
                topic: nodes[i].childNodes[5].textContent,
                priority: nodes[i].childNodes[6].textContent
            });

        }

        //}
        // else {
        //console.trace("Error occurs. Please make sure the database has been attached to SQL Server!");
        //}

        return sampleItems;
    }

    function OnErrorCall(response) {
        //$('#<%=lblOutput.ClientID%>').html(response.d);
        alert(response.d);
    }

})();
function hideProgress() {
    var querycollection = WinJS.Utilities.query('.win-ring');
    querycollection.setStyle("visibility", "hidden");
};