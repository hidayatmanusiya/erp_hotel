let { DateHelper, Widget } = window.bryntum.scheduler;
import { apiPostCall } from './SiteAPIs'
import { searchData } from '../common/Datalayer';
export const columns = [
    {
        text: 'status', field: 'status', width: 20, region: 'left',
        htmlEncode: false,
        editor: null,
        renderer({ value }) {
            let roomStatus = JSON.parse(window.sessionStorage.getItem('roomStatus'))
            if (roomStatus) {
                const status = roomStatus.filter(element => element.name == value);
                return `<div class="capacity b-fa b-fa-${status[0]?.icon}"></div>`;
            }
        }
    },
    { text: '', editor: null, sort: null, field: 'room_type', width: 100, region: 'left' },
    { text: 'Room No', editor: null, field: 'room_no', width: 100, region: 'left' },
]

export const localTooltips = {
    header: {
        titleAlign: 'start'
    },
    onBeforeShow({ source: tooltip }) {
        tooltip.title = tooltip.eventRecord.customer
    },
    template: data => {
        let newData = data.eventRecord.data
        return `<dl>
        <dt>Company:  <b>${newData.company}</b></dt>
        <dt>Room NO:  <b>${newData.room_no}</b></dt>
        <dt>Room Package:  <b>${newData.room_package}</b></dt>
        <dt>Check In/Out: <b>${DateHelper.format(data.eventRecord.startDate, 'ddd MM/DD')} - ${DateHelper.format(data.eventRecord.endDate, 'ddd MM/DD')}</b></dt>
    </dl>
    `
    }
}

export const tbar = [
    {
        type: 'DateField',
        ref: 'startDate',
        name: 'start_date',
        weight: 50,
        placeholder: 'Start Date',
        clearable: true,
    },
    {
        type: 'DateField',
        ref: 'endDate',
        name: 'end_date',
        weight: 50,
        placeholder: 'End Date',
        clearable: true,
    },
    {
        type: 'combo',
        ref: 'companyCombo',
        name: 'companys',
        placeholder: 'Select Company',
        weight: 50,
        multiSelect: true,
        clearable: true,
        listeners: {
            async change({ value }) {
                // Property
                let filters = []
                let propertyArray = []
                for (let item of value) {
                    filters.push(["Property", "company", "=", item.name])
                }
                if (filters.length > 0) {
                    let propertyParams = `doctype=Property&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&filters=${JSON.stringify(filters)}&limit_page_length=None`;
                    propertyArray = await apiPostCall('/', propertyParams, window.frappe?.csrf_token)
                    for (let item of propertyArray) {
                        item.id = item.name
                        item.text = item.name
                    }
                }
                const schedule = window.bryntum.get('scheduler');
                let propertieCombo = schedule.tbar.items[3]
                propertieCombo.store.data = propertyArray
            }
        }
    },
    {
        type: 'combo',
        ref: 'propertieCombo',
        items: [],
        name: 'properties',
        weight: 50,
        placeholder: 'Select Propertie',
        clearable: true,
        multiSelect: true,
        listeners: {
            async change({ value }) {
                // Room Type
                let filters = []
                let roomTypeArray = []
                for (let item of value) {
                    // filters.push(["Property Child table", "property_name", "=", item.name])
                }
                // if (filters.length > 0) {
                let roomTypeParams = `doctype=Room+Type+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&filters=${JSON.stringify(filters)}&limit_page_length=None`;
                roomTypeArray = await apiPostCall('/', roomTypeParams, window.frappe?.csrf_token)
                for (let item of roomTypeArray) {
                    item.id = item.name
                    item.text = item.name
                }
                // }
                const schedule = window.bryntum.get('scheduler');
                let roomTypeCombo = schedule.tbar.items[4]
                roomTypeCombo.store.data = roomTypeArray
            }
        }
    },
    {
        type: 'combo',
        ref: 'roomTypeCombo',
        name: 'roomType',
        weight: 50,
        placeholder: 'Select RoomType',
        multiSelect: true,
        clearable: true,
        listeners: {

        }
    },
    {
        type: 'combo',
        ref: 'statusCombo',
        name: 'status',
        weight: 50,
        multiSelect: true,
        placeholder: 'Select Status',
        clearable: true,
        listeners: {

        }
    },
    {
        type: 'button',
        cls: 'b-raised',
        icon: 'b-fa-search',
        color: 'green',
        onClick: () => {
            const schedule = window.bryntum.get('scheduler');
            let searchItems = schedule.tbar.items
            let startDate = searchItems[0]?.value
            let endDate = searchItems[1]?.value
            let company = searchItems[2]?.value
            let properties = searchItems[3]?.value ? searchItems[3]?.value : []
            let propertie = []
            for (let item of properties) {
                propertie.push(item.data.name)
            }
            let roomTypes = searchItems[4]?.value ? searchItems[4]?.value : []
            let roomType = []
            for (let item of roomTypes) {
                roomType.push(item.data.name)
            }
            let status = searchItems[5]?.value
            searchData({ startDate, endDate, company, propertie, roomType, status })
        }
    }
]

export const EventEdit = {
    items: {
        nameField: null,
        resourceField: null,
        deleteEvent: null,
        startDateField: {
            label: 'Check In'
        },
        endDateField: {
            label: 'Check Out'
        },
        customerCombo: {
            type: 'combo',
            ref: 'customerCombo',
            items: [],
            name: 'customer',
            label: 'Customer',
            placeholder: 'Select customer',
            weight: 130,
            clearable: true,
        },
        packageCombo: {
            type: 'combo',
            ref: 'packageCombo',
            name: 'room_package',
            items: [],
            label: 'Package',
            placeholder: 'Select Package',
            weight: 130,
            clearable: true,
        },
    },
    bbar: {
        items: {
            deleteButton: {
                hidden: true
            }
        }
    },
}