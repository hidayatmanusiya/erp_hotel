export default {
      siteUrl: 'https://hoteldev.bizmap.in',
      hostUrl: 'https://hoteldev.bizmap.in',
      token: 'token c2609de4fbfd645:1fdc15e76217e94',
      formatDate: (date) => {
            let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
            let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
            return `${date.getFullYear()}-${month}-${day}`
      },
      formatTodayDateTime(date) {
            var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            let D = date.toLocaleDateString("en-US", options)
            let T = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
            return `<b>Date:</b> ${D}  <b>Time: </b>  ${T}`
        },
}