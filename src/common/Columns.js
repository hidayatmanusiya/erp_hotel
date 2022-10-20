let { DateHelper } = window.bryntum.scheduler;
import { apiPostCall } from './SiteAPIs'
import { searchData } from '../common/Datalayer';
import Config from './Config'
let endDate = new Date()
endDate.setDate(endDate.getDate() + 14)

export const columns = [
    {
        text: 'Status',
        field: 'status',
        width: 20,
        region: 'left',
        htmlEncode: false,
        renderer({ value }) {
            let roomStatus = JSON.parse(window.sessionStorage.getItem('roomStatus'))
            if (roomStatus) {
                const status = roomStatus.filter(element => element.name == value);
                return `<div class="capacity b-fa b-fa-${status[0]?.icon}"></div>`;
            }
        },
        editor: {
            type: 'combo',
            items: ['Out Of Order', 'Availabel', 'Dirty', 'Occupied'],
            editable: false,
            listeners: {
                select: (e) => {
                    if (e?.source?.initialValue != e?.record?.data?.text) {
                        //    console.log(e?.source)
                        //    debugger
                    }
                },
            },
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
        value: new Date(),
        weight: 50,
        placeholder: 'Start Date',
        clearable: true,
    },
    {
        type: 'DateField',
        ref: 'endDate',
        name: 'end_date',
        value: endDate,
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
        chipView: {
            scrollable: {
                overflowY: false,
                overflowX: 'hidden-scroll'
            },
            style: {
                flexFlow: 'nowrap',
                fontSize: 12
            }
        },
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
                const comboPropertie = schedule.tbar.items.find(element => element._ref == 'propertieCombo');
                comboPropertie.store.data = propertyArray

                // roomTypeArray
                let roomTypeArray = []
                let roomTypeParams = `doctype=Room+Type+HMS&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&filters=${JSON.stringify([])}&limit_page_length=None`;
                roomTypeArray = await apiPostCall('/', roomTypeParams, window.frappe?.csrf_token)
                for (let item of roomTypeArray) {
                    item.id = item.name
                    item.text = item.name
                }
                const comboRoomType = schedule.tbar.items.find(element => element._ref == 'roomTypeCombo');
                comboRoomType.store.data = roomTypeArray

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
        chipView: {
            scrollable: {
                overflowY: false,
                overflowX: 'hidden-scroll'
            },
            style: {
                flexFlow: 'nowrap',
                fontSize: 12
            }
        },
        listeners: {

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
        chipView: {
            scrollable: {
                overflowY: false,
                overflowX: 'hidden-scroll'
            },
            style: {
                flexFlow: 'nowrap',
                fontSize: 12
            }
        },
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
        chipView: {
            scrollable: {
                overflowY: false,
                overflowX: 'hidden-scroll'
            },
            style: {
                flexFlow: 'nowrap',
                fontSize: 12
            }
        },
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
            placeholder: 'Select Customer',
            weight: 130,
            clearable: true,
            triggerAction: 'all',
            listeners: {
                select: (e) => {
                    if (e?.record?.data?.id && e?.record?.data?.id == 'new') {
                        window.open(Config.apiURL + "/app/user/new-user-1", '_blank');
                    }
                },
            },
        },
        contactsCombo: {
            type: 'combo',
            ref: 'contactsCombo',
            name: 'contact',
            items: [],
            label: 'Contact',
            placeholder: 'Select Contact',
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
        roomsCombo: {
            type: 'combo',
            ref: 'roomsCombo',
            name: 'rooms',
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            label: 'No of Room',
            placeholder: 'Select Rooms',
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