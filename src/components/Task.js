let { EventModel } = window.bryntum.scheduler;
export default class Task extends EventModel {
    static get $$name() {
        return 'Task';
    }

    static get defaults() {
        return {
            // In this demo, default duration for tasks will be hours (instead of days)
            durationUnit : 'h',

            // Use a default name, for better look in the grid if unassigning a new event
            name : 'New event',

            // Use a default icon also
            iconCls : 'b-fa b-fa-asterisk'
        };
    }
}
