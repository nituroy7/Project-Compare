var mymodal;
let set = new Set();
$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBmn9Vp8gvEoCIC6ZBgODqKF4omsE4GN48",
        authDomain: "compare-prices-17f1d.firebaseapp.com",
        databaseURL: "https://compare-prices-17f1d.firebaseio.com",
        projectId: "compare-prices-17f1d",
        storageBucket: "compare-prices-17f1d.appspot.com",
        messagingSenderId: "850301622456"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    // Initial Values
    var item = "";
    //function to call the you tube video 
    mymodal = function(productName, num) {
        $.ajax({
            url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + productName + " review" + "&key=AIzaSyB8g6i8y1SPFbIcJw9flTwk7VEFXYWA5MY",
            context: document.body
        }).done(function(response) {
            $('#dialog').empty();
            var videoId = response.items[0].id.videoId;
            var embedCode = "<iframe id='youframe' width=\"100%\" height=\"315\"></iframe>";
            $('#dialog').append(embedCode);
            $('#dialog').dialog({
                autoOpen: false,
                show: "fade",
                hide: "fade",
                modal: true,
                height: 'auto',
                width: 'auto',
                resizable: true,
                title: productName,
                open: function(ev, ui) {
                    $('#youframe').attr('src', 'https://www.youtube.com/embed/' + videoId);
                }
            });
            $('#dialog').dialog('open');
        });
    }
    $("#searchItem").on("click", function() {
        $("#main.container").hide();
    });
    $("#searchItem").on("click", function() {
        $("#recent-searches").hide();
        $("#recent-searches1").hide();
    });

    function updateFirebase(item) {
        database.ref().push({
            item: item
        });
    }
    console.log(item)
        // Capture Button Click
    $("#searchItem").on("click", function() {
        // Don't refresh the page!
        event.preventDefault();
        // Code in the logic for storing and retrieving the most recent user.
        // Don't forget to provide initial data to your Firebase database.
        item = $("#item").val();
        updateFirebase(item);
        var supportsChrome = $.support.cors;
        $.ajax({
            url: 'http://api.walmartlabs.com/v1/search?apiKey=rtvzxw2fgpxvrehtzuazk4g3&query=' + item,
            method: "GET",
            contentType: 'text/plain',
            crossDomain: true,
            dataType: 'jsonp',
            xhrFields: {
                // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
                // This can be used to set the 'withCredentials' property.
                // Set the value to 'true' if you'd like to pass cookies to the server.
                // If this is enabled, your server must respond with the header
                // 'Access-Control-Allow-Credentials: true'.
                withCredentials: false
            }
        }).done(function(response) {
            //creates the header group
            var hgroup = $('<hgroup>').attr({ class: 'mb20' });
            //building out the search result header tag
            hgroup.append($('<h1>').html('Search Results'));
            var searchCount = $('<span>')
                .html('<strong class = \'text-danger\'>' + response.totalResults + '</strong>')
                .append(' results were found for the search: ')
                .append('<strong class = \'text-danger\'>' + item + '</ strong>');
            hgroup.append($('<h2>').attr({ class: 'lead' }).append(searchCount));
            //appending the search result header tag to the hqroup.
            $('#searchResultsDiv').empty();
            $('#searchResultsDiv').append(hgroup);
            // this will clear the search results for every new search
            $('section').empty();
            var section = $('<section>').attr({
                class: 'col-xs-12 col-sm-6 col-md-12'
            });
            // populating the search results
            for (var i = 0; i < response.items.length; i++) {
                var article = $('<article>').attr({
                    class: 'search-result row'
                });
                //creating images
                var imageLink = $('<a>').attr({
                    href: response.items[i].productUrl,
                    title: response.items[i].name,
                    class: 'thumbnail'
                }).append($('<img>').attr({
                    src: response.items[i].mediumImage
                }));
                var imageDiv = $('<div>').attr({
                    class: 'col-xs-12 col-sm-12 col-md-3'
                }).append(imageLink);
                article.append(imageDiv);
                //creating the listDiv to hold the price, ratings
                var listDiv = $('<div>').attr({
                    class: "col-xs-12 col-sm-12 col-md-2"
                });
                $('<p>').html("Original Price: " + response.items[i].msrp).appendTo(listDiv);
                $('<p>').html("Sale Price: " + response.items[i].salePrice).appendTo(listDiv);
                $('<p>').html("Customer Ratings: " + response.items[i].customerRating).appendTo(listDiv);
                $('<img>').attr({ src: response.items[i].customerRatingImage }).appendTo(listDiv);
                $('<p>').html("Reviews: " + response.items[i].numReviews).appendTo(listDiv);
                listDiv.appendTo(article);
                //creating the product link with short description
                var descriptionDiv = $('<div>').attr({
                    class: 'col-xs-12 col-sm-10 col-md-7',
                    id: 'descriptionDiv' + '_' + i
                });
                var productLink = $('<h4>').append($('<a>').html(response.items[i].name).attr({
                    href: response.items[i].productUrl,
                    title: response.items[i].name,
                }).on('click', function() {
                    updateFirebase(response.items[i].name)
                }));
                descriptionDiv.append(productLink);
                var produceDesc = $('<div class="more">').html(response.items[i].shortDescription);
                descriptionDiv.append(produceDesc);
                // link for youtube
                descriptionDiv.append($("<a onclick='mymodal(\"" + (response.items[i].name).replace(/"/g, '\\"') + "," + i + "\")'>").html("<button><h4 class='youtube' id='youtube" + i + " '>Click here for youtube review!</h4></Button>"));
                article.append(descriptionDiv);
                article.appendTo(section);
            }
            section.appendTo($('#searchResultsDiv'));
            // Configure/customize these variables.
            var showChar = 400; // How many characters are shown by default
            var ellipsestext = "...";
            var moretext = "Show more >";
            var lesstext = "Show less";
            $('.more').each(function() {
                var content = $(this).html();
                if (content.length > showChar) {
                    var c = content.substr(0, showChar);
                    var h = content.substr(showChar, content.length - showChar);
                    var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
                    $(this).html(html);
                }
            });
            $(".morelink").click(function() {
                if ($(this).hasClass("less")) {
                    $(this).removeClass("less");
                    $(this).html(moretext);
                } else {
                    $(this).addClass("less");
                    $(this).html(lesstext);
                }
                $(this).parent().prev().toggle();
                $(this).prev().toggle();
                return false;
            });
        });
    });

    database.ref().on('child_added', function(snapshot) {
        console.log(snapshot.val());
        var results = snapshot.val();
        if (set.has(results.item.toLowerCase()))
            return;
        else
            set.add(results.item.toLowerCase());
        var recentSearch = $('<div>');

        for (var key in results) {
            // skip loop if the property is from prototype
            if (!results.hasOwnProperty(key)) continue;
            var obj = results[key];
            for (var prop in obj) {
                // skip loop if the property is from prototype
                if (!obj.hasOwnProperty(prop)) continue;
                var item = $('<div class="searched-item">');
                item.html(obj);
                recentSearch.append(item);
            }
        }
        $('#recent-searches').prepend(item);
    });
});
