export default {
    apiURL: 'http://localhost:8000',
    token: 'token 1a17817b5838ba8:8fe8a3106bb901b',
    formatTime: (date) => {
        const newDate = new Date(date);
        let month = newDate.getMonth() + 1
        return `${newDate.getFullYear()}-${month < 10 ? "0" + month : month}-${newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()} ${newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours()}:${newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes()}:${newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds()}`
    },
}