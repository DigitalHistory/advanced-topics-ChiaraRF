// initialize the variables we need
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'
var my_map; // this will hold the map
var my_map_options; // this will hold the options we'll use to create the map
var my_center = new google.maps.LatLng(44.260059, -72.575387); // center of map
var my_markers = []; // we use this in the main loop below to hold the markers
// this one is strange.  In google maps, there is usually only one
// infowindow object -- its content and position change when you click on a
// marker.  This is counterintuitive, but we need to live with it.
var infowindow = new google.maps.InfoWindow({content: ""});
var legendHTML = "<h1>Legend</h1>";

// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
var blueURL = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
var redURL = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
var red_markers = [];
var blue_markers = [];

// this is for fun, if you want it.  With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://developers.google.com/maps/documentation/javascript/datalayer#load_geojson
/* var myGeoJSON= {
  "type":"FeatureCollection",
  "features":
  [{"type":"Feature",
    "properties":{myColor: 'red'},
    "myColor" : "red",
    "geometry":{"type":"Polygon",
                "coordinates":[[[-85.60546875,49.03786794532644],[-96.6796875,40.713955826286046],
                                [-79.62890625,37.71859032558816],[-81.2109375,49.26780455063753],
                                [-85.60546875,49.03786794532644]]]}},
   {"type":"Feature",
    "properties":{myColor: 'green'},
    "myColor" : "green",
     "geometry":{"type":"Polygon",
                 "coordinates":[[[-113.203125,58.35563036280967],[-114.78515624999999,51.944264879028765],
                                 [-101.6015625,51.944264879028765],[-112.32421875,58.263287052486035],
                                 [-113.203125,58.35563036280967]]]
                }}]};
*/

/* a function that will run when the page loads.  It creates the map
 and the initial marker.  If you want to create more markers, do it here. */
function initializeMap() {
    my_map_options = {
        center:  my_center, // to change this value, change my_center above
        zoom: 5,  // higher is closer-up
        mapTypeId: google.maps.MapTypeId.HYBRID // you can also use TERRAIN, STREETMAP, SATELLITE
    };

    // this one line creates the actual map
    my_map = new google.maps.Map(document.getElementById("map_canvas"),
                                 my_map_options);
    // this is an *array* that holds all the marker info
    var all_my_markers =
            [{position: new google.maps.LatLng(43.634722, -79.395819),
              map: my_map,
              icon: redURL, // this sets the image that represents the marker in the map to the one
                             // located at the URL which is given by the variable blueURL, see above
              title: "Ireland Park",
              window_content: "<h3>Ireland Park</h3><p>Toronto, ON (2007)</p><img src='http://irelandparkfoundation.com/wp-content/uploads/sculpture-rollover.jpg'/>"},
             {position: new google.maps.LatLng(45.486800, -73.546355),
              map: my_map,
              icon: blueURL, // this sets the image that represents the marker in the map
              title: "Irish Commemorative Stone",
              window_content: "<h3>Irish Commemorative Stone</h3><p>Montreal, QC (1913)</p><img src='https://www.irishcentral.com/uploads/article/121054/cropped_cropped_Rock_Montreal_Famine_dead.jpg'/>"},
             {position: new google.maps.LatLng(47.028460, -70.671372),
              map: my_map,
              icon: blueURL, // this sets the image that represents the marker in the map
              title: "Grosse Île and the Irish Memorial National Historic Site",
              window_content: "<h3>Grosse Île and the Irish Memorial National Historic Site</h3><p>Grosse Ile, QC (1909)</p><img src='https://www.quebecoriginal.com/en/listing/images/800x600/4cc47167-d361-4885-a232-57fdef2d3d59/grosse-ile-cruise-photo.jpg'/>"},
             {position: new google.maps.LatLng(39.947846, -75.142029),
              map: my_map,
              icon: redURL, // this sets the image that represents the marker in the map
              title: "Philadelphia Irish Memorial",
              window_content: "<h3>Philadelphia Irish Memorial</h3><p>Philadelphia, PA (2003)</p><img src='https://commemoratingfamine.files.wordpress.com/2014/01/philadelphia_2.jpg'/>"},
             {position: new google.maps.LatLng(42.357357,-71.058598),
              map: my_map,
              icon: redURL, // this sets the image that represents the marker in the map
              title: "Boston Irish Famine Memorial",
              window_content: "<h3>Boston Irish Famine Memorial</h3><p>Boston, MA (1998)</p><img src='https://commemoratingfamine.files.wordpress.com/2014/01/boston_1.jpg'/>"},
             {position: new google.maps.LatLng(45.239206, -66.053827),
              map: my_map,
              icon: blueURL,
              title: "Partridge Island Quarantine Station National Historic Site",
              window_content: "<h3>Partridge Island Quarantine Station National Historic Site</h3><p>Partridge Island, NB (1927)</p><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Partridge_Island_New_Brunswick_Canada.jpg/1200px-Partridge_Island_New_Brunswick_Canada.jpg'/>"}
            ];

    for (j = 0; j < all_my_markers.length; j++) {
        var marker =  new google.maps.Marker({
            position: all_my_markers[j].position,
            map: my_map,
            icon: all_my_markers[j].icon,
            title: all_my_markers[j].title,
            window_content: all_my_markers[j].window_content});

        // this next line is ugly, and you should change it to be prettier.
        // be careful not to introduce syntax errors though.
      legendHTML +=
        "<div class=\"pointer\" onclick=\"locateMarker(my_markers[" + j + "])\"> " +
          marker.title + "<br><br>" + "</div>";
        marker.info = new google.maps.InfoWindow({content: marker.window_content});
        var listener = google.maps.event.addListener(marker, 'click', function() {
            // if you want to allow multiple info windows, uncomment the next line
            // and comment out the two lines that follow it
            //this.info.open(this.map, this);
            infowindow.setContent (this.window_content);
            infowindow.open(my_map, this);
        });
        my_markers.push({marker:marker, listener:listener});
        if (all_my_markers[j].icon == blueURL ) {
            blue_markers.push({marker:marker, listener:listener});
        } else if (all_my_markers[j].icon == redURL ) {
            red_markers.push({marker:marker, listener:listener});
        }

    }
    document.getElementById("map_legend").innerHTML = legendHTML;
  my_map.data.addGeoJson(myGeoJSON);

  var romeCircle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    // in general, we always have to *set the map* when we
    // add features.
    map: my_map,
    bounds: {
      north: 42.685,
      south: 40.671,
      east: 12.501,
      west: 12.485
    },

    center: {"lat": 41.9000, "lng":12.5000},
    radius: 1000
  });
  my_map.data.setStyle(function (feature) {
    var thisColor = feature.getProperty("myColor");
    return {
      fillColor: thisColor,
      strokeColor: thisColor,
      strokeWeight: 5
    };

});
}

// this hides all markers in the array
// passed to it, by attaching them to
// an empty object (instead of a real map)
function hideMarkers (marker_array) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(null);
    }
}
// by contrast, this attaches all the markers to
// a real map object, so they reappear
function showMarkers (marker_array, map) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(map);
    }
}

//global variable to track state of markers

var markersHidden = false;

function toggleMarkers (marker_array, map) {
  for (var j in marker_array) {
    if (markersHidden) {
      marker_array[j].marker.setMap(map);
    } else {
      marker_array[j].marker.setMap(null);
    }
  }
  markersHidden = !markersHidden;
}


// I added this for fun.  It allows you to trigger the infowindow
// from outside the map.
function locateMarker (marker) {
    console.log(marker);
    my_map.panTo(marker.marker.position);
    google.maps.event.trigger(marker.marker, 'click');
}
