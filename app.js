$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCH63Yd2U-aDYMqiDGlY9amiH3S2KpWPfI",
        authDomain: "team-project-2d3c2.firebaseapp.com",
        databaseURL: "https://team-project-2d3c2.firebaseio.com",
        projectId: "team-project-2d3c2",
        storageBucket: "",
        messagingSenderId: "871255246336"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    // Initial Values
    var item = "";
    var zipCode = "";


    // Capture Button Click
    $("#searchItem").on("click", function() {
        // Don't refresh the page!
        event.preventDefault();
        // Code in the logic for storing and retrieving the most recent user.
        // Don't forget to provide initial data to your Firebase database.
        item = $("#item").val().trim();
        database.ref().push({
            item: item
        });
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
            console.log(response);

            var hgroup = $('<hgroup />').attr({
                class: 'mb20'
            });
            $('<h2 />').html('Search Results').appendTo(hgroup);
            hgroup.appendTo($('#main'));

            // this will clear the search results for every new search
            $('section').empty();
            var section = $('<section />').attr({
                class: 'col-xs-12 col-sm-6 col-md-12'
            });
            // populating the search results
            for (var i = 0; i < response.items.length; i++) {
                var article = $('<article />').attr({
                    class: 'search-result row'
                });

                $('<img />').attr({
                        src: response.items[i].mediumImage
                    })
                    .appendTo($('<a />').attr({
                        href: response.items[i].productUrl,
                        title: response.items[i].name,
                        class: 'thumbnail'
                    })).appendTo($('<div />').attr({
                        class: 'col-xs-12 col-sm-12 col-md-3'
                    })).appendTo(article);

                var div = $('<div />').attr({
                    class: 'col-xs-12 col-sm-12 col-md-7'
                });

                $('<a />').html(response.items[i].name).attr({
                    href: response.items[i].productUrl,
                    title: response.items[i].name
                }).appendTo($('<h3 />')).appendTo(div);

                $('<p />').html(response.items[i].shortDescription).appendTo(div);

                div.appendTo(article);
                article.appendTo(section);
            }
            section.appendTo($('#main'));
        });
    });
});
