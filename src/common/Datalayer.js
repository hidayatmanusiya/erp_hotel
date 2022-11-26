import { apiPostCall, apiPutCall } from './SiteAPIs'
import Config from './Config'
import { cusDate } from '../components/Toolbar';
const { Mask } = window.bryntum.scheduler;

export const searchData = async () => {

    Mask.mask({
        text: 'Loading Data ...',
        mode: 'dark-blur'
    });
    const schedule = window.bryntum.get('scheduler');
    let items = schedule.tbar.items


    // Room HMS & Room Folio HMS
    let filtersR = []
    let filtersE = []
    let filtersS = []

    const selCompany = items.find(element => element._ref == 'companyCombo');
    if (selCompany?.value) {
        for (let item of selCompany?.value) {
            filtersR.push(["Room HMS", "company", "=", item.name])
            filtersE.push(["Room Folio HMS", "company", "=", item.name])
            filtersS.push(["Sales Order", "company", "=", item.name])
        }
    }
    const selPropertie = items.find(element => element._ref == 'propertieCombo');
    if (selPropertie?.value) {
        for (let item of selPropertie?.value) {
            filtersR.push(["Room HMS", "property", "=", item.name])
            filtersE.push(["Room Folio HMS", "property", "=", item.name])
            filtersS.push(["Sales Order", "property", "=", item.name])
        }
    }
    const selRoomType = items.find(element => element._ref == 'roomTypeCombo');
    if (selRoomType?.value) {
        for (let item of selRoomType?.value) {
            filtersR.push(["Room HMS", "room_type", "=", item.name])
            filtersE.push(["Room Folio HMS", "room_type", "=", item.name])
            filtersS.push(["Sales Order", "room_type", "=", item.name])
        }
    }
    // const selStatus = items.find(element => element._ref == 'statusCombo');
    // if (selStatus?.value) {
    //     for (let item of selStatus?.value) {
    //         filtersR.push(["Room HMS", "status", "=", item.name])
    //     }
    // }
    let paramsR = `doctype=Room+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["name", "status", "room_type", "room_type_name", "room_no", "company", "abbr", "property"])}&or_filters=${JSON.stringify(filtersR)}&limit_page_length=None`;
    let resourcesArray = await apiPostCall('/', paramsR, window.frappe?.csrf_token)
    for (let item of resourcesArray) {
        item.id = item.name
    }

    // Room Folio HMS
    let filtersEAnd = []
    let filtersSAnd = []

    const setType = schedule.setType

    if (cusDate.value.value && setType) {
        let date = new Date(cusDate.value)
        let month = date.getMonth() + 1
        let fromDate = `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`
        filtersEAnd.push(["Room Folio HMS", "check_in", ">=", fromDate])
        filtersSAnd.push(["Sales Order", "check_in_cf", ">=", fromDate])

        let date1 = new Date(cusDate.value)
        if (setType == 'day') {
            date1.setDate(date1.getDate() + 1)
        }
        if (setType == 'week') {
            date1.setDate(date1.getDate() + 7)
        }
        if (setType == 'month') {
            date1.setDate(date1.getDate() + 30)
        }
        let month1 = date1.getMonth() + 1
        let fromDate1 = `${date1.getFullYear()}-${month1 < 10 ? "0" + month1 : month1}-${date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate()}`
        filtersEAnd.push(["Room Folio HMS", "check_out", "<=", fromDate1])
        filtersSAnd.push(["Sales Order", "check_out_cf", "<=", fromDate1])
    }

    let paramsE = `doctype=Room+Folio+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&filters=${JSON.stringify(filtersEAnd)}&or_filters=${JSON.stringify(filtersE)}&limit_page_length=None`;
    let eventsArray = await apiPostCall('/', paramsE, window.frappe?.csrf_token)
    let paramsS = `doctype=Sales+Order&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&filters=${JSON.stringify(filtersSAnd)}&or_filters=${JSON.stringify(filtersE)}&limit_page_length=None`;
    let eventsArrayS = await apiPostCall('/', paramsS, window.frappe?.csrf_token)
    let events = []
    let tempEventIds = {}
    for (let item of eventsArray) {
        if (item.status == 'Pre-Check In' || item.status == 'Checked In' || item.status == 'Checked Out') {
            let startDate = new Date(item.check_in)
            let endDate = new Date(item.check_out)
            startDate.setHours(0, 0, 0, 0)
            endDate.setHours(0, 0, 0, 0)
            item.startDate = startDate
            item.endDate = endDate
            item.id = item.name
            item.resourceId = item.room_no
            item.text = item.customer
            events.push(item)
            tempEventIds[item.reservation] = true
        }
    }
    for (let item of eventsArrayS) {
        if (item.name in tempEventIds == false) {
            let startDate = new Date(item.check_in_cf)
            let endDate = new Date(item.check_out_cf)
            startDate.setHours(0, 0, 0, 0)
            endDate.setHours(0, 0, 0, 0)
            item.startDate = startDate
            item.endDate = endDate
            item.id = item.name
            item.resourceId = item.room_no
            item.text = item.customer
            events.push(item)
        }
    }
    schedule.resourceStore.data = resourcesArray
    schedule.eventStore.data = events
    schedule.columns.getById('room_column').text = `Room No (${resourcesArray.length})`
    schedule.columns.getById('room_column').tooltip = `Room No (${resourcesArray.length})`
    Mask.unmask();
}

