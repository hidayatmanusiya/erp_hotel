let { DateHelper, ResourceStore } = window.bryntum.scheduler;
import { searchData, feachProperty, feachRoomType, feachContacts } from '../common/Datalayer';
import Config from './Config'
let endDate = new Date()
endDate.setDate(endDate.getDate() + 14)

export const columns = [
    {
        text: 'Status',
        field: 'status',
        tooltip: 'Status',
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
    { text: 'Room Type', tooltip: 'Room Type', editor: null, sort: null, field: 'room_type', width: 100, region: 'left' },
    { text: `Room No`, id: "room_column", tooltip: 'Room No', editor: null, field: 'room_no', width: 100, region: 'left' },
]

export const localTooltips = {
    header: {
        titleAlign: 'start'
    },
    onBeforeShow({ source: tooltip }) {
        tooltip.title = tooltip?.eventRecord?.customer?.data?.name ? tooltip.eventRecord.customer.data.name : tooltip.eventRecord.customer
    },
    template: data => {
        let newData = data.eventRecord.data
        return `<dl>
        <dt>Contact:  <b>${newData?.contact_display ? newData?.contact_display : ''}</b></dt>
        <dt>Company:  <b>${newData?.company ? newData?.company : ''}</b></dt>
        <dt>Room NO:  <b>${newData?.room_no ? newData?.room_no : newData?.resourceId}</b></dt>
        <dt>Room Package:  <b>${newData?.room_package ? newData?.room_package?.name : newData?.room_package_cf}</b></dt>
        <dt>Room Rate:  <b>${newData?.room_rate_cf}</b></dt>
        <dt>Check In/Out: <b>${DateHelper.format(data.eventRecord.startDate, 'ddd MM/DD')} - ${DateHelper.format(data.eventRecord.endDate, 'ddd MM/DD')}</b></dt>
    </dl>
    `
    }
}

export const tbar = [
    {
        type: 'textfield',
        ref: 'filterCustomers',
        icon: 'b-fa b-fa-filter',
        cls: 'customer-search',
        weight: 50,
        placeholder: 'Find Guest',
        clearable: true,
        keyStrokeChangeDelay: 100,
        triggers: {
            filter: {
                align: 'start',
                cls: 'b-fa b-fa-filter'
            }
        },
        listeners: {
            change: async ({ value }) => {
                const schedule = window.bryntum.get('scheduler');
                let items = schedule.tbar.items
                const selList = items.find(element => element._ref == 'listCustomers');
                if (value) {
                    let data = await feachContacts([["Contact", "name", "like", `%${value}%`]])
                    selList.store.data = data
                } else {
                    selList.store.data = []
                }
            }
        }
    },
    {
        type: 'list',
        ref: 'listCustomers',
        cls: 'customer-list',
        itemTpl: item => `<i>${item.name}</i>`,
        items: [],
        onItem({ record }) {
            window.open(`${Config.siteUrl}/app/query-report/Guest%20History%20HMS?guest=${record.name}&date=today`, '_blank')
            const schedule = window.bryntum.get('scheduler');
            let items = schedule.tbar.items
            const selList = items.find(element => element._ref == 'listCustomers');
            selList.store.data = []
            const selFilter = items.find(element => element._ref == 'filterCustomers');
            selFilter.value = null
        }
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
                for (let item of value) {
                    filters.push(["Property", "company", "=", item.name])
                }
                feachProperty(filters)
                setTimeout(() => searchData(), 10)
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
            async change({ value }) {
                // RoomType
                let filters = []
                for (let item of value) {
                    filters.push(["Property", "company", "=", item.name])
                }
                // feachRoomType(filters)
                setTimeout(() => searchData(), 10)
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
            async change() {
                setTimeout(() => searchData(), 10)
            }
        }
    },
    // {
    //     type: 'combo',
    //     ref: 'statusCombo',
    //     name: 'status',
    //     weight: 50,
    //     multiSelect: true,
    //     placeholder: 'Select Status',
    //     clearable: true,
    //     chipView: {
    //         scrollable: {
    //             overflowY: false,
    //             overflowX: 'hidden-scroll'
    //         },
    //         style: {
    //             flexFlow: 'nowrap',
    //             fontSize: 12
    //         }
    //     },
    //     listeners: {

    //     }
    // },
    // {
    //     type: 'button',
    //     cls: 'b-raised',
    //     icon: 'b-fa-search',
    //     color: 'green',
    //     onClick: () => {
    //         const schedule = window.bryntum.get('scheduler');
    //         let searchItems = schedule.tbar.items
    //         let startDate = searchItems[0]?.value
    //         let endDate = searchItems[1]?.value
    //         let company = searchItems[2]?.value
    //         let properties = searchItems[3]?.value ? searchItems[3]?.value : []
    //         let propertie = []
    //         for (let item of properties) {
    //             propertie.push(item.data.name)
    //         }
    //         let roomTypes = searchItems[4]?.value ? searchItems[4]?.value : []
    //         let roomType = []
    //         for (let item of roomTypes) {
    //             roomType.push(item.data.name)
    //         }
    //         let status = searchItems[5]?.value
    //         searchData({ startDate, endDate, company, propertie, roomType, status })
    //     }
    // }
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
                        window.open(Config.siteUrl + "/app/customer/new-customer-1", '_blank');
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
            listeners: {
                select: (e) => {
                    if (e?.record?.data?.id && e?.record?.data?.id == 'new') {
                        window.open(Config.siteUrl + "/app/contact/new-contact-1", '_blank');
                    }
                },
            },
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