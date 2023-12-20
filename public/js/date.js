function updateBinsG() {
	var gu_id = document.getElementById("trash_gu")
	var gu_name =  gu_id.options[gu_id.selectedIndex].innerText
	gu_id = gu_id.value
	var start = document.getElementById("start").value
	var end = document.getElementById("end").value

	fetch(`/use/gu/${gu_id}?start=${start}&end=${end}`)
	.then(res => res.json())
	.then((res) => {
		var { err, top_list, btm_list } = res
		if (err!=0) { alert('데이터 조회 중 오류가 발생했습니다. Error:', err) }
		var gu1 = document.getElementById("gu1")
		var gu2 = document.getElementById("gu2")
		var top = document.getElementById("top")
		var btm = document.getElementById("btm")

		gu1.innerHTML = `${gu_name}구`
		gu2.innerHTML = `${gu_name}구`
		top.innerHTML = `<li>
			<div class="collapsible-header">TOP1 ${top_list[0].dong}동  평균 ${top_list[0].use}회</div>
			<div class="collapsible-header">TOP2 ${top_list[1].dong}동  평균 ${top_list[1].use}회</div>
			<div class="collapsible-header">TOP3 ${top_list[2].dong}동  평균 ${top_list[2].use}회</div>
			<div class="collapsible-header">TOP4 ${top_list[3].dong}동  평균 ${top_list[3].use}회</div>
			<div class="collapsible-header">TOP5 ${top_list[4].dong}동  평균 ${top_list[4].use}회</div>
		</li>`
		btm.innerHTML = `<li>
			<div class="collapsible-header">TOP1 ${btm_list[0].dong}동  평균 ${btm_list[0].use}회</div>
			<div class="collapsible-header">TOP2 ${btm_list[1].dong}동  평균 ${btm_list[1].use}회</div>
			<div class="collapsible-header">TOP3 ${btm_list[2].dong}동  평균 ${btm_list[2].use}회</div>
			<div class="collapsible-header">TOP4 ${btm_list[3].dong}동  평균 ${btm_list[3].use}회</div>
			<div class="collapsible-header">TOP5 ${btm_list[4].dong}동  평균 ${btm_list[4].use}회</div>
		</li>`
	})
	.catch(err => console.error('Error:', err))
}

function updateBinsD() {
	var dong_id = document.getElementById("trash_dong")
	var dong_name =  dong_id.options[dong_id.selectedIndex].innerText
	dong_id = dong_id.value
	var start = document.getElementById("start").value
	var end = document.getElementById("end").value
	

	fetch(`/use/dong/${dong_id}?start=${start}&end=${end}`)
	.then(res => res.json())
	.then((res) => {
		var { err, top_list, btm_list } = res
		if (err!=0) { alert('데이터 조회 중 오류가 발생했습니다. Error:', err) }
		var d1 = document.getElementById("d1")
		var d2 = document.getElementById("d2")
		var top = document.getElementById("top")
		var btm = document.getElementById("btm")

		d1.innerHTML = `${dong_name}동`
		d2.innerHTML = `${dong_name}동`
		top.innerHTML = `<li>
			<div class="collapsible-header">TOP1 ${top_list[0].bin_id}  평균 ${top_list[0].use}회</div>
			<div class="collapsible-header">TOP2 ${top_list[1].bin_id}  평균 ${top_list[1].use}회</div>
			<div class="collapsible-header">TOP3 ${top_list[2].bin_id}  평균 ${top_list[2].use}회</div>
			<div class="collapsible-header">TOP4 ${top_list[3].bin_id}  평균 ${top_list[3].use}회</div>
			<div class="collapsible-header">TOP5 ${top_list[4].bin_id}  평균 ${top_list[4].use}회</div>
		</li>`
		btm.innerHTML = `<li>
			<div class="collapsible-header">TOP1 ${btm_list[0].bin_id}  평균 ${btm_list[0].use}회</div>
			<div class="collapsible-header">TOP2 ${btm_list[1].bin_id}  평균 ${btm_list[1].use}회</div>
			<div class="collapsible-header">TOP3 ${btm_list[2].bin_id}  평균 ${btm_list[2].use}회</div>
			<div class="collapsible-header">TOP4 ${btm_list[3].bin_id}  평균 ${btm_list[3].use}회</div>
			<div class="collapsible-header">TOP5 ${btm_list[4].bin_id}  평균 ${btm_list[4].use}회</div>
		</li>`
	})
	.catch(err => console.error('Error:', err))
}

function updateBinsF() {
	var dong_id = document.getElementById("trash_dong").value
	var start = document.getElementById("start").value
	var end = document.getElementById("end").value
	

	fetch(`/fire/bin-list?dong=${dong_id}&start=${start}&end=${end}`)
	.then(res => res.json())
	.then((res) => {
		var { err, bin_list } = res
		if (err!=0) { alert('데이터 조회 중 오류가 발생했습니다. Error:', err) }
		var binList = document.getElementById("binList")

		var html = ``
		for (let i=0; i<bin_list.length; i++) {
			html += `<li>
				<div class="collapsible-header">${bin_list[i].bin_id}</div>
			</li>`
		}
		binList.innerHTML = html
	})
	.catch(err => console.error('Error:', err))
}