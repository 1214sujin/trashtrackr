var mapOptions = {
    center: new naver.maps.LatLng(37.452527, 127.132282),
    zoom: 14
}

var map = new naver.maps.Map('map', mapOptions)
var markers = []

var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 10
})

var marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(37.3595704, 127.105399),
    map: map
})