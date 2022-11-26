import SharedToolbar from "./SharedToolbar";
import { presetStore } from "./Presets";
import { searchData } from "../common/Datalayer";
import Config from '../common/Config'
let { WidgetHelper, Menu } = window.bryntum.scheduler;
new SharedToolbar();

const items = [
    { icon: 'b-icon b-fa b-fa-circle', text: 'Guest History', link: '/app/query-report/Guest%20History%20HMS' },
    { icon: 'b-icon b-fa b-fa-circle', text: 'Room Checkin/Checkout', link: '/app/query-report/Rooms%20To%20Checkout' },
    { icon: 'b-icon b-fa b-fa-circle', text: 'Night Audit', link: '/app/query-report/Night%20Audit' },
    { icon: 'b-icon b-fa b-fa-circle', text: 'Room Occupancy', link: '/app/query-report/Room%20Occupancy%20and%20Revenue%20HMS' },
]

const menu = new Menu({
    anchor: true,
    autoShow: false,
    items: items,
    onItem({ item }) {
        window.open(`${Config.siteUrl}${item.link}`, '_blank')
    }
});
export const [menuItem, combo, date, next, previous, cusDate] = WidgetHelper.append([
    {
        type: 'button',
        icon: 'b-icon b-fa b-fa-bars',
        color: 'b-blue b-raised',
        tooltip: 'Menu',
        menu,
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
            setTimeout(() => searchData(), 10)
        }
    },
    {
        type: 'buttonGroup',
        toggleGroup: true,
        items: [
            {
                type: 'button',
                ref: 'zoomInButton',
                color: 'b-blue b-raised',
                text: 'Today',
                tooltip: 'Today',
                onClick() {
                    let schedule = window.bryntum.get('scheduler');
                    schedule.setType = 'day'
                    let endDate = new Date(schedule.startDate)
                    endDate.setDate(endDate.getDate() + 1)
                    schedule.endDate = endDate
                    setTimeout(() => searchData(), 10)
                }
            },
            {
                type: 'button',
                ref: 'zoomOutButton',
                color: 'b-blue b-raised',
                pressed: true,
                text: 'Week',
                tooltip: 'Week',
                onClick() {
                    let schedule = window.bryntum.get('scheduler');
                    schedule.setType = 'week'
                    let endDate = new Date(schedule.startDate)
                    endDate.setDate(endDate.getDate() + 7)
                    schedule.endDate = endDate
                    setTimeout(() => searchData(), 10)
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
                    schedule.setType = 'month'
                    let endDate = new Date(schedule.startDate)
                    endDate.setDate(endDate.getDate() + 30)
                    schedule.endDate = endDate
                    setTimeout(() => searchData(), 10)
                }
            },
        ],
        onAction({ source: button }) {
            // scheduler.milestoneAlign = button.id;
        }
    },
    {
        type: 'button',
        icon: 'b-icon b-fa b-fa-angle-right',
        color: 'b-blue b-raised',
        tooltip: 'View next day',
        onAction() {
            let schedule = window.bryntum.get('scheduler');
            let startDate = new Date(schedule.startDate)
            startDate.setDate(startDate.getDate() + 1)
            schedule.startDate = startDate
            let endDate = new Date(schedule.endDate)
            endDate.setDate(endDate.getDate() + 1)
            schedule.endDate = endDate
            cusDate.value = startDate
        }
    },
    {
        type: 'button',
        icon: 'b-icon b-fa b-fa-angle-left',
        color: 'b-blue b-raised',
        tooltip: 'View previous day',
        onAction() {
            let schedule = window.bryntum.get('scheduler');
            let startDate = new Date(schedule.startDate)
            startDate.setDate(startDate.getDate() - 1)
            schedule.startDate = startDate
            let endDate = new Date(schedule.endDate)
            endDate.setDate(endDate.getDate() - 1)
            schedule.endDate = endDate
            cusDate.value = startDate
        }
    },
    {
        type: 'DateField',
        ref: 'startDate',
        name: 'start_date',
        value: new Date(),
        weight: 50,
        placeholder: 'Start Date',
        listeners: {
            async change({ value }) {
                let startDate = new Date(value)
                let schedule = window.bryntum.get('scheduler');
                let endDate = new Date(value)
                if (schedule.setType == 'day') {
                    endDate.setDate(startDate.getDate() + 1)
                }
                if (schedule.setType == 'week') {
                    endDate.setDate(startDate.getDate() + 7)
                }
                if (schedule.setType == 'month') {
                    endDate.setDate(startDate.getDate() + 30)
                }
                schedule.startDate = startDate
                schedule.endDate = endDate
                setTimeout(() => searchData(), 10)
            }
        }
    },
], { insertFirst: document.getElementById('tools') || document.body });