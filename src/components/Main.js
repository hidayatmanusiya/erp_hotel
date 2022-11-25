import Schedule from "./Schedule";
import { settings, searchData, saveData, feachCustomers, feachContacts, feachPackages } from '../common/Datalayer';
import { columns, localTooltips, tbar, EventEdit } from '../common/Columns';
import Config from '../common/Config'
import Toolbar from './Toolbar'
let { StringHelper, DateHelper, Toast, Popup } = window.bryntum.scheduler;

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
    columns: columns,
    rowHeight: 20,
    viewPreset: {
        base: 'weekAndMonth',
        tickWidth: 5,
        headers: [
            {
                unit: 'day',
                align: 'center',
                renderer: (startDate, endDate) => `<div>${DateHelper.format(startDate, 'dd')} <br />${DateHelper.format(startDate, 'DD')}</div>`
            },
        ]
    },
    eventLayout: 'none',
    managedEventSizing: false,
    listeners: {
        beforeDragCreate({ date }) {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var cToday = new Date(date);
            cToday.setHours(0, 0, 0, 0);
            if (today.getTime() > cToday.getTime()) {
                Toast.show("Booking can't make in previous date");
                return false;
            } else {
                const popup = new Popup({
                    header: 'New Booking',
                    autoShow: false,
                    centered: true,
                    closeAction: 'destroy',
                    closable: true,
                    width: 500,
                    html: `<h3 style="margin-top:0.5em">Bacon ipsum dolor </h3>
                            <p style="line-height:1.5em">amet flank ribeye ham hock, 
                             rump alcatra pork belly pancetta leberkas bacon shoulder 
                            meatloaf ball tip pig. Tongue jerky meatloaf pancetta 
                            pork sirloin. Hamburger corned beef ball tip cupim 
                            sirloin frankfurter tri-tip. Swine kevin ham hock, 
                            drumstick flank pig shoulder shankle. Tri-tip pork 
                            chop fatback turducken pork salami. Tongue boudin 
                            salami flank bacon sirloin</p>`
                });
                // popup.show();
                // return false;
            }
        },
        beforeEventAdd({ source, eventRecord }) {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var cToday = new Date(eventRecord.data.startDate);
            cToday.setHours(0, 0, 0, 0);
            if (today.getTime() > cToday.getTime()) {
                Toast.show("Booking can't make in previous date");
                return false;
            } else {
                const popup = new Popup({
                    header: 'New Booking',
                    autoShow: false,
                    centered: true,
                    closeAction: 'destroy',
                    closable: true,
                    width: 500,
                    html: `<h3 style="margin-top:0.5em">Bacon ipsum dolor </h3>
                            <p style="line-height:1.5em">amet flank ribeye ham hock, 
                             rump alcatra pork belly pancetta leberkas bacon shoulder 
                            meatloaf ball tip pig. Tongue jerky meatloaf pancetta 
                            pork sirloin. Hamburger corned beef ball tip cupim 
                            sirloin frankfurter tri-tip. Swine kevin ham hock, 
                            drumstick flank pig shoulder shankle. Tri-tip pork 
                            chop fatback turducken pork salami. Tongue boudin 
                            salami flank bacon sirloin</p>`
                });
                // popup.show();
                // return false;
            }
        },
        beforeEventEdit({ eventRecord, editor }) {
            if (eventRecord.data.idx == 0) {
                if (eventRecord.data.check_in) {
                    window.open(Config.siteUrl + "/app/room-folio-hms/" + eventRecord.data.name, '_blank');
                } else {
                    window.open(Config.siteUrl + "/app/sales-order/" + eventRecord.data.name, '_blank');
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