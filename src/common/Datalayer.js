import { apiPostCall } from './SiteAPIs'
let { Mask } = window.bryntum.scheduler;

export const getData = async () => {
    Mask.mask({
        text: 'Loading Data ...',
        mode: 'dark-blur'
    });

    let paramsR = `doctype=Room+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let resourcesArray = await apiPostCall('/', paramsR, frappe?.csrf_token)
    for (let item of resourcesArray) {
        item.id = item.name
    }
    let paramsE = `doctype=Room+Folio+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&limit_page_length=None`;
    let eventsArray = await apiPostCall('/', paramsE, frappe?.csrf_token)
    for (let item of eventsArray) {
        item.startDate = new Date(item.check_in)
        item.endDate = new Date(item.check_out)
        item.id = item.name
        item.resourceId = item.room_no
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
    }
    return res;
}