export default {
    apiURL: 'http://localhost:8000',
    token: 'token 6ba0718a1c0f873:f21bc024d45a0d1',
    formatTime: (date) => {
        const newDate = new Date(date);
        let month = newDate.getMonth() + 1
        return `${newDate.getFullYear()}-${month < 10 ? "0" + month : month}-${newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()} ${newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours()}:${newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes()}:${newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds()}`
    },
}