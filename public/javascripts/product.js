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

$(document).ready(() => {
    // add product previews
    $('#photo').on('change', e => {
        $('#error-upload').empty();
        if (e.target.files.length > 3) {
            $('#error-upload').append('Please choose at most 3 images!');
        } else {
            $('.product-img-container').remove();
            const { files } = e.target;
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const src = URL.createObjectURL(files[i]);
                    const imgContainer = `<div class="me-3 mb-3 product-img-container">
                                            <div>
                                                <img class="product-img rounded" src="${src}" alt="" width="80" height="80">
                                            </div>
                                        </div>`
                    $("#product-imgs").append(imgContainer);
                }
            }
        }
    });

    // confirm remove the product
    $(document).on('click', ".remove-btn", function() {
        const name = $(this).data('name');
        const id = $(this).data('id');
        const category = $(this).data('category');

        $('.modal-body').text(`Are you sure to want to remove ${name.toLowerCase()}?`);
        $('.confirm-btn').click(() => {
            removeProduct(id, category);
        })
    });
});

const validateProduct = {
    rules: {
        "pname": {
            required: true,
        },
        "pprice": {
            required: true,
            min: 1000,
        },
        "pquantity": {
            min: 1,
        }
    },
    messages: {
        "pname": {
            required: "Please enter a product name",
        },
        "pprice": {
            required: "Please enter the price",
            min: "Price must be at least 1000đ",
        },
        "pquantity": {
            min: "Quantity must be at least 1",
        },
    },
    errorPlacement: (error, element) => {
        isValid = false;
        element.css('background-color', '#ffdddd');
        error.css('color', 'red');
        error.css('margin-top', '10px');
        error.insertAfter(element);
    },
    unhighlight: element => {
        isValid = true;
        $(element).css('background-color', 'var(--mint)');
    },
}

// validate and submit add product form
$('#add-product-form').validate({
    ...validateProduct,
    submitHandler: function(form, event) {
        event.preventDefault();
        handleAddProduct();
    }
})

// validate and submit edit product form
$('#update-product-form').validate({
    ...validateProduct,
    submitHandler: function(form, event) {
        event.preventDefault();
        submitUpdateProductForm();
    }
})

var path = window.location.pathname;

// add multiple sizes and quantities for the product
function addSize() {
    const productQuantity = document.getElementById('pquantity').value;
    const pSizeSelect = document.getElementById('psize');

    if (productQuantity > 0 && pSizeSelect.value) {
        //Create a size element
        const pSizeElement = document.createElement("td");
        pSizeElement.appendChild(document.createTextNode(pSizeSelect.value.toUpperCase()));
        pSizeElement.classList.add("text-center");

        // Create a quantity element
        const pQuantityElement = document.createElement("td");
        pQuantityElement.appendChild(document.createTextNode(productQuantity));
        pQuantityElement.classList.add("text-center");

        // add elements to the table
        const table = document.getElementById("psize-table");
        let element = document.createElement("tr");
        element.appendChild(pSizeElement);
        element.appendChild(pQuantityElement);
        table.appendChild(element);

        // Remove selectedOption
        pSizeSelect.remove(pSizeSelect.selectedIndex);
    }
}

// submit add product form
function handleAddProduct() {
    if ($('#photo').get(0).files.length === 0) {
        $('#error-upload').append('Please choose an image!');
        return;
    }
    const form = document.getElementById("add-product-form");
    const table = document.getElementById("table-quantities");
    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];

        input = document.createElement('input');
        input.setAttribute('name', row.cells[0].innerText);
        input.setAttribute('value', row.cells[1].innerText);
        input.setAttribute('type', 'hidden');
        form.append(input);
    }
    form.submit();
}

// remove a product
function removeProduct(id, category_id) {
    $.ajax({
            contentType: "application/json",
            url: `/products`,
            dataType: "json",
            type: 'POST',
            data: JSON.stringify({ id, category_id }),
        }).done(res => {
            location.reload();
        })
        .fail(err => {
            $("#errorMessage").empty();
            const msg = err.responseJSON.message;
            $("#errorMessage").append(error(msg));
        })
}

if (path.match('/products/updateproduct/')) {
    window.onload = function() {
        changePQuantityValue();
    }
    document.getElementById('psize').onchange = function() {
            changePQuantityValue();
        }
        //change quantity value in table
    document.getElementById('update-product-btn').addEventListener('click', () => {
        const productQuantity = document.getElementById('pquantity').value;
        const pSizeSelect = document.getElementById('psize');

        if (productQuantity > 0 && pSizeSelect.value) {
            const table = document.getElementById("psize-table");
            var totalRowCount = table.rows.length;
            for (var i = 0; i < totalRowCount; i++) {

                if (table.rows[i].cells[0].innerText == pSizeSelect.value) {
                    table.rows[i].cells[1].innerText = productQuantity;
                }
            }
            //Remove selectedOption and change pquantity value
            pSizeSelect.remove(pSizeSelect.selectedIndex);
            changePQuantityValue();
        }
    })
}

//change quantity value in input 
function changePQuantityValue() {
    const pSizeSelect = document.getElementById('psize');
    if (pSizeSelect.selectedIndex >= 0) {
        const table = document.getElementById("psize-table");
        var totalRowCount = table.rows.length;
        for (var i = 0; i < totalRowCount; i++) {
            //find pquantity value in table
            if (table.rows[i].cells[0].innerText == pSizeSelect.value) {
                document.getElementById('pquantity').value = table.rows[i].cells[1].innerText;
            }
        }
    } else {
        document.getElementById('pquantity').value = '';
    }
}

function submitUpdateProductForm() {
    const pid = document.getElementById('pid').value;
    const prate = document.getElementById('prate').value;
    const pname = document.getElementById('pname').value;
    const pcategory = document.getElementById('pcategory').value;
    const pprice = document.getElementById('pprice').value;
    const pdesc = document.getElementById('pdesc').value;
    const poldCategory = document.getElementById('poldCategory').value;
    var psize = {};
    const table = document.getElementById("psize-table");
    var totalRowCount = table.rows.length;
    for (var i = 0; i < totalRowCount; i++) {
        const size = table.rows[i].cells[0].innerText;
        const quantity = table.rows[i].cells[1].innerText;
        psize[size] = quantity;
    }
    var data = {
        pid: pid,
        prate: prate,
        pname: pname,
        pcategory: pcategory,
        pprice: pprice,
        pdesc: pdesc,
        psize: psize,
        poldCategory: poldCategory,
    }
    $.ajax({
        contentType: "application/json",
        url: '/products/updateproduct/',
        dataType: "json",
        type: 'POST', // http method
        data: JSON.stringify(data), // data to submit
    }).done((res) => {
        $("#errorMessage").empty();
        window.location.href = "/products";
    }).fail((res) => {
        $("#errorMessage").empty();
        const msg = res.responseJSON.message;
        $("#errorMessage").append(error(msg));
    });

}