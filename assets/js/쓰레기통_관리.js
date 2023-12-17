
    $(document).ready(function () {
        // Add new collapsible item when '신규' button is clicked
        $("#addNewItem").click(function () {
            var newItem = '<li><div class="collapsible-header">New Item</div></li>';
            $("#collapsibleList").append(newItem);
            // You can customize the content or class of the new item as needed.
        });

        // Delete selected collapsible item when '삭제' button is clicked
        $("#deleteItem").click(function () {
            var selectedHeader = $("#collapsibleList .collapsible-header.active");
            if (selectedHeader.length > 0) {
                selectedHeader.closest("li").remove();
            }
        });

        // Save the current state when '저장' button is clicked
        $("#saveState").click(function () {
            // Save the current state or perform other actions as needed
            alert("Current state saved!");
        });

        // Toggle 'active' class on collapsible headers
        $("#collapsibleList").on("click", ".collapsible-header", function () {
            $(this).toggleClass("active");
        });
    });
