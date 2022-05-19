const dashboardService = require('./dashboardService');
var Duration = require("duration");
module.exports = {
    dashboard: async(req, res) => {
        const dateRange = req.query.dateRange;
        var fromDate;
        var toDate;
        var fromDateUTC;
        const offset = 7;
        //when go to dashboard => display 7 days recent revenue
        if (!dateRange) {
            const days = 6;
            const toDateUTC = new Date();
            fromDateUTC = new Date(toDateUTC.getTime() - (days * 24 * 60 * 60 * 1000));
            const utc1 = toDateUTC.getTime() + (toDateUTC.getTimezoneOffset() * 60000);
            const utc2 = fromDateUTC.getTime() + (fromDateUTC.getTimezoneOffset() * 60000);
            toDate = new Date(utc1 + (3600000 * offset));
            fromDate = new Date(utc2 + (3600000 * offset));
        } else {
            const index = dateRange.indexOf(' to ');
            if (index != -1) {
                fromDate = new Date(dateRange.substring(0, index));
                toDate = new Date(dateRange.substring(index + 4));
            } else {
                fromDate = new Date(dateRange);
                toDate = new Date(dateRange);
            }
        }
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        const duration = new Duration(fromDate, toDate);
        const orders = await dashboardService.orderList(fromDate, toDate);
        var chartData = new Array();
        for (let i = 0; i <= duration.days; i++) {
            var date;
            if (!dateRange) {
                const currentDateUTC = new Date(fromDateUTC.getTime() + (i * 24 * 60 * 60 * 1000));
                const utc = currentDateUTC.getTime() + (currentDateUTC.getTimezoneOffset() * 60000);
                const currentDate = new Date(utc + (3600000 * offset));
                const month = (currentDate.getMonth() + 1) < 10 ? "" + currentDate.getMonth() + 1 : currentDate.getMonth() + 1;
                const day = (currentDate.getDate()) < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
                date = currentDate.getFullYear() + '-' + month + '-' + day;
            } else {
                var currentDate = new Date(fromDate);
                currentDate.setDate(currentDate.getDate() + i);
                const month = (currentDate.getMonth() + 1) < 10 ? "" + currentDate.getMonth() + 1 : currentDate.getMonth() + 1;
                const day = (currentDate.getDate()) < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
                date = currentDate.getFullYear() + '-' + month + '-' + day;
            }
            chartData[i] = {
                labels: date,
                revenue: 0,
            }
        }
        for (let i = 0; i < orders.length; i++) {
            const spaceIndex = orders[i].created_at.indexOf(' ');
            const orderDate = orders[i].created_at.substring(0, spaceIndex);
            const index = chartData.map(function(e) { return e.labels; }).indexOf(orderDate);
            chartData[index] = {
                labels: orderDate,
                revenue: chartData[index].revenue + parseInt(orders[i].total)
            };
        }
        let label1 = chartData.map(a => a.labels);
        let revenue1 = chartData.map(a => a.revenue);
        //top 10
        const topList = await dashboardService.topList();
        var topChartData = new Array();
        for (let i = 0; i < topList.length; i++) {
            const productName = await dashboardService.findProductNameById(topList[i].product_id);
            topChartData[i] = {
                labels: productName.name,
                count: parseInt(topList[i].total),
            }
        }
        let label2 = topChartData.map(a => a.labels);
        let count2 = topChartData.map(a => a.count);
        res.render('index', { title: 'Dashboard', label1: JSON.stringify(label1), revenue1: JSON.stringify(revenue1), label2: JSON.stringify(label2), count2: JSON.stringify(count2), fromDate, toDate, scripts: ['dashboard.js'] });
    }
}