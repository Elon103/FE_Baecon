const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

// Click Search
searchButton.addEventListener('click', () => {
    var inputValue = searchInput.value;
    getUserName(inputValue);

});
var MapPoints = [];
//chrome
// Get info by user_name
function getUserName(inputValue) {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/baecon/detail/" + inputValue,
        cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true,
        },
        success: function(data) {
            var v_data = data.result;
            $("#tb_employee").find('tr').remove();
            // console.log(v_data);
            if (v_data !== null) {
                $("#card_name").text("Lịch sử di chuyển của nhân viên " + data.result[0].user_name);
            }
            v_data.forEach((element, index) => {
                var v_value = { "lat": element.latitude, "lng": element.longitude, "time": dateTime(new Date(element.time)) };
                // console.log(v_value);
                MapPoints.push(v_value);
                if (index < 15) {
                    buildBody(element, index + 1);
                }
            });
            // console.log((JSON.stringify(MapPoints)));
            google.maps.event.addDomListener(window, 'load', initialize(JSON.stringify(MapPoints)));
        }
    });
}


//Build grid body
function buildBody(data, i) {
    $("#tb_employee").append(
        $("<tr />").append(
            $("<th />", {
                scope: "row1",
                text: i
            })
        ).append(
            $("<td />", {
                // text: new Date(data.time)
                text: dateTime(new Date(data.time))
            })
        ).append(
            $("<td />", {
                text: data.beacon_item_name
            })
        )
    );
}

function dateTime(date) {
    var year = date.getFullYear();
    // var month = date.getMonth();
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    var text = day + "/" + 2 + "/" + year + " : " + hours + ":" + minutes + ":" + second;
    return text;
}

// 

var MY_MAPTYPE_ID = 'custom_style';

function initialize(MapPoints) {

    if (jQuery('#map').length > 0) {

        var locations = jQuery.parseJSON(MapPoints);

        window.map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        });

        var infowindow = new google.maps.InfoWindow();
        var flightPlanCoordinates = [];
        var bounds = new google.maps.LatLngBounds();

        for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
                map: map
            });
            flightPlanCoordinates.push(marker.getPosition());
            bounds.extend(marker.position);

            //open popup when click marker

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(locations[i]['time']);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }

        map.fitBounds(bounds);

        var flightPath = new google.maps.Polyline({
            map: map,
            path: flightPlanCoordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

    }
}