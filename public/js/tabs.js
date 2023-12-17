document.addEventListener('DOMContentLoaded', function () {
    // Get all tab links
    var tabLinks = document.querySelectorAll('.tab-link');

    // Add click event listener to each tab link
    tabLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Remove 'current' class from all tab links
            tabLinks.forEach(function (tab) {
                tab.classList.remove('current');
            });

            // Add 'current' class to the clicked tab link
            link.classList.add('current');

            // Get the data-tab attribute value of the clicked tab link
            var tabId = link.getAttribute('data-tab');

            // Get all tab contents
            var tabContents = document.querySelectorAll('.tab-content');

            // Hide all tab contents
            tabContents.forEach(function (content) {
                content.style.display = 'none';
            });

            // Show the tab content with the matching tabId
            var currentTab = document.getElementById(tabId);
            if (currentTab) {
                currentTab.style.display = 'block';
            }
        });
    });
});


function validatePassword() {
    var currentPassword = document.getElementById('currentPassword').value;
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    // 간단한 유효성 검사 (실제 프로젝트에서는 보다 강력한 검사 필요)
    if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
        alert("모든 입력란을 채워주세요.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
    }

    // 유효성 검사를 통과한 경우, 여기서 서버로 데이터를 전송하거나 다른 작업을 수행할 수 있습니다.
    alert("비밀번호가 성공적으로 수정되었습니다.");
    document.getElementById('passwordForm').reset(); // 양식 초기화
}

function highlightMenuItem(clickedItem) {
    // 모든 메뉴 아이템의 active 클래스 제거
    const menuItems = document.querySelectorAll('#dropdown1 a');
    menuItems.forEach(item => item.classList.remove('active'));

    // 선택한 메뉴 아이템에 active 클래스 추가
    clickedItem.classList.add('active');
}