export const feachProperty = async (filters) => {
    const schedule = window.bryntum.get('scheduler');
    let items = schedule.tbar.items
    let params = `doctype=Property&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&or_filters=${JSON.stringify(filters)}&limit_page_length=None`;
    let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
    for (let item of dataArray) {
        item.id = item.name
        item.text = item.name
    }
    const comboPropertie = items.find(element => element._ref == 'propertieCombo');
    comboPropertie.store.data = dataArray
}

export const feachRoomType = async (filters) => {
    const schedule = window.bryntum.get('scheduler');
    let items = schedule.tbar.items
    let params = `doctype=Room+Type+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&or_filters=${JSON.stringify(filters)}&limit_page_length=None`;
    let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
    for (let item of dataArray) {
        item.id = item.name
        item.text = item.name
    }
    const comboPropertie = items.find(element => element._ref == 'roomTypeCombo');
    comboPropertie.store.data = dataArray
}

export const feachRoomStatus = async (filters) => {
    const schedule = window.bryntum.get('scheduler');
    let items = schedule.tbar.items
    let params = `doctype=Room+Status&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&or_filters=${JSON.stringify(filters)}&limit_page_length=None`;
    let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
    for (let item of dataArray) {
        item.id = item.name
        item.text = item.name
    }
    const comboPropertie = items.find(element => element._ref == 'statusCombo');
    comboPropertie.store.data = dataArray
}

export const feachPackages = async (filters) => {
    let params = `doctype=Item&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&or_filters=${JSON.stringify(filters)}&limit_page_length=None`;
    let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
    for (let item of dataArray) {
        item.id = item.name
        item.text = item.name
    }
    return dataArray
}

export const feachCustomers = async (filters) => {
    let params = `doctype=Customer&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&or_filters=${JSON.stringify(filters)}&limit_page_length=None`;
    let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
    for (let item of dataArray) {
        item.id = item.name
        item.text = item.name
    }
    return dataArray
}

export const feachContacts = async (filters) => {
    let params = `doctype=Contact&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&or_filters=${JSON.stringify(filters)}&limit_page_length=None`;
    let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
    for (let item of dataArray) {
        item.id = item.name
        item.text = item.name
    }
    return dataArray
}

export const feachCompanys = async (filters) => {
    const schedule = window.bryntum.get('scheduler');
    let items = schedule.tbar.items

    let params = `doctype=Company&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&or_filters=${JSON.stringify(filters)}&limit_page_length=None`;
    let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
    for (let item of dataArray) {
        item.id = item.name
        item.text = item.company_shrot_name ? item.company_shrot_name : item.name
    }
    const comboCompany = items.find(element => element._ref == 'companyCombo');
    comboCompany.store.data = dataArray
}

export const settings = async () => {

    if (window.frappe?.csrf_token == 'None') {
        location.replace(`${Config.siteUrl}/login`)
    }

    await feachCompanys([])
    await feachProperty([])
    await feachRoomType([])
    // await feachRoomStatus([])

    const schedule = window.bryntum.get('scheduler');
    let items = schedule.tbar.items

    let startDate = new Date()
    let endDate = new Date()
    endDate.setDate(endDate.getDate() + 7)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    schedule.startDate = startDate
    schedule.endDate = new Date(endDate)
    schedule.setType = 'week'

    let company = ''
    let property = ''
    let params = `doctype=HMS+Setting&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&or_filters=${JSON.stringify([])}&limit_page_length=None`;
    let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
    if (dataArray && dataArray[0]) {
        company = dataArray[0]['company']
        const selCompany = items.find(element => element._ref == 'companyCombo');
        selCompany.value = company

        property = dataArray[0]['property']
        const selPropertie = items.find(element => element._ref == 'propertieCombo');
        selPropertie.value = property
    }
    searchData()
}

export const ChangeRoomStatus = async (roomId, status) => {
    let data = JSON.stringify({ "status": status });
    let roomStatus = await apiPutCall(`/api/resource/Room HMS/${roomId}`, data, window.frappe?.csrf_token)
    if (roomStatus) {
        searchData()
    }
}

export const saveData = async (event) => {
    const schedule = window.bryntum.get('scheduler');
    const resource = schedule.resourceStore.data.filter(element => element.name == event.resourceId);
    let date = new Date()
    let data = JSON.stringify(
        {
            "customer": event?.customer?.data?.name,
            "order_type": "Sales",
            "company": resource[0].company,
            "transaction_date": `${date.getFullYear()}-${date.getMonth() - 1}-${date.getDate()}`,
            "guest_cf": event?.contact?.data?.name,
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
            "number_of_room": event.rooms,
            "room_no": resource[0].name,
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
    if (bookRoom) {
        searchData()
    }
}