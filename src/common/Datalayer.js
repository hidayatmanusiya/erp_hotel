import { apiPostCall } from './SiteAPIs'
import Config from './Config'
const { Mask } = window.bryntum.scheduler;
let roomStatus = []

export const searchData = async (params) => {
    Mask.mask({
        text: 'Loading Data ...',
        mode: 'dark-blur'
    });
    console.log(params)
    // Room HMS
    let paramsR = `doctype=Room+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let resourcesArray = await apiPostCall('/', paramsR, window.frappe?.csrf_token)
    for (let item of resourcesArray) {
        item.id = item.name
    }
    // Room Folio HMS
    let paramsE = `doctype=Room+Folio+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let eventsArray = await apiPostCall('/', paramsE, window.frappe?.csrf_token)
    for (let item of eventsArray) {
        item.startDate = new Date(item.check_in)
        item.endDate = new Date(item.check_out)
        item.id = item.name
        item.resourceId = item.room_no
        item.text = item.customer
    }
    const schedule = window.bryntum.get('scheduler');
    schedule.resourceStore.data = resourcesArray
    schedule.eventStore.data = eventsArray
    Mask.unmask();
}

export const getData = async () => {
    Mask.mask({
        text: 'Loading Data ...',
        mode: 'dark-blur'
    });

    if (window.frappe?.csrf_token == 'None') {
        location.replace(`${window.location.origin}/login`)
    }

    // Customer
    let customerParams = `doctype=Customer&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let customerArray = await apiPostCall('/', customerParams, window.frappe?.csrf_token)
    for (let item of customerArray) {
        item.id = item.name
        item.text = item.name
    }

    // Company
    let companyParams = `doctype=Company&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let companyArray = await apiPostCall('/', companyParams, window.frappe?.csrf_token)
    for (let item of companyArray) {
        item.id = item.name
        item.text = item.name
    }

    // Room Status
    let statusParams = `doctype=Room+Status&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let statusArray = await apiPostCall('/', statusParams, window.frappe?.csrf_token)
    for (let item of statusArray) {
        item.id = item.name
        item.text = item.name
    }
    roomStatus = statusArray


    // Item
    let itemParams = `doctype=Item&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let itemArray = await apiPostCall('/', itemParams, window.frappe?.csrf_token)
    for (let item of itemArray) {
        item.id = item.name
        item.text = item.name
    }

    // Room HMS
    let paramsR = `doctype=Room+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let resourcesArray = await apiPostCall('/', paramsR, window.frappe?.csrf_token)
    for (let item of resourcesArray) {
        item.id = item.name
    }
    // Room Folio HMS
    let paramsE = `doctype=Room+Folio+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let eventsArray = await apiPostCall('/', paramsE, window.frappe?.csrf_token)
    for (let item of eventsArray) {
        item.startDate = new Date(item.check_in)
        item.endDate = new Date(item.check_out)
        item.id = item.name
        item.resourceId = item.room_no
        item.text = item.customer
    }

    Mask.unmask();
    let res = {
        "success": true,
        "resources": {
            "rows": resourcesArray
        },
        "events": {
            "rows": eventsArray
        },
        "customers": {
            "rows": customerArray
        },
        "companys": {
            "rows": companyArray
        },
        "items": {
            "rows": itemArray
        },
        "status": {
            "rows": statusArray
        },
    }
    return res;
}

export const saveData = async (event) => {
    const schedule = window.bryntum.get('scheduler');
    const resource = schedule.resourceStore.data.filter(element => element.name == event.resourceId);
    var data = JSON.stringify({
        "status": "Pre CheckIn",
        "customer": event.customer,
        "company": resource[0].company,
        "room_type": resource[0].room_type,
        "room_no": resource[0].room_no,
        "room_package": event.room_package,
        "check_in": Config.formatTime(event.startDate),
        "check_out": Config.formatTime(event.endDate)
    });
    let bookRoom = await apiPostCall('/api/resource/Room Folio HMS', data, window.frappe?.csrf_token)
    console.log(bookRoom)
}