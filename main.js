const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

// Click Search
searchButton.addEventListener('click', () => {
    var inputValue = searchInput.value;
    getUserName(inputValue);

});
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
            $("#card_name").text("Lịch sử di chuyển của nhân viên " + data.result[0].user_name);
            v_data.forEach((element, index) => {
                buildBody(element, index + 1);
            });
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
                text: data.time
            })
        ).append(
            $("<td />", {
                text: data.beacon_item_name
            })
        )
    );
}