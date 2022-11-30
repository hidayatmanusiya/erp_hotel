let { Scheduler, DateHelper } = window.bryntum.scheduler;

class Schedule extends Scheduler {
    static get $name() {
        return 'Schedule';
    }
    static get defaultConfig() {
        return {
            autoRescheduleTasks: false,
            features: {
                stripe: true,
            },
            rowHeight: 50,
            barMargin: 4,
            eventColor: 'indigo',
            viewPreset: {
                base: 'hourAndDay',
                columnLinesFor: 0,
            },
            resourceColumns: {
                columnWidth: 120
            },
            eventRenderer({ renderData, eventRecord, resourceRecord, tplData }) {
                let schedulerColorsArray = JSON.parse(window.sessionStorage.getItem('schedulerColorsArray'))
                let schedulerColor = null
                for (let item of schedulerColorsArray) {
                    if (item.relatedEmployee == resourceRecord.data.rId && item.relatedEventType == eventRecord.data.relatedEventType) {
                        schedulerColor = item.schedulerColourCode
                    }
                }
                tplData.eventColor = schedulerColor ? schedulerColor : (resourceRecord.data.eventColor ? resourceRecord.data.eventColor : eventRecord.data.eventColor)


                return eventRecord.name;
            },
            removeUnassignedEvent: false,
            listeners: {
                beforeEventDrag: (event) => {
                    let scheduler = window.bryntum.get('scheduler');
                    if (event.eventRecords.length == 0) {
                        scheduler.suspendRefresh();
                        scheduler.resumeRefresh(true);
                        return false;
                    }
                },
                afterEventDrop: function (event) {
                    console.log('afterEventDrop');
                    let eventRecord = event.eventRecords[0];

                    let duration = eventRecord.data.duration;
                    let endDate = DateHelper.add(eventRecord.data.startDate, duration, 'hour');
                    eventRecord.setEndDate(endDate);
                    let scheduler = window.bryntum.get('scheduler');
                    let occurrences = scheduler.getOccurrencesFor(event.eventRecords[0]);

                    for (let i = 0; i < occurrences.length; i++) {
                        if (occurrences[i].data.id.indexOf('_generated:') >= 0) {
                            occurrences[i].data.endDate = DateHelper.add(occurrences[i].data.startDate, duration, 'hour');
                            occurrences[i].data.duration = duration;
                            occurrences[i].data.durationUnit = 'h';
                        }
                    }
                },
                renderRows: (event) => {
                },
            }
        };
    }

    set autoRescheduleTasks(autoRescheduleTasks) {
        this.eventStore.autoRescheduleTasks = autoRescheduleTasks;
    }
};

export default Schedule;