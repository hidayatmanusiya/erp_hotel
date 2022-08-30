import Models from '../common/Models';
import { onEventDelete, CancelEditor } from '../common/CommonHelper'

let { Widget, DateHelper, MessageDialog } = window.bryntum.scheduler;

//https://www.bryntum.com/docs/scheduler/#guides/customization/eventedit.md
export const EventEdit = {
    editorConfig: {
        modal: true,
        height: '45em',
        width: '40em',
        bbar: { items: { deleteButton: false } },
        items: {
            // nameField : {
            //     weight : 0,
            // },
            relatedEventType: {
                type: 'combo',
                ref: 'relatedEventType',
                name: 'relatedEventType',
                label: 'Type',
                weight: 110,
                items: [],
                required: true,
                editable: true,
                displayField: 'name',
                valueField: 'id',
                listeners: {
                    // TODO move this code to the event editor
                    // #7809 - relatedEventType field should update visibility of the other EventEditor fields
                    change: ({ source: combo, value }) => {

                        if (value) {
                            // toggle visibility of widgets belonging to eventTypes
                            combo.owner.items.forEach(widget => {
                                if (widget.dataset && widget.dataset.relatedEventType) {

                                    if (widget.dataset.relatedEventType.indexOf(value) > -1)
                                        widget.hidden = false;
                                    else {
                                        widget.hidden = true;
                                    }
                                    //widget.hidden = widget.dataset.relatedEventType != value;
                                }

                                //Hide recurrence combo if related Event Type 'recurring' is not true
                                if (widget.dataset.ref) {
                                    if (widget.dataset.ref === "recurrenceCombo" || widget.dataset.ref === "editRecurrenceButton") {
                                        widget.hidden = true;

                                        let eventTypeFilter = Models.EventTypes.data.filter((i) => (i['recordID'] == value));

                                        if (eventTypeFilter.length) {
                                            let recurring = eventTypeFilter[0].recurring;
                                            if (recurring)
                                                widget.hidden = false;
                                        }

                                    }
                                }

                                //Hide notes if 'dataset.hide' is present
                                if (widget.dataset && widget.name == 'notes') {
                                    if (widget.dataset.hide.indexOf(value) > -1)
                                        widget.hidden = true;
                                    else
                                        widget.hidden = false;
                                }
                                // if (widget.name == 'notesTooltip') {
                                //     if (value == 5)
                                //         widget.hidden = true;
                                // }
                            });

                            let editor = combo.owner.eventEditFeature;
                            let eventRecord = editor.eventRecord;

                            //apply this on change, skip while loading
                            if (value && !editor.loadingRecord) {

                                let eventTypeFilter = Models.EventTypes.data.filter((i) => (i['recordID'] == value));

                                //if event type is changed, apply end date based on event type duration
                                if (eventTypeFilter.length) {
                                    let duration = eventTypeFilter[0].duration;
                                    let endDate = DateHelper.add(eventRecord.data.startDate, duration, 'hours');

                                    eventRecord.data.endDate = endDate;
                                    //console.log(endDate);

                                    combo.owner.items.forEach(widget => {
                                        if (widget.name === 'endDate') {
                                            widget.value = endDate;
                                        }
                                    });
                                }

                            }
                        }

                    }
                }
            },
            relatedProject: {
                type: 'combo',
                ref: 'relatedProject',
                name: 'relatedProject',
                label: 'Projects',
                displayField: 'name',
                valueField: 'id',
                weight: 111,
                // Name of the field in the event record to read/write data to
                // NOTE: Make sure your EventModel has this field for this to link up correctly                    
                dataset: { relatedEventType: [2, 3] }, // This field is only displayed for evenType = 2 and 3
                items: [],
                editable: true,
                listeners: {
                    change: ({ source: combo, value }) => {

                        let projectFilter = Models.Projects.data.filter((i) => (i['recordID'] == value));

                        if (projectFilter.length) {
                            let project = projectFilter[0];

                            let parent = combo.owner.items;

                            parent.forEach(widget => {
                                if (widget.name === "projectsContainer") {
                                    //set value in projectsCustomer field
                                    widget.items[0].value = project.customerFullName;
                                    //set value in projectsPreferredPhone field
                                    widget.items[1].value = project.preferredPhone;
                                } else if (widget.name === "projectEmailContainer") {
                                    //set value in projectEmail field 
                                    widget.items[0].value = project.email;
                                    //set value in projectHomeAddress field
                                    widget.items[1].value = project.projectAddress;
                                } else if (widget.name === "projectNotes") {
                                    //set value in projectNotes field
                                    widget.value = project.projectNotes;
                                    if (project.projectNotes && project.projectNotes.length > 150)//
                                    {
                                        widget.value = project.projectNotes.substring(0, 150) + "..."
                                        //widget.tooltip = project.projectNotes || "";
                                    }
                                } else if (widget.name === "notesTooltip") {
                                    if (project.projectNotes && project.projectNotes.length > 150) {
                                        widget.hidden = false;
                                        //widget.dataText = project.projectNotes;
                                    } else {
                                        widget.hidden = true;
                                        //widget.dataText = '';
                                    }
                                }
                            });
                        }
                    }
                }
            },
            salesContainer: {
                type: 'container',
                ref: 'salesContainer',
                name: 'salesContainer',
                weight: 112,
                width: '100%',
                layout: 'hbox',
                dataset: { relatedEventType: [1, 4, 8] },
                items: [
                    {
                        type: 'combo',
                        ref: 'relatedSales',
                        name: 'relatedSales',
                        label: 'Customer',
                        flex: '1',
                        items: [],
                        displayField: 'name',
                        valueField: 'id',
                        editable: true,
                        // cls: 'b-inline',
                        listeners: {
                            change: ({ source: combo, value }) => {

                                let salesFilter = Models.SalesAppointment.data.filter((i) => (i['recordID'] == value));

                                if (salesFilter.length) {
                                    let sales = salesFilter[0];

                                    //combo.owner.items[1].value = sales.primaryFullName;

                                    //set value in salesPreferredPhone field
                                    combo.owner.items[1].value = sales.preferredPhone;

                                    let parent = combo.owner.owner.items;

                                    parent.forEach(widget => {
                                        if (widget.name === "salesEmailContainer") {
                                            //set value in salesEmail field
                                            widget.items[0].value = sales.email;
                                            //set value in salesHomeAddress field
                                            widget.items[1].value = sales.homeAddress;
                                        } else if (widget.name === "salesNotes") {
                                            //set value in salesNotes field
                                            widget.value = sales.leadNotes;
                                            if (sales.leadNotes && sales.leadNotes.length > 150)//
                                            {
                                                widget.value = sales.leadNotes.substring(0, 150) + "..."
                                                //widget.tooltip = sales.leadNotes || "";
                                            }
                                        } else if (widget.name === "notesTooltip") {
                                            if (sales.leadNotes && sales.leadNotes.length > 150) {
                                                widget.hidden = false;
                                                //widget.dataText = sales.leadNotes;
                                            } else {
                                                widget.hidden = true;
                                                //widget.dataText = '';
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    },
                    // {
                    //     type: 'displayfield',
                    //     name: 'salesCustomer',
                    //     label: 'Customer',
                    //     margin: '10 0 0 0',
                    //     flex: '1',
                    //     hidden: true
                    //     // cls: 'b-match-label',
                    // },
                    {
                        type: 'displayfield',
                        name: 'salesPreferredPhone',
                        label: 'Phone',
                        margin: '10 0 0 0',
                        flex: '1',
                        // cls: 'b-match-label',
                    }
                ]
            },
            projectsContainer: {
                type: 'container',
                ref: 'projectsContainer',
                name: 'projectsContainer',
                weight: 113,
                width: '100%',
                layout: 'hbox',
                dataset: { relatedEventType: [2, 3] },
                items: [
                    {
                        type: 'displayfield',
                        name: 'projectsCustomer',
                        label: 'Customer',
                        margin: '5 0 0 0',
                        flex: '1',
                        // cls: 'b-inline',
                    },
                    {
                        type: 'displayfield',
                        name: 'projectsPreferredPhone',
                        label: 'Phone',
                        margin: '5 0 0 0',
                        flex: '1',
                        // cls: 'b-match-label',
                    }
                ]
            },
            salesEmailContainer: {
                type: 'container',
                ref: 'salesEmailContainer',
                name: 'salesEmailContainer',
                weight: 114,
                width: '100%',
                layout: 'hbox',
                dataset: { relatedEventType: [1, 4, 8] },
                items: [
                    {
                        type: 'displayfield',
                        name: 'salesEmail',
                        label: 'Email',
                        margin: '5 0 0 0',
                        flex: '1',
                        // cls: 'b-inline',
                    },
                    {
                        type: 'displayfield',
                        name: 'salesHomeAddress',
                        label: 'Address',
                        margin: '5 0 0 0',
                        flex: '1',
                        // cls: 'b-match-label',
                    }
                ]
            },
            projectEmailContainer: {
                type: 'container',
                ref: 'projectEmailContainer',
                name: 'projectEmailContainer',
                weight: 115,
                width: '100%',
                layout: 'hbox',
                dataset: { relatedEventType: [2, 3] },
                items: [
                    {
                        type: 'displayfield',
                        name: 'projectEmail',
                        label: 'Email',
                        margin: '5 0 0 0',
                        flex: '1',
                        // cls: 'b-inline',
                    },
                    {
                        type: 'displayfield',
                        name: 'projectHomeAddress',
                        label: 'Address',
                        margin: '5 0 0 0',
                        flex: '1',
                        // cls: 'b-match-label',
                    }
                ]
            },
            salesNotes: {
                type: 'displayfield',
                ref: 'salesNotes',
                name: 'salesNotes',
                label: 'Notes bbb',
                weight: 116,
                width: '100%',
                //height: 100,
                dataset: { relatedEventType: [1, 4, 8] }
            },
            projectNotes: {
                type: 'displayfield',
                ref: 'projectNotes',
                name: 'projectNotes',
                label: 'Notes aaaa',
                weight: 117,
                width: '100%',
                //height: 100,
                dataset: { relatedEventType: [2, 3] }
            },
            notesTooltip: {
                weight: 118,
                type: 'button',
                cls: 'b-transparent',
                name: 'notesTooltip',
                //icon: 'b-fa-plus-circle',
                text: 'Show Full Note',
                dataText: '',
                //dataset: { relatedEventType: [1, 2, 3, 4] },
                margin: '0 0 5 200',
                onClick: function (btn) {

                    let notes = this.dataText;

                    let items = this.owner.items;

                    let relatedEventType = items.find(x => x.name == 'relatedEventType').value;

                    if (relatedEventType == 1 || relatedEventType == 4 || relatedEventType == 8) {
                        let salesContainer = items.find(x => x.name == 'salesContainer');
                        let relatedSales = salesContainer.items.find(x => x.name == 'relatedSales').value;

                        let salesFilter = Models.SalesAppointment.data.filter((i) => (i['recordID'] == relatedSales));

                        if (salesFilter.length) {
                            let sales = salesFilter[0];

                            MessageDialog.alert({
                                title: 'Notes',
                                message: sales.leadNotes
                            });
                        } else {
                            if (notes)
                                MessageDialog.alert({
                                    title: 'Notes',
                                    message: notes
                                });
                        }

                    } else if (relatedEventType == 2 || relatedEventType == 3) {

                        let relatedProject = items.find(x => x.name == 'relatedProject').value;
                        let projectFilter = Models.Projects.data.filter((i) => (i['recordID'] == relatedProject));
                        if (projectFilter.length) {
                            let project = projectFilter[0];
                            // if (project.projectNotes && project.projectNotes.length > 150)//
                            // {

                            MessageDialog.alert({
                                title: 'Notes',
                                message: project.projectNotes
                            });
                            //}
                        }
                    }


                    /*const popup = new Popup({
                        header: '',
                        autoShow: false,
                        centered: true,
                        closeAction: 'destroy',
                        closable: true,
                        width: '30em',
                        bbar: [
                            {
                                text: 'Close',
                                minWidth: 100,
                                onAction: 'up.close'
                            }
                        ],
                        html: notes
                    });
                    popup.show();*/
                }
            },
            notes: {
                type: 'textareafield',
                ref: 'notes',
                name: 'notes',
                label: 'Notes',
                weight: 119,
                width: '100%',
                height: 100,
                dataset: {
                    hide: [1, 2, 3, 4, 8]
                    //relatedEventType: [5, 7] 
                }, // This field is only displayed for evenType = 5 or 7
            }
        }
    },
    loadRecord(eventRecord, resourceRecord) {
        this.loadingRecord = true;
        this.internalLoadRecord(eventRecord, resourceRecord);
        //console.log(eventRecord.data);
        let editorPopup = this.editor;//.owner;
        editorPopup.items.forEach(widget => {

            /*if (widget.name === 'relatedEventType') {
                //widget.items = eventTypeCombo;
                //widget.store.data = eventTypeCombo;
                widget.value = eventRecord.data.relatedEventType;
            }

            //Project Combo
            if (widget.name === "relatedProject") {
                //widget.items = projectsCombo;
                widget.value = eventRecord.data.relatedProject;
            }

            if (widget.name === "salesContainer") {
                //Sales:Customer combo
                //widget.items[0].items = customerCombo;
                widget.items[0].value = eventRecord.data.relatedSales || "";
            }

            if (eventRecord.data.relatedEventType === 1 || eventRecord.data.relatedEventType === 4) {
                //widget.hidden = false;
                if (widget.name === "salesContainer") {
                    //set value in salesPreferredPhone field
                    widget.items[1].value = eventRecord.data.salesPreferredPhone || "";
                } else if (widget.name === "salesEmailContainer") {
                    //items inside the salesEmailContainer
                    //set value in salesEmail field
                    widget.items[0].value = eventRecord.data.salesEmail || "";
                    //set value in salesHomeAddress field
                    widget.items[1].value = eventRecord.data.salesHomeAddress;
                } else if (widget.name === "salesNotes") {
                    //set value in salesNotes field
                    widget.value = eventRecord.data.salesNotes || "";
                }
            } else if (eventRecord.data.relatedEventType === 2 || eventRecord.data.relatedEventType === 3) {
                //widget.hidden = false;
                if (widget.name === "projectsContainer") {
                    //set value in projectsCustomer field
                    widget.items[0].value = eventRecord.data.projectsCustomer || "";
                    //set value in projectsPreferredPhone field
                    widget.items[1].value = eventRecord.data.projectsPreferredPhone || "";
                } else if (widget.name === "projectEmailContainer") {
                    //set value in projectEmail field 
                    widget.items[0].value = eventRecord.data.projectEmail || "";
                    //set value in projectHomeAddress field
                    widget.items[1].value = eventRecord.data.projectHomeAddress || "";
                } else if (widget.name === "projectNotes") {
                    //set value in projectNotes field
                    widget.value = eventRecord.data.projectNotes || "";
                }
            } else if (eventRecord.data.relatedEventType === 5) {
                if (widget.name === 'notes') {
                    widget.hidden = false;
                    widget.value = eventRecord.data.notes || "";
                }
            }
        */

            // if (eventRecord.data.rId) {

            //     if (eventRecord.data.relatedEventType === 1 || eventRecord.data.relatedEventType === 4) {
            //         //widget.hidden = false;
            //         if (widget.name === "salesContainer") {

            //             //customer dropdown
            //             widget.items[0].hidden = true;

            //             //customer displayfield
            //             widget.items[1].hidden = false;
            //             widget.items[1].value = eventRecord.data.salesCustomer || "";

            //             //set value in salesPreferredPhone field
            //             widget.items[2].value = eventRecord.data.salesPreferredPhone || "";
            //         } else if (widget.name === "salesEmailContainer") {
            //             //items inside the salesEmailContainer
            //             //set value in salesEmail field
            //             widget.items[0].value = eventRecord.data.salesEmail || "";
            //             //set value in salesHomeAddress field
            //             widget.items[1].value = eventRecord.data.salesHomeAddress;
            //         }
            //     } /*else if (eventRecord.data.relatedEventType === 2 || eventRecord.data.relatedEventType === 3) {

            //     }*/

            //     //dont allow customer dropdown edits
            //     if (widget.name === "salesContainer") {
            //         //customer dropdown
            //         widget.items[0].hidden = true;

            //         //customer displayfield
            //         widget.items[1].hidden = false;
            //     }

            // } else {
            //     //widget.hidden = false;
            //     //hide customer displayfield field 
            //     if (widget.name === "salesContainer") {

            //         //customer dropdown
            //         widget.items[0].hidden = false;

            //         //customer displayfield
            //         widget.items[1].hidden = true;
            //         widget.items[1].value = eventRecord.data.salesCustomer || "";

            //         //set value in salesPreferredPhone field
            //         widget.items[2].value = eventRecord.data.salesPreferredPhone || "";
            //     }
            // }

            //Notes tooltip logic
            if (widget.name === "salesNotes") {
                //set value in salesNotes field
                widget.value = eventRecord.data.salesNotes || "";
                if (eventRecord.data.salesNotes && eventRecord.data.salesNotes.length > 150)//
                {
                    widget.value = eventRecord.data.salesNotes.substring(0, 150) + "..."
                    //widget.tooltip = eventRecord.data.salesNotes || "";
                }
            } else if (widget.name === "projectNotes") {
                //set value in projectNotes field
                widget.value = eventRecord.data.projectNotes || "";
                if (eventRecord.data.projectNotes && eventRecord.data.projectNotes.length > 150)//150
                {
                    widget.value = eventRecord.data.projectNotes.substring(0, 150) + "..."
                    //widget.tooltip = eventRecord.data.projectNotes || "";
                }
            } else if (widget.name === "notesTooltip") {
                widget.hidden = true;
                if (eventRecord.data.salesNotes && eventRecord.data.salesNotes.length > 150)//
                {
                    widget.hidden = false;
                    widget.dataText = eventRecord.data.salesNotes;
                } else if (eventRecord.data.projectNotes && eventRecord.data.projectNotes.length > 150)//150
                {
                    widget.dataText = false;
                    widget.dataText = eventRecord.data.projectNotes;
                }
            }

            if (!eventRecord.data.relatedEventType) {
                if (widget.name === 'relatedEventType') {
                    widget.value = "";
                }
                if (widget.name === "salesContainer") {
                    widget.hidden = true;
                    widget.items[0].value = ""; //customer dropdown
                    // widget.items[1].value = ""; //customer displayfield
                    widget.items[1].value = ""; //salesPreferredPhone
                }
                else if (widget.name === "salesEmailContainer") {
                    widget.hidden = true;
                    widget.items[0].value = ""; //salesEmail
                    widget.items[1].value = ""; //salesHomeAddress
                }
                else if (widget.name === "salesNotes") {
                    widget.hidden = true;
                    widget.value = "";
                }
                else if (widget.name === "relatedProject") {
                    widget.hidden = true;
                    widget.value = "";
                }
                else if (widget.name === "projectsContainer") {
                    widget.hidden = true;
                    widget.items[0].value = ""; //projectsCustomer
                    widget.items[1].value = ""; //projectsPreferredPhone
                }
                else if (widget.name === "projectEmailContainer") {
                    widget.hidden = true;
                    widget.items[0].value = ""; //projectEmail
                    widget.items[1].value = ""; //projectHomeAddress
                }
                else if (widget.name === "projectNotes") {
                    widget.hidden = true;
                    widget.value = "";
                }
                else if (widget.name === 'notes') {
                    widget.hidden = true;
                    widget.value = "";
                }
            }

            //if (!eventRecord.data.rId) {

            // if (widget.name === "salesContainer") {
            //     //console.log(Models.SalesAppointment.removedData);
            //     //widget.items[0].items = []; //customer dropdown

            //     let filteredSalesAppointmentData = Models.SalesAppointment.data.filter((i) => {
            //         if (eventRecord.data.relatedSales == i['recordID']) {
            //             //to allow existing selected customer to appear in customer dropdown
            //             return true;
            //         }
            //         else {
            //             return Models.SalesAppointment.removedData.indexOf(i['recordID']) == -1 ? true : false;
            //         }
            //     });

            //     //editor.items[3].items[0].items = 
            //     widget.items[0].items = filteredSalesAppointmentData.map((i) => {
            //         return {
            //             id: i['recordID'],
            //             name: i['primaryFullName'],
            //         }
            //     });

            //     //console.log(filteredSalesAppointmentData);
            // }
            //}

        });

        this.loadingRecord = false;
    },
    onAfterSave: function (eventRecord) {
        let scheduler = window.bryntum.get('scheduler');

        //https://www.bryntum.com/docs/scheduler/#Core/data/Duration#property-unit
        //let duration = DateHelper.getDurationInUnit(eventRecord.data.startDate, eventRecord.data.endDate, 'hour');
        //https://www.bryntum.com/docs/scheduler/#Scheduler/model/TimeSpan#field-durationUnit
        let duration = DateHelper.getDurationInUnit(eventRecord.data.startDate, eventRecord.data.endDate, 'h');
        eventRecord.data.duration = duration;
        eventRecord.data.durationUnit = 'h';
        //let occurrences = eventRecord.occurrences
        let occurrences = scheduler.getOccurrencesFor(eventRecord);
        for (let i = 0; i < occurrences.length; i++) {
            occurrences[i].data.endDate = DateHelper.add(occurrences[i].data.startDate, duration, 'hour');
            occurrences[i].data.duration = duration;
            occurrences[i].data.durationUnit = 'h';
        }

        if (eventRecord.data.relatedEventType) {
            let eventTypesFilter = Models.EventTypes.data.filter((i) => (i['recordID'] == eventRecord.data.relatedEventType));
            eventRecord.data.relatedEvent = eventTypesFilter[0].eventType
            eventRecord.data.eventSort = eventTypesFilter[0].eventTypeSort ? eventTypesFilter[0].eventTypeSort : 100
        }

        /*if (eventRecord.data.relatedEventType) {
            let eventTypesFilter = Models.EventTypes.data.filter((i) => (i['recordID'] == eventRecord.data.relatedEventType));
            if (eventTypesFilter.length)
                eventRecord.data.iconCls = eventTypesFilter[0].iconCls;
        }*/

        //override the notes that gets truncated because of tooltip logic in loadRecord
        if (eventRecord.data.relatedSales) {
            let salesFilter = Models.SalesAppointment.data.filter((i) => (i['recordID'] == eventRecord.data.relatedSales));
            if (salesFilter.length) {
                let sales = salesFilter[0];
                eventRecord.data.salesNotes = sales.leadNotes;
            }
        }
        if (eventRecord.data.relatedProject) {
            let projectFilter = Models.Projects.data.filter((i) => (i['recordID'] == eventRecord.data.relatedProject));
            if (projectFilter.length) {
                let project = projectFilter[0];
                eventRecord.data.projectNotes = project.projectNotes;
            }
        }

        let eventStoreData = scheduler.eventStore.getRange();

        /*let index = Models.SalesAppointment.removedData.indexOf(eventRecord.data.relatedSales);
        if (index === -1) {
            if (eventRecord.data.relatedEventType == 1 || eventRecord.data.relatedEventType == 4) {
                Models.SalesAppointment.removedData.push(eventRecord.data.relatedSales);
            }
        }*/

        //*** reset Models.SalesAppointment.removedData ****
        Models.SalesAppointment.removedData = [];
        //update the SalesAppointment, remove the selected customer from SalesAppointment customer dropdown
        for (let i = 0; i < eventStoreData.length; i++) {
            const eventRecord = eventStoreData[i];

            //if (!eventRecord.data.rId) {
            if (eventRecord.data.relatedEventType == 1 || eventRecord.data.relatedEventType == 4 || eventRecord.data.relatedEventType == 8) {
                if (eventRecord.data.relatedSales)
                    Models.SalesAppointment.removedData.push(eventRecord.data.relatedSales);
            }
            //}
        }

        scheduler.suspendRefresh();
        scheduler.resumeRefresh(true);

        //console.log(eventRecord.data);
    },
    onDeleteClick: function () {
        let eventRecord = this.eventRecord;

        onEventDelete(eventRecord, true);

        // let scheduler = window.bryntum.get('scheduler');
        // scheduler.eventStore.remove(eventRecord);

        this.editor.hide();
    },
    onCancelClick: function () {
        this.editor.hide();
        // let editor = this.editor;
        // let eventRecord = this.eventRecord;
        // CancelEditor(editor, eventRecord);
    },
    getEditor: function () {
        const me = this;

        let { editor } = me;

        if (editor) {
            //editor.eventEditFeature.showRecurringUI = false

            editor.items[3].items[0].items = Models.SalesAppointment.data.map((i) => {
                return {
                    id: i['recordID'],
                    name: i['primaryFullName'],
                }
            });

            return editor;
        }

        editor = me.editor = Widget.create(me.getEditorConfig());

        //console.log(editor.items);

        // Must set *after* construction, otherwise it becomes the default state
        // to reset readOnly back to. Must use direct property access because
        // getter consults state of editor.
        editor.readOnly = me._readOnly;

        if (editor.items.length === 0) {
            console.warn('Event Editor configured without any `items`');
        }

        //Event Type dropdown
        editor.items[1].items = Models.EventTypes.data.map((i) => {
            return {
                id: i['recordID'],
                name: i['eventType'],
            }
        });

        //project dropdown
        editor.items[2].items = Models.Projects.data.map((i) => {
            return {
                id: i['recordID'],
                name: i['project'],
            }
        });

        //customer dropdown
        editor.items[3].items[0].items = Models.SalesAppointment.data.map((i) => {
            return {
                id: i['recordID'],
                name: i['primaryFullName'],
            }
        });

        // add listeners programmatically so users cannot override them accidentally
        editor.on({
            beforehide: 'resetEditingContext',
            beforeshow: 'onBeforeEditorShow',
            keydown: 'onPopupKeyDown',
            thisObj: me
        });

        /**
         * Fired before the editor will load the event record data into its input fields. This is useful if you
         * want to modify the fields before data is loaded (e.g. set some input field to be readonly)
         * @event eventEditBeforeSetRecord
         * @param {Core.widget.Container} source The editor widget
         * @param {Scheduler.model.EventModel} record The record
         */
        me.scheduler.relayEvents(editor, ['beforeSetRecord'], 'eventEdit');

        // assign widget variables, using widget name: startDate -> me.startDateField
        // widgets with id set use that instead, id -> me.idField
        Object.values(editor.widgetMap).forEach(widget => {
            const ref = widget.ref || widget.id;
            // don't overwrite if already defined
            if (ref && !me[ref]) {
                me[ref] = widget;

                switch (widget.name) {
                    case 'startDate':
                    case 'endDate':
                        widget.on('change', me.onDatesChange, me);
                        break;
                }
            }
        });

        // launch onEditorConstructed hook if provided
        me.onEditorConstructed?.(editor);

        me.eventTypeField?.on('change', me.onEventTypeChange, me);

        me.saveButton?.on('click', me.onSaveClick, me);
        me.deleteButton?.on('click', me.onDeleteClick, me);
        me.cancelButton?.on('click', me.onCancelClick, me);

        return me.editor;
    }
}