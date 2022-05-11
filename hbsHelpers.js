const helpers = (hbs) => {
        // Currency formatter
        hbs.registerHelper('currencyFormat', money =>
            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money));

        // Date formatter
        hbs.registerHelper('dateTime', date => date.toLocaleString('en-US', { hour12: false }));
        hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
        // Address formatter
        hbs.registerHelper('address', (specific_address, ward, district, city) => `${specific_address ? `${specific_address},` : ''} phường ${ward}, quận ${district}, ${city}`);

    // Order status
    hbs.registerHelper('checkStatus', status => {
        console.log(status)
        if (status === 'Success') 
            return 'success';
        else if (status === 'Delivering') 
            return 'warning';
        else if (status === 'Cancel') 
            return 'danger';
        else return 'secondary';
    });

    // status select
    hbs.registerHelper('select', function(value, options) {
        return options.fn(this).replace(
            new RegExp(` value="${value}"`),
            '$& selected');
    });

    hbs.registerHelper('preview', url => url ? url : "/images/default.png");
    
    //loop for all level options
    hbs.registerHelper('allLevelOptions', (n) => {
        let options;
        for (let i = n-1; i >=1 ; i--) {
            options += `<option value="${i}">${i} level(s)</option>`;
        }
        return options;
    });
    //loop for level options without 1 level
    hbs.registerHelper('levelOptions', (n, levelValue) => {
        let options;
        for (let i = n-1; i >=1 ; i--) {
            if (i!=levelValue){
                options += `<option value="${i}">${i} levels</option>`;
            }
        }
        return options;
    });
    // pagination
    hbs.registerHelper('page', (currentPage, maxPage, url) => {
        //check exists pagination in url
        url = url.includes('page') ? url.substring(0, url.indexOf('page') - 1) : url;
        const urlTerm = url === '/' ? '?' : `${url.substring(1)}&`;

        let item = `<li class="page-item d-none d-sm-block ${currentPage == 1 ? "disabled" : ""}">
                        <a class="page-link" href="${urlTerm}page=${currentPage - 1}" aria-label="Previous">
                            <i class="bi bi-caret-left-fill"></i>
                        </a>
                    </li>`;
        for (let i = 1; i <= maxPage; i++) {
            item += `<li class="page-item ${i == currentPage ? "active" : ""}">
                        <a class="page-link" href="${urlTerm}page=${i}" aria-label="${i}">
                            <span>${i}</span>
                        </a>
                    </li>`;
        }
        item += `<li class="page-item d-none d-sm-block ${currentPage == maxPage ? "disabled" : ""}">
                        <a class="page-link" href="${urlTerm}page=${currentPage + 1}" aria-label="Next">
                            <i class="bi bi-caret-right-fill"></i>
                        </a>
                    </li>`;
        return item;
    });
}

module.exports ={
    helpers
}