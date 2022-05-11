// remove the blank field when submit the search form
$("form").submit(function() {
    if($(".search").val() == "") {
            $(".search").attr('disabled', true);
    }
});