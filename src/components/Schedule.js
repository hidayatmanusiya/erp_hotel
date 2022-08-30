let { Scheduler, DateHelper, Mask } = window.bryntum.scheduler;

class Schedule extends Scheduler {
    static get $name() {
        return 'Schedule';
    }
    static get defaultConfig() {
        return {
            // Custom property for this demo, set to true to reschedule any conflicting tasks automatically
            autoRescheduleTasks: false,

            features: {
                stripe: true,
                /*eventMenu: {
                    items: {
                        //Custom item with inline handler
                        unassign: {
                            text: 'Unassign',
                            icon: 'b-fa b-fa-user-times',
                            weight: 200,
                            onItem: ({ eventRecord }) => eventRecord.unassign()
                        }
                    }
                }*/
            },
            rowHeight: 50,
            barMargin: 4,
            eventColor: 'indigo',
            // Custom view preset with header configuration
            viewPreset: {
                base: 'hourAndDay',
                columnLinesFor: 0,
            },
            // Only used in vertical mode
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
            // Do not remove event when unassigning, we want to add it to grid instead
            removeUnassignedEvent: false,
            listeners: {
                beforeEventDrag: (event) => {
                    let scheduler = window.bryntum.get('scheduler');

                    if (event.eventRecords.length == 0) {

                        scheduler.suspendRefresh();
                        //await scheduler.assignmentStore.project.commitAsync();
                        scheduler.resumeRefresh(true);
                        // scheduler.project.await('refresh');

                        //scheduler.trigger('beforeEventDrag', event);
                        return false;
                    }
                },
                //Having issues with recurring event, while dropping the event from one resource to another
                afterEventDrop: function (event) {
                    console.log('afterEventDrop');
                    let eventRecord = event.eventRecords[0];

                    let duration = eventRecord.data.duration;//DateHelper.getDurationInUnit(eventRecord.data.startDate, eventRecord.data.endDate, 'h');
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
                    // Mask.mask({
                    //     text: 'Please wait...',
                    //     mode: 'dark-blur'
                    // });

                },
                /*
                eventClick: async (event) => {
                },
                afterEventSave: function (event) {
                    //checkResourceTime();
                },
                afterDragCreate: function (event) {
                    //checkResourceTime();
                }*/
            }
        };
    }

    set autoRescheduleTasks(autoRescheduleTasks) {
        this.eventStore.autoRescheduleTasks = autoRescheduleTasks;
    }
};

export default Schedule;