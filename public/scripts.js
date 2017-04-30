var polylines = [];
var map;
var supportedCities = ['chi', 'nyc'];

$(function(){
  var defaultCity = $('#city-param').val();
  if (supportedCities.includes(defaultCity)){
    $("input[value=" + defaultCity + "]").prop('checked', true);
  }
  // makeMap();
  $("#submit").click(requestRoute);
  $("#switch").click(switchAddresses);
  $("input[name=city]").click(function(){
    map.setView(city().center, zoom(12));
  });
});

function makeMap(){
  map = L.map('map');
  var layer = Tangram.leafletLayer({
    scene: 'https://raw.githubusercontent.com/tangrams/cinnabar-style/gh-pages/cinnabar-style.yaml',
    attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
  });
  layer.addTo(map);
  map.setView(city().center, zoom(12));
}

function requestRoute(){

  removePolylinesFromMap(polylines);

  var origin = $("#origin").val() + city().suffix;
  var destination = $("#destination").val() + city().suffix;
  var cityName = $('input[name=city]:checked').val();

  var base = "/route?";
  var params = "city=" + cityName + "&origin=" + origin + "&destination=" + destination;
  var request = $.getJSON(base + params);

  $.when(request).done(function(responses){
    ['comfortable', 'direct'].forEach(function(profile){
      responses.forEach(function(response){
        if (response.profile_name == profile) {
          var geometry = response.routes[0].geometry;
          var profileColors = { direct: "black", comfortable: "blue", cautious: "green" };
          drawPolylineWithColor(geometry, profileColors[profile]);
        }
      });
    });
  });
}

function drawPolylineWithColor(polyline, color){
  var pointList = L.PolylineUtil.decode(polyline).map(function(point){
    return point.map(function(coordinate){
      return coordinate;
    });
  });
  var polyline = L.polyline(pointList, {
    color: color,
    weight: 3,
    opacity: 1,
    smoothFactor: 1
  });
  polylines.push(polyline);
  polyline.addTo(map);
  zoomToMidpoint(pointList);
}

function removePolylinesFromMap(polylines){
  polylines.forEach(function(polyline){
    map.removeLayer(polyline);
  });
  polylines = [];
}

function city(){
  // var cities = {
  //   'chi': { center: [41.840675, -87.679365], suffix: ', chicago, il' },
  //   'nyc': { center: [40.693817, -73.929769], suffix: ', new york city, ny' }
  // };
  // return cities[$('input[name=city]:checked').val()];
  return 'nyc';
}

function switchAddresses(){
  var origin = $("#origin");
  var destination = $("#destination");
  var tmp = origin.val();
  origin.val(destination.val());
  destination.val(tmp);
}

function zoomToMidpoint(points){
  var midpoint = points[Math.ceil(points.length / 2)];
  map.setView([midpoint[0], midpoint[1]], zoom(13));
}

function zoom(zoom){
  return zoom;
}