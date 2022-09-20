import Schedule from "./Schedule";
import { settings, searchData, saveData, myStore } from '../common/Datalayer';
import { columns, localTooltips, tbar, EventEdit } from '../common/Columns';
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
    columns: columns,
    rowHeight: 20,
    viewPreset: {
        base: 'dayAndWeek',
        tickWidth: 10,
        headers: [
            {
                unit: 'day',
                align: 'center',
                renderer: (startDate, endDate) => `<div>${DateHelper.format(startDate, 'ddd, DD MMM')}</div>`
            }
        ]
    },
    eventLayout: 'none',
    managedEventSizing: false,
    listeners: {
        beforeEventEditShow({ eventRecord, editor }) {
            editor.title = (eventRecord.data.idx == 0) ? `Modifier ${eventRecord.name || ''}` : 'New Booking';
            let customers = JSON.parse(window.sessionStorage.getItem('customers'))
            let customersCombo = editor.items[0]
            customersCombo.store.data = customers
            let packages = JSON.parse(window.sessionStorage.getItem('packages'))
            let packagesCombo = editor.items[1]
            packagesCombo.store.data = packages
        },
        afterEventSave({ eventEdit, eventRecord }) {
            saveData(eventRecord.data);
        }
    },
    eventRenderer({ eventRecord, resourceRecord, renderData }) {
        let startEndMarkers = '';
        renderData.cls[eventRecord.status] = 1;
        return startEndMarkers + StringHelper.encodeHtml(eventRecord.customer);
    },
    tbar: tbar
});

setTimeout(() => {
    searchData({ startDate: null, endDate: null, company: [], propertie: [], roomType: [], status: [] })
    settings()
}, 1000);