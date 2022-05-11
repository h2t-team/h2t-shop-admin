const error = msg => `<div class="alert alert-danger d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                            <div>
                                ${msg}
                            </div>
                        </div>`
const errorPlacement = (error, element) => {
    isValid = false;
    element.css('background-color', '#ffdddd');
    error.css('color', 'red');
    error.css('margin-top', '10px');
    error.insertAfter(element);
}
const unhighlight = (element) => {
    isValid = true;
    $(element).css('background-color', 'var(--mint)');
}

var path = window.location.pathname;
if (path.match('/categories/addcategory')) {
    // validate add category form
    $("#add-category-form").validate({
        rules: {
            "name": {
                required: true,
            },
        },
        messages: {
            "name": {
                required: "Please enter a category name",
            },
        },
        errorPlacement: errorPlacement,
        unhighlight: unhighlight,
        submitHandler: function(form, event) {
            event.preventDefault();
            submitForm();
        }
    });
    // handle submit add category form
    function submitForm() {
        const name = document.getElementById("name").value;
        const description = document.getElementById("desc").value;
        const parentId = document.getElementById("parentId").value;
        const data = {
            name: name,
            description: description,
            parentId: parentId,
        }
        $.ajax({
            contentType: "application/json",
            url: '/categories/addcategory/',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data), // data to submit
        }).done((res) => {
            $("#errorMessage").empty();
            console.log("SUCCESS respones", res);
            window.location.href = "/categories";
        }).fail((res) => {
            $("#errorMessage").empty();
            const msg = res.responseJSON.message;
            $("#errorMessage").append(error(msg));
        });
    }
}

if (path.match('/categories/updatecategory/')) {
    $("#update-category-form").validate({
        rules: {
            "name": {
                required: true,
            },
        },
        messages: {
            "name": {
                required: "Please enter a category name",
            },
        },
        errorPlacement: errorPlacement,
        unhighlight: unhighlight,
        submitHandler: function(form, event) {
            event.preventDefault();
            submitForm();
        }
    });

    function submitForm() {
        const id = document.getElementById("id").value;
        const name = document.getElementById("name").value;
        const description = document.getElementById("desc").value;
        const parentId = document.getElementById("parentId").value;
        const oldParentId = document.getElementById("oldParentId").value;
        const data = {
            id: id,
            name: name,
            description: description,
            parentId: parentId,
            oldParentId: oldParentId == "" ? '0' : oldParentId,
        }
        $.ajax({
            contentType: "application/json",
            url: '/categories/updatecategory/',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data), // data to submit
        }).done((res) => {
            $("#errorMessage").empty();
            console.log("SUCCESS respones", res);
            window.location.href = '/categories';
        }).fail((res) => {
            $("#errorMessage").empty();
            const msg = res.responseJSON.message;
            $("#errorMessage").append(error(msg));
        });
    }
}
if (path.match('/categories')) {
    $('#levelValue').on('change', function() {
        this.form.submit();
    });
}