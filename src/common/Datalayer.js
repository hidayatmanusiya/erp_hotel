import { apiPostCall } from './SiteAPIs'
import Config from './Config'
const { Mask } = window.bryntum.scheduler;

export const searchData = async (params) => {

    Mask.mask({
        text: 'Loading Data ...',
        mode: 'dark-blur'
    });
    const schedule = window.bryntum.get('scheduler');

    if (window.frappe?.csrf_token == 'None') {
        location.replace(`${window.location.origin}/login`)
    }

    // Room HMS
    let filtersR = []
    for (let item of params.company) {
        filtersR.push(["Room HMS", "company", "=", item.name])
    }
    for (let item of params.roomType) {
        filtersR.push(["Room HMS", "room_type", "=", item])
    }
    for (let item of params.propertie) {
        filtersR.push(["Room HMS", "property", "=", item])
    }
    for (let item of params.status) {
        filtersR.push(["Room HMS", "status", "=", item.name])
    }
    let paramsR = `doctype=Room+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&filters=${JSON.stringify(filtersR)}&limit_page_length=None`;
    let resourcesArray = await apiPostCall('/', paramsR, window.frappe?.csrf_token)
    for (let item of resourcesArray) {
        item.id = item.name
    }
    // Room Folio HMS
    let filtersE = []
    for (let item of params.company) {
        filtersE.push(["Room Folio HMS", "company", "=", item.name])
    }
    for (let item of params.roomType) {
        filtersE.push(["Room Folio HMS", "room_type", "=", item])
    }
    for (let item of params.propertie) {
        filtersE.push(["Room Folio HMS", "property", "=", item])
    }
    if (params.startDate && params.endDate) {
        let date = new Date(params.startDate)
        let fromDate = `${date.getFullYear()}-${date.getMonth() < 9 ? "0" + (Number(date.getMonth()) + 1) : date.getMonth()}-${date.getDate() < 9 ? "0" + date.getDate() : date.getDate()}`
        filtersE.push(["Room Folio HMS", "check_in", ">=", fromDate])
        let date1 = new Date(params.endDate)
        let fromDate1 = `${date.getFullYear()}-${date.getMonth() < 9 ? "0" + (Number(date.getMonth()) + 1) : date.getMonth()}-${date.getDate() < 9 ? "0" + date.getDate() : date.getDate()}`
        filtersE.push(["Room Folio HMS", "check_out", "<=", fromDate1])

        schedule.startDate = new Date(params.startDate)
        schedule.endDate = new Date(params.endDate)
    } else {
        let endDate = new Date()
        endDate.setDate(endDate.getDate() + 14)
        schedule.startDate = new Date()
        schedule.endDate = new Date(endDate)
    }

    let paramsE = `doctype=Room+Folio+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&filters=${JSON.stringify(filtersE)}&limit_page_length=None`;
    let eventsArray = await apiPostCall('/', paramsE, window.frappe?.csrf_token)
    for (let item of eventsArray) {
        item.startDate = new Date(item.check_in)
        item.endDate = new Date(item.check_out)
        item.id = item.name
        item.resourceId = item.room_no
        item.text = item.customer
    }

    schedule.resourceStore.data = resourcesArray
    schedule.eventStore.data = eventsArray
    Mask.unmask();
}

export const settings = async () => {
    const schedule = window.bryntum.get('scheduler');

    // Contact
    let contactParams = `doctype=Contact&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let contactArray = await apiPostCall('/', contactParams, window.frappe?.csrf_token)
    for (let item of contactArray) {
        item.id = item.name
        item.text = item.name
    }
    window.sessionStorage.setItem('contacts', JSON.stringify(contactArray))

    // Company
    let companyParams = `doctype=Company&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let companyArray = await apiPostCall('/', companyParams, window.frappe?.csrf_token)
    for (let item of companyArray) {
        item.id = item.name
        item.text = item.name
    }
    let companyCombo = schedule.tbar.items[2]
    companyCombo.store.data = companyArray

    // Room Status
    let statusParams = `doctype=Room+Status&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let statusArray = await apiPostCall('/', statusParams, window.frappe?.csrf_token)
    for (let item of statusArray) {
        item.id = item.name
        item.text = item.name
    }

    let statusCombo = schedule.tbar.items[5]
    statusCombo.store.data = statusArray
    window.sessionStorage.setItem('roomStatus', JSON.stringify(statusArray))


    // Customer
    let customerParams = `doctype=Customer&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let customerArray = await apiPostCall('/', customerParams, window.frappe?.csrf_token)
    for (let item of customerArray) {
        item.id = item.name
        item.text = item.name
    }
    customerArray.push({ id: 'new', text: "Add New" })
    window.sessionStorage.setItem('customers', JSON.stringify(customerArray))

    // Package
    let packageParams = `doctype=Item&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let packageArray = await apiPostCall('/', packageParams, window.frappe?.csrf_token)
    for (let item of packageArray) {
        item.id = item.name
        item.text = item.name
    }
    window.sessionStorage.setItem('packages', JSON.stringify(packageArray))
}

export const saveData = async (event) => {
    const schedule = window.bryntum.get('scheduler');
    const resource = schedule.resourceStore.data.filter(element => element.name == event.resourceId);
    let date = new Date()
    let data = JSON.stringify(
        {
            "customer": event?.customer?.name,
            "order_type": "Sales",
            "company": resource[0].company,
            "transaction_date": `${date.getFullYear()}-${date.getMonth() - 1}-${date.getDate()}`,
            "guest_cf": event?.contact?.name,
            "currency": "INR",
            "conversion_rate": 1,
            "selling_price_list": "Standard Selling",
            "price_list_currency": "INR",
            "plc_conversion_rate": 1,
            "check_in_cf": Config.formatTime(event.startDate),
            "no_of_nights_cf": Config.days(event.endDate, event.startDate),
            "check_out_cf": Config.formatTime(event.endDate),
            "room_type_cf": resource[0].room_type,
            "room_package_cf": event.room_package.name,
            "status": "Draft",
            "items": [
                {
                    "item_code": event.room_package.name,
                    "item_group": "Room Charge",
                    "stock_uom": "Nos",
                    "qty": event.rooms,
                }
            ],
        }
    );
    let bookRoom = await apiPostCall('/api/resource/Sales Order', data, window.frappe?.csrf_token)
}