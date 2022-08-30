import Schedule from "./Schedule";
import { getData } from '../common/Datalayer';
let { StringHelper, DateHelper, EventStore, ResourceStore, DomClassList, WidgetHelper, MessageDialog } = window.bryntum.scheduler;

let schedule;
let drag;

getData().then((data) => {
    // console.log(data)
    let toolbar = require('./Toolbar')
    schedule = new Schedule({
        ref: 'schedule',
        id: 'scheduler',
        insertFirst: 'main',
        features: {
            eventDragCreate: false,
            eventResize: false,
            eventTooltip: false,
            stickyEvents: false,
            eventDrag: {
                constrainDragToResource: true
            }
        },
        columns: [
            {
                text: '', field: 'serviceType', width: 20, region: 'left',
                htmlEncode: false,
                editor: null,
                renderer({ value }) {
                    return `<div class="capacity b-fa b-fa-${value}"></div>`;
                }
            },
            { text: 'Room Type', editor: null, field: 'room_type_name', width: 100, region: 'left' },
            { text: 'Room No', editor: null, field: 'room_no', width: 100, region: 'left' },
        ],

        rowHeight: 80,
        // startDate: new Date(2017, 5, 1),
        // endDate: new Date(2017, 5, 11),
        viewPreset: {
            base: 'dayAndWeek',
            headers: [
                {
                    unit: 'day',
                    align: 'center',
                    renderer: (startDate, endDate) => `
                        <div>${DateHelper.format(startDate, 'ddd')}</div>
                        <div>${DateHelper.format(startDate, 'DD MMM')}</div>
                    `
                }
            ]
        },
        eventLayout: 'none',
        managedEventSizing: false,

        crudManager: {
            // autoLoad: true,
            // This config enables response validation and dumping of found errors to the browser console.
            // It's meant to be used as a development stage helper only so please set it to false for production systems.
            // validateResponse: true,
            resourceStore: new ResourceStore({
                data: data.resources.rows
            }),
            eventStore: new EventStore({
                data: data.events.rows,
            })
        },

        eventRenderer({ eventRecord, resourceRecord, renderData }) {
            let startEndMarkers = '';
            renderData.cls[eventRecord.status] = 1;

            // if (eventRecord.status) {
            //     startEndMarkers = `<i class="b-start-marker ${eventRecord.startInfoIcon}" data-btip="${eventRecord.startInfo}"></i>`;
            // }
            // if (eventRecord.workflow_state) {
            //     startEndMarkers += `<i class="b-end-marker ${eventRecord.endInfoIcon}" data-btip="${eventRecord.endInfo}"></i>`;
            // }

            return startEndMarkers + StringHelper.encodeHtml(eventRecord.customer);
        }
    });

    setTimeout(() => {
        schedule.suspendRefresh();
        schedule.resumeRefresh(true);
    }, 1000);

})

export default drag