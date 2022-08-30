import SharedToolbar from "./SharedToolbar";
import { presetStore } from "./Presets";
import { saveData } from "../common/Datalayer";
let { scheduler, WidgetHelper, DateHelper, MessageDialog, Popup, Combo, Button } = window.bryntum.scheduler;
new SharedToolbar();

export const [save, combo, next, previous, date] = WidgetHelper.append([
    {
        type: 'buttonGroup',
        items: [
            {
                color: 'b-blue b-raised',
                icon: 'b-icon b-fa-cloud',
                text: 'Save',
                cls: 'b-raised',
                id: 'save-button',
                onClick({ source: button }) {
                    saveData();
                }
            },
        ]
    },
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
        icon: 'b-icon b-fa b-fa-angle-right',
        color: 'b-blue b-raised',
        tooltip: 'View next day',
        onAction() {
            let schedule = window.bryntum.get('scheduler');
            schedule.shiftNext();
            let date = window.bryntum.get('date-button').value
            date.setDate(date.getDate() + 1)
            window.bryntum.get('date-button').value = date
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
            let date = window.bryntum.get('date-button').value
            date.setDate(date.getDate() - 1)
            window.bryntum.get('date-button').value = date
        }
    },
    {
        type: 'datefield',
        label: 'Select date',
        id: 'date-button',
        width: 220,
        value: new Date(),
        editable: false,
        cls: 'dataText',
        listeners: {
            change: ({ value }) => {
                let schedule = window.bryntum.get('scheduler');
                schedule.setTimeSpan(DateHelper.add(value, -4, 'hour'), DateHelper.add(value, 24, 'hour'))
            }
        }
    }

], { insertFirst: document.getElementById('tools') || document.body });