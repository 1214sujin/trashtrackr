document.addEventListener("DOMContentLoaded", function () {
    // Get the '신규' button and add an event listener
    document.getElementById("addNewItem").addEventListener("click", function () {
        console.log('add')
        var newItem = document.createElement("li")
        newItem.innerHTML = '<div class="collapsible-header">New Item</div>'
        document.getElementById("collapsibleList").appendChild(newItem)
        // You can customize the content or class of the new item as needed.
    })

    // Get the '삭제' button and add an event listener
    document.getElementById("deleteItem").addEventListener("click", function () {
        console.log('delete')
        var selectedHeader = document.querySelector("#collapsibleList .collapsible-header.active")
        if (selectedHeader) {
            console.log('활성화?')
            selectedHeader.closest("li").remove()
        }
    })

    // Get the '저장' button and add an event listener
    document.getElementById("saveState").addEventListener("click", function () {
        console.log('save')
        // Save the current state or perform other actions as needed
        alert("변경 내용이 저장되었습니다.")
    })

    // Get the element with ID 'collapsibleList' and add a click event listener to its child elements with class 'collapsible-header'
    document.getElementById("collapsibleList").addEventListener("click", function (event) {
        if (event.target.classList.contains("collapsible-header")) {
            event.target.classList.toggle("active")
        }
    })
})