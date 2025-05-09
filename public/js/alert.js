const eventSource = new EventSource('/noti/alert')
eventSource.onmessage = (event) => {
	var d = JSON.parse(event.data).data
	console.log(d)
}
eventSource.onerror = (err) => {
	console.error('SSE Error:', err)
}

function getAlert(element) {
	if (element.classList.contains('active')) {
		document.getElementById("dropdown2").innerHTML = ''
	}
	fetch('/noti')
	.then(res => res.json())
	.then(alert => {
		console.log(alert)
		var html = ``
		if (alert==[]) {
			html += `<li>
						<div>
							<i class="fa fa-comment fa-fw"></i> 미확인 알림이 존재하지 않습니다
						</div>
					</li>`
		} else {
			for (let i=0; i<alert.length; i++) {
				if (alert[i].read=='0') { var background = `style="background-color: lightyellow;"` }
				if (alert[i].type=='rp') { var ment = `${alert[i].bin_id}의 봉투를 교체하였습니다.` }
				else { var ment = `${alert[i].bin_id}에 화재가 발생하였습니다.`}
				html += `<li>
							<a href="${alert[i].url}">
								<div ${background}>
									<i class="fa fa-comment fa-fw"></i>
										${ment}
									<span class="pull-right text-muted small">${alert[i].time}</span>
									<button value="X" notId=${alert[i].not_id} onclick="deleteAlert(this)"></button>
								</div>
							</a>
						</li>
						<li class="divider"></li>`
			}
		}
		document.getElementById("dropdown2").innerHTML = html
	})
	.catch(err => console.error('Error:', err))
}