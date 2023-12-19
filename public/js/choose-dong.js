function updateDong() {
	var gu = document.getElementById("trash_gu")
	var dong = document.getElementById("trash_dong")

	dong.disabled = false

	var selectedGroup = gu.options[gu.selectedIndex].getAttribute("data-group")

	for (var i = 0; i < dong.options.length; i++) {
		dong.options[i].style.display = "none"
	}

	for (var i = 0; i < dong.options.length; i++) {
		if (dong.options[i].getAttribute("data-group") === selectedGroup) {
			dong.options[i].style.display = "block"
		}
	}
}

function updateBins() {
	var dong = document.getElementById("trash_dong")
	var bins = document.querySelectorAll("#trash_bin")

	var selectedGroup = dong.options[dong.selectedIndex].getAttribute("value")

	for (var i = 0; i < bins.length; i++) {
		bins[i].style.display = "none"
	}

	for (var i = 0; i < bins.length; i++) {
		if (bins[i].getAttribute("data-group") === selectedGroup) {
			bins[i].style.display = "block"
		}
	}
}

var mapOptions = {
    center: new naver.maps.LatLng(37.452527, 127.132282),
    zoom: 14
}

var map = new naver.maps.Map('map', mapOptions)
var markers = []

function chooseBin(bin) {
	var lat = bin.getAttribute("lat")
	var lon = bin.getAttribute("lon")

	map.setOptions({
		center: new naver.maps.LatLng(lat, lon),
		zoom: 15
	})
    markers.forEach((marker) => marker.setMap(null) )
    markers = []
	var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lon),
        map: map
    })
    markers.push(marker)
}