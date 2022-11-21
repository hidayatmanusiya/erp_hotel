import SharedToolbar from "./SharedToolbar";
import { presetStore } from "./Presets";

let { WidgetHelper } = window.bryntum.scheduler;
new SharedToolbar();

export const [combo, zoomIn, zoomOut, next, previous] = WidgetHelper.append([
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
        icon: 'b-icon b-icon-search-plus',
        tooltip: 'Day',
        onClick() {
            let schedule = window.bryntum.get('scheduler');
            schedule.schedulerEngine.viewPreset = 'weekAndDay';
        }
    },
    {
        type: 'button',
        ref: 'zoomOutButton',
        color: 'b-blue b-raised',
        icon: 'b-icon b-icon-search-minus',
        tooltip: 'Week',
        onClick() {
            let schedule = window.bryntum.get('scheduler');
            schedule.schedulerEngine.viewPreset = 'week';
        }
    },
    {
        type: 'button',
        ref: 'zoomOutButton',
        color: 'b-blue b-raised',
        icon: 'b-icon b-icon-search-minus',
        tooltip: 'Month',
        onClick() {
            let schedule = window.bryntum.get('scheduler');
            schedule.zoomOut();
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
    }

], { insertFirst: document.getElementById('tools') || document.body });