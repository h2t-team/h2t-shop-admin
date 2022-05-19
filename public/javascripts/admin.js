const error = msg => `<div class="alert alert-danger d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                            <div>
                                ${msg}
                            </div>
                        </div>`
const success = () => `<div class="alert alert-success d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Success:">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            <div>
                                Update account successfully!
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
if (path.match('/admins/addadmin') || path.match('/admins/addAdmin')) {
    // validate add admin form
    $("#add-admin-form").validate({
        rules: {
            "firstName": {
                required: true,
            },
            "username": {
                required: true,
            },
            "password": {
                required: true,
                minlength: 6
            },
            "confirmPassword": {
                required: true,
                equalTo: "#password",
                minlength: 6
            },
            "email": {
                required: true,
                email: true,
            },
            "telephone": {
                maxlength: 10,
            }
        },
        messages: {
            "firstName": {
                required: "Please enter a first name",
            },
            "username": {
                required: "Please enter a username",
            },
            "password": {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long",
            },
            "confirmPassword": {
                required: "Please provide a password",
                equalTo: "Please enter the same password as above",
                minlength: "Your password must be at least 6 characters long",
            },
            "email": {
                required: "Please provide an email",
                email: "You have entered an invalid email address"
            },
            "telephone": {
                maxlength: "Your telephone number must be at most 10 characters long"
            }
        },
        errorPlacement: errorPlacement,
        unhighlight: unhighlight,
        submitHandler: function(form, event) {
            event.preventDefault();
            submitForm();
        }
    });

    // handle submit add admin form
    function submitForm() {
        const lastName = document.getElementById("lastName").value;
        const firstName = document.getElementById("firstName").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const telephone = document.getElementById("telephone").value;
        const password = document.getElementById("password").value;
        const data = {
            lastName: lastName,
            firstName: firstName,
            username: username,
            email: email,
            telephone: telephone,
            password: password,
        }
        $.ajax({
            contentType: "application/json",
            url: '/admins/addadmin/',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data), // data to submit
        }).done((res) => {
            $("#errorMessage").empty();
            console.log("SUCCESS respones", res);
            window.location.href = "/admins";
        }).fail((res) => {
            $("#errorMessage").empty();
            const msg = res.responseJSON.message;
            $("#errorMessage").append(error(msg));
        });
    }
}

if (path.match('/admins/updateadmin/') || path.match('/profile/editaccount')) {
    $("#update-admin-form").validate({
        rules: {
            "firstName": {
                required: true,
            },
            "email": {
                required: true,
                email: true,
            },
            "telephone": {
                maxlength: 10
            }
        },
        messages: {
            "firstName": {
                required: "Please enter a username",
            },
            "email": {
                required: "Please provide an email",
                email: "You have entered an invalid email address"
            },
            "telephone": {
                maxlength: "Your telephone number must be at most 10 characters long"
            }
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
        const lastName = document.getElementById("lastName").value;
        const firstName = document.getElementById("firstName").value;
        const email = document.getElementById("email").value;
        const telephone = document.getElementById("telephone").value;
        const data = {
            id: id,
            lastName: lastName,
            firstName: firstName,
            email: email,
            telephone: telephone,
        }
        $.ajax({
            contentType: "application/json",
            url: '/admins/updateadmin/',
            dataType: "json",
            type: 'POST', // http method
            data: JSON.stringify(data), // data to submit
        }).done((res) => {
            $("#errorMessage").empty();
            console.log("SUCCESS respones", res);
            $("#successfullyMessage").append(success);
            setTimeout(() => {
                window.location.href = '/admins';
            }, 2000);
        }).fail((res) => {
            $("#errorMessage").empty();
            const msg = res.responseJSON.message;
            $("#errorMessage").append(error(msg));
        });
    }
}

function lockAdmin(id, checkLock) {
    $.ajax({
        contentType: "application/json",
        url: '/admins/lockadmin',
        dataType: "json",
        type: 'POST',
        data: JSON.stringify({ id, checkLock }),
    }).done(res => {
        location.reload();
    })
    .fail(err => {
        $("#errorMessage").empty();
        const msg = err.responseJSON.message;
        $("#errorMessage").append(error(msg));
    })
}