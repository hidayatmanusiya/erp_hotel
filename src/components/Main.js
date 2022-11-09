import Schedule from "./Schedule";
import { settings, searchData, saveData, myStore } from '../common/Datalayer';
import { columns, localTooltips, tbar, EventEdit } from '../common/Columns';
import Config from '../common/Config'
import Toolbar from './Toolbar'
let { StringHelper, DateHelper } = window.bryntum.scheduler;

let schedule = new Schedule({
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
        eventTooltip: localTooltips,
        group: 'room_type_name',
        eventEdit: EventEdit,

    },
    // createEventOnDblClick: false,
    columns: columns,
    rowHeight: 20,
    viewPreset: {
        base: 'dayAndWeek',
        tickWidth: 10,
        headers: [
            {
                unit: 'day',
                align: 'center',
                renderer: (startDate, endDate) => `<div>${DateHelper.format(startDate, 'dd, DD MMM')}</div>`
            }
        ]
    },
    eventLayout: 'none',
    managedEventSizing: false,
    listeners: {
        beforeEventEdit({ eventRecord, editor }) {
            if (eventRecord.data.idx == 0) {
                if (eventRecord.data.check_in) {
                    window.open(Config.apiURL + "/app/room-folio-hms/" + eventRecord.data.name, '_blank');
                } else {
                    window.open(Config.apiURL + "/app/sales-order/" + eventRecord.data.name, '_blank');
                }
                return false
            }
        },
        beforeEventEditShow({ eventRecord, editor }) {
            editor.title = (eventRecord.data.idx == 0) ? `Modifier ${eventRecord.name || ''}` : 'New Booking';
            let customers = JSON.parse(window.sessionStorage.getItem('customers'))
            let customersCombo = editor.items[0]
            customersCombo.store.data = customers
            let contacts = JSON.parse(window.sessionStorage.getItem('contacts'))
            let contactsCombo = editor.items[1]
            contactsCombo.store.data = contacts
            let packages = JSON.parse(window.sessionStorage.getItem('packages'))
            let packagesCombo = editor.items[2]
            packagesCombo.store.data = packages

        },
        afterEventSave({ eventEdit, eventRecord }) {
            saveData(eventRecord.data);
        },
    },
    eventRenderer({ eventRecord, resourceRecord, renderData }) {
        let startEndMarkers = '';
        renderData.cls[eventRecord.status] = 1;
        return startEndMarkers + StringHelper.encodeHtml(eventRecord?.customer ? (eventRecord?.customer?.customer_name ? eventRecord?.customer?.customer_name : eventRecord.customer) : 'New');
    },
    tbar: tbar
});

setTimeout(() => {
    searchData({ startDate: null, endDate: null, company: [], propertie: [], roomType: [], status: [] })
    settings()
}, 1000);