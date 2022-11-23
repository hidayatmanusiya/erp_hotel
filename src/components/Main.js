import Schedule from "./Schedule";
import { settings, searchData, saveData, feachCustomers, feachContacts, feachPackages } from '../common/Datalayer';
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
        nonWorkingTime: true,
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
                renderer: (startDate, endDate) => `<div>${DateHelper.format(startDate, 'dd DD MMM')}</div>`
            },
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
        async beforeEventEditShow({ eventRecord, editor }) {
            editor.title = (eventRecord.data.idx == 0) ? `Modifier ${eventRecord.name || ''}` : 'New Booking';

            let customers = await feachCustomers({})
            customers.unshift({ id: 'new', text: "Add New Customer", eventColor: 'green' })
            let customersCombo = editor.items.find(element => element._ref == 'customerCombo');
            customersCombo.store.data = customers

            let contacts = await feachContacts({})
            contacts.unshift({ id: 'new', text: "Add New contact", eventColor: 'green' })
            let contactsCombo = editor.items.find(element => element._ref == 'contactsCombo');
            contactsCombo.store.data = contacts

            let packages = await feachPackages({})
            let packageCombo = editor.items.find(element => element._ref == 'packageCombo');
            packageCombo.store.data = packages

        },
        afterEventSave({ eventEdit, eventRecord }) {
            saveData(eventRecord.data);
        },
    },
    eventRenderer({ eventRecord, resourceRecord, renderData }) {
        let startEndMarkers = '';
        renderData.cls[eventRecord.status] = 1;
        return startEndMarkers + StringHelper.encodeHtml(eventRecord?.customer ? (eventRecord?.customer?.data?.name ? eventRecord?.customer?.data?.name : eventRecord.customer) : 'New');
    },
    tbar: tbar
});

setTimeout(() => {
    settings()
}, 1000);