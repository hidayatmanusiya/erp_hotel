import SharedToolbar from "./SharedToolbar";
import { presetStore } from "./Presets";
import { feachContacts } from "../common/Datalayer";

let { WidgetHelper } = window.bryntum.scheduler;
new SharedToolbar();

export const [combo, today, week, month, next, previous, customers, customerLists] = WidgetHelper.append([
    {
        type: 'combo',
        width: 200,
        ref: 'preset',
        placeholder: 'Preset',
        editable: false,
        hidden: true,
        store: presetStore,
        displayField: 'name',
        value: 'hourAndDay',
        picker: {
            maxHeight: 500
        },
        onChange: () => {
            let schedule = window.bryntum.get('scheduler');
            schedule.zoomToLevel(combo.selected);
        }
    },
    {
        type: 'button',
        ref: 'zoomInButton',
        color: 'b-blue b-raised',
        text: 'Today',
        tooltip: 'Today',
        onClick() {
            let schedule = window.bryntum.get('scheduler');
            schedule.zoomToLevel('hourAndDay');
        }
    },
    {
        type: 'button',
        ref: 'zoomOutButton',
        color: 'b-blue b-raised',
        text: 'Week',
        tooltip: 'Week',
        onClick() {
            let schedule = window.bryntum.get('scheduler');
            schedule.zoomToLevel('weekAndDay');
        }
    },
    {
        type: 'button',
        ref: 'zoomOutButton',
        color: 'b-blue b-raised',
        text: 'Month',
        tooltip: 'Month',
        onClick() {
            let schedule = window.bryntum.get('scheduler');
            schedule.zoomToLevel('weekAndMonth');
        }
    },
    {
        type: 'button',
        icon: 'b-icon b-fa b-fa-angle-right',
        color: 'b-blue b-raised',
        tooltip: 'View next day',
        onAction() {
            let schedule = window.bryntum.get('scheduler');
            schedule.shiftNext();
        }
    },
    {
        type: 'button',
        icon: 'b-icon b-fa b-fa-angle-left',
        color: 'b-blue b-raised',
        tooltip: 'View previous day',
        onAction() {
            let schedule = window.bryntum.get('scheduler');
            schedule.shiftPrevious();
        }
    },
    {
        type: 'textfield',
        ref: 'filterCustomers',
        icon: 'b-fa b-fa-filter',
        cls: 'b-bright',
        style: 'margin-left: 130px;',
        placeholder: 'Find Customers',
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
                if (value) {
                    let data = await feachContacts([["Contact", "name", "like", `%${value}%`]])
                    customerLists.store.data = data
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
            window.open(`${window.location.origin}/query-report/Guest%20History%20HMS?guest=${record.data}&date=today`, '_blank')
            customerLists.store.data = []
            customers.value = null
        }
    }

], { insertFirst: document.getElementById('tools') || document.body });