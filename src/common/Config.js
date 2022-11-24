export default {
    siteUrl: process.env.REACT_APP_ENV == 'dev' ? 'https://hotel.bizmap.in' : window.location.origin,
    siteToken: 'token c2609de4fbfd645:a37f3ea3eac89f3',
    // siteUrl: process.env.REACT_APP_ENV == 'dev' ? 'https://hoteldev.bizmap.in' : window.location.origin,
    // siteToken: 'token 2312f6ffdeb36cf:008977011f9e89e',
    formatTime: (date) => {
        const newDate = new Date(date);
        let month = newDate.getMonth() + 1
        return `${newDate.getFullYear()}-${month < 10 ? "0" + month : month}-${newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()} ${newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours()}:${newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes()}:${newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds()}`
    },
    days: (date_1, date_2) => {
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    },
    formatDate(date) {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString("en-US", options)
    },
    formatAMPM(date) {
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
}