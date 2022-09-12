import Schedule from "./Schedule";
import { getData, searchData, saveData } from '../common/Datalayer';
import { apiPostCall } from '../common/SiteAPIs'
import Toolbar from './Toolbar'
let { Mask, StringHelper, DateHelper, EventStore, ResourceStore } = window.bryntum.scheduler;
let schedule
Mask.mask({
    text: 'Loading Data ...',
    mode: 'dark-blur'
});
setTimeout(() => {
    getData().then((data) => {
        schedule = new Schedule({
            ref: 'schedule',
            id: 'scheduler',
            insertFirst: 'main',
            features: {
                // eventDragCreate: false,
                eventResize: false,
                eventTooltip: false,
                stickyEvents: false,
                eventDrag: {
                    disabled: true
                },
                group: 'room_type_name',
                eventEdit: {
                    editorConfig: {
                        title: "New Booking"
                    },
                    // Add extra widgets to the event editor
                    items: {
                        nameField: null,
                        resourceField: null,
                        startDateField: {
                            label: 'Check In'
                        },
                        endDateField: {
                            label: 'Check Out'
                        },
                        customerCombo: {
                            type: 'combo',
                            ref: 'customerCombo',
                            store: data.customers.rows,
                            name: 'customer',
                            label: 'Customer',
                            placeholder: 'Select customer',
                            weight: 130,
                            clearable: true,
                        },
                        packageCombo: {
                            type: 'combo',
                            ref: 'packageCombo',
                            store: data.items.rows,
                            name: 'room_package',
                            label: 'Package',
                            placeholder: 'Select Package',
                            weight: 130,
                            clearable: true,
                        },
                    }
                },

            },
            columns: [
                {
                    text: 'status', field: 'status', width: 20, region: 'left',
                    htmlEncode: false,
                    editor: null,
                    renderer({ value }) {
                        const status = data.status.rows.filter(element => element.name == value);
                        return `<div class="capacity b-fa b-fa-${status[0]?.icon}"></div>`;
                    }
                },
                { text: '', editor: null, sort: null, field: 'room_type', width: 100, region: 'left' },
                { text: 'Room No', editor: null, field: 'room_no', width: 100, region: 'left' },
            ],

            rowHeight: 40,
            // startDate: new Date(2017, 5, 1),
            // endDate: new Date(2017, 5, 11),
            viewPreset: {
                base: 'dayAndWeek',
                headers: [
                    {
                        unit: 'day',
                        align: 'center',
                        renderer: (startDate, endDate) => `
                        <div>${DateHelper.format(startDate, 'ddd')}</div>
                        <div>${DateHelper.format(startDate, 'DD MMM')}</div>
                    `
                    }
                ]
            },
            eventLayout: 'none',
            managedEventSizing: false,

            crudManager: {
                autoLoad: true,
                resourceStore: new ResourceStore({
                    data: data.resources.rows
                }),
                eventStore: new EventStore({
                    data: data.events.rows,
                })
            },
            listeners: {
                afterEventSave({ eventEdit, eventRecord }) {
                    saveData(eventRecord.data);
                }
            },
            eventRenderer({ eventRecord, resourceRecord, renderData }) {
                let startEndMarkers = '';
                renderData.cls[eventRecord.status] = 1;

                // if (eventRecord.status) {
                //     startEndMarkers = `<i class="b-start-marker ${eventRecord.startInfoIcon}" data-btip="${eventRecord.startInfo}"></i>`;
                // }
                // if (eventRecord.workflow_state) {
                //     startEndMarkers += `<i class="b-end-marker ${eventRecord.endInfoIcon}" data-btip="${eventRecord.endInfo}"></i>`;
                // }

                return startEndMarkers + StringHelper.encodeHtml(eventRecord.customer);
            },

            tbar: [
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
                    items: data.companys.rows,
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
                                filters.push(["Property", "company", "=", item])
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
                    store: data.status.rows,
                    name: 'status',
                    weight: 50,
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
        });




    })
}, 1000);