let { Grid } = window.bryntum.scheduler;

export default class UnplannedGrid extends Grid {
    static get defaultConfig() {
        return {
            features: {
                stripe: true,
                sort: 'name'
            },
            columns: [{
                text: 'Unassigned tasks',
                flex: 1,
                field: 'name',
                htmlEncode: false,
                renderer: (data) => `<i class="${data.record.iconCls}"></i>${data.record.name}`
            }, {
                text: 'Duration',
                width: 100,
                align: 'right',
                editor: false,
                field: 'duration',
                renderer: (data) => `${data.record.data.duration} ${data.record.data.durationUnit}`
            }],
            rowHeight: 50
        };
    }

    // Reguired to store class name for idHelper and byntum.query in IE11
    static get $name() {
        return 'UnplannedGrid';
    }

    construct(config) {
        super.construct(config);
        this.eventStore.on({
            // When a task is updated, check if it was unassigned and if so - move it back to the unplanned tasks grid
            update: ({ record, changes }) => {
                if ('resourceId' in changes && !record.resourceId) {
                    this.eventStore.remove(record);
                    this.store.add(record);
                }
            },
            thisObj: this
        });
    }
};