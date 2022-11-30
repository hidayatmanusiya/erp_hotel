import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, Button, Drawer, Image, Input, Tooltip, Select, Space, Form, DatePicker, Switch } from 'antd';
import {
    MenuOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined,
    CreditCardOutlined,
    MailOutlined,
    UserOutlined,
    StarOutlined,
    NotificationOutlined,
    BorderRightOutlined,
    PlusOutlined,
    MedicineBoxOutlined
} from '@ant-design/icons';
import logo from "../images/logo.png";
import Config from "../common/Config";
import Schedule from "../Schedule";

const { Option } = Select;
let { StringHelper, DateHelper, Toast, Popup } = window.bryntum.scheduler;


const resources = [
    { id: 11, name: 'Angelo' },
    { id: 12, name: 'Gloria' },
    { id: 13, name: 'Madison' },
    { id: 14, name: 'Malik' },
    { id: 15, name: 'Mark' },
    { id: 16, name: 'Rob' }
]

const events = [
    {
        id: 11,
        resourceId: 11,
        name: 'Implement Feature X',
        startDate: new Date(2022, 0, 11, 28),
        duration: 2,
        durationUnit: 'h'
    },
    {
        id: 12,
        resourceId: 12,
        name: 'Refactoring',
        startDate: new Date(2022, 0, 11, 30),
        duration: 2,
        durationUnit: 'h'
    },
    {
        id: 13,
        resourceId: 16,
        name: 'Write application tests',
        startDate: new Date(2022, 0, 12, 1),
        duration: 2,
        durationUnit: 'h'
    }
]

function Home() {
    const schedulerHelper = useRef();
    const { Search } = Input;
    const onSearch = (value) => console.log(value);
    const text = <span>prompt text</span>;
    const [open, setOpen] = useState(false);
    const { Option, OptGroup } = Select;

    useEffect(() => {
        if (!schedulerHelper.current) {
            schedulerHelper.current = new Schedule({
                ref: 'schedule',
                id: 'scheduler',
                appendTo: 'container',

                features: {
                    // eventDragCreate: false,
                    nonWorkingTime: true,
                    eventResize: false,
                    eventTooltip: false,
                    stickyEvents: false,
                    eventDrag: {
                        disabled: true
                    },
                    // eventTooltip: localTooltips,
                    group: 'room_type_name',
                    // eventEdit: EventEdit,
                },
                columns: [
                    {
                        type: 'resourceInfo',
                        text: 'Stockholm office',
                        width: '15em'
                    }
                ],
                // rowHeight: 20,
                viewPreset: {
                    base: 'weekAndMonth',
                    // tickWidth: 5,
                    headers: [
                        {
                            unit: 'day',
                            align: 'center',
                            renderer: (startDate, endDate) => `<div>${DateHelper.format(startDate, 'dd')} <br />${DateHelper.format(startDate, 'DD')}</div>`
                        },
                    ]
                },
                eventLayout: 'none',
                managedEventSizing: false,
                listeners: {
                    beforeDragCreate({ date }) {
                        var today = new Date();
                        today.setHours(0, 0, 0, 0);
                        var cToday = new Date(date);
                        cToday.setHours(0, 0, 0, 0);
                        if (today.getTime() > cToday.getTime()) {
                            Toast.show("Booking can't make in previous date");
                            return false;
                        } else {
                            
                            // popup.show();
                            // return false;
                        }
                    },
                    beforeEventAdd({ source, eventRecord }) {
                        var today = new Date();
                        today.setHours(0, 0, 0, 0);
                        var cToday = new Date(eventRecord.data.startDate);
                        cToday.setHours(0, 0, 0, 0);
                        if (today.getTime() > cToday.getTime()) {
                            Toast.show("Booking can't make in previous date");
                            return false;
                        } else {
                            
                            // return false;
                        }
                    },
                    beforeEventEdit({ eventRecord, editor }) {
                        if (eventRecord.data.idx == 0) {
                            if (eventRecord.data.check_in) {
                                window.open(Config.siteUrl + "/app/room-folio-hms/" + eventRecord.data.name, '_blank');
                            } else {
                                window.open(Config.siteUrl + "/app/sales-order/" + eventRecord.data.name, '_blank');
                            }
                            return false
                        }
                    },
                    async beforeEventEditShow({ eventRecord, editor }) {
                        editor.title = (eventRecord.data.idx == 0) ? `Modifier ${eventRecord.name || ''}` : 'New Booking';
            
                        // let customers = await feachCustomers({})
                        // customers.unshift({ id: 'new', text: "Add New Customer", eventColor: 'green' })
                        // let customersCombo = editor.items.find(element => element._ref == 'customerCombo');
                        // customersCombo.store.data = customers
            
                        // let contacts = await feachContacts({})
                        // contacts.unshift({ id: 'new', text: "Add New contact", eventColor: 'green' })
                        // let contactsCombo = editor.items.find(element => element._ref == 'contactsCombo');
                        // contactsCombo.store.data = contacts
            
                        // let packages = await feachPackages({})
                        // let packageCombo = editor.items.find(element => element._ref == 'packageCombo');
                        // packageCombo.store.data = packages
            
                    },
                    afterEventSave({ eventEdit, eventRecord }) {
                        // saveData(eventRecord.data);
                    },
                },
                eventRenderer({ eventRecord, resourceRecord, renderData }) {
                    let startEndMarkers = '';
                    renderData.cls[eventRecord.status] = 1;
                    return startEndMarkers + StringHelper.encodeHtml(eventRecord?.customer ? (eventRecord?.customer?.data?.name ? eventRecord?.customer?.data?.name : eventRecord.customer) : 'New');
                },


            });
            const schedule = window.bryntum.get('scheduler');
            console.log(schedule)
            schedule.resourceStore.data = resources
            schedule.eventStore.data = events
        }
    }, []);



    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };


    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    return (
        <>
            <div className="menu-bar">
                <Row>
                    <Col xs={{ span: 24 }} lg={{ span: 13 }}>
                        <MenuOutlined type="primary" onClick={showDrawer} />
                        <Drawer title="Basic Drawer" placement="left" onClose={onClose} open={open}>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Drawer>
                        <Image preview={false}
                            width={150}
                            src={logo}
                        />
                        <Search placeholder="input search text" onSearch={onSearch} enterButton />
                        <Tooltip title={text} className='icon'>
                            <ExclamationCircleOutlined />
                        </Tooltip>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 11 }}>
                        <div className='right-bar'>
                            <Tooltip title={text} className='menu-icon'>
                                <CalendarOutlined />
                            </Tooltip>

                            <Tooltip title={text} className='menu-icon'>
                                <CreditCardOutlined />
                            </Tooltip>

                            <Tooltip title={text} className='menu-icon'>
                                <CalendarOutlined />
                            </Tooltip>

                            <Tooltip title={text} className='menu-icon'>
                                <MailOutlined />
                            </Tooltip>

                            <Tooltip title={text} className='menu-icon'>
                                <UserOutlined />
                            </Tooltip>

                            <Tooltip title={text} className='menu-icon'>
                                <CalendarOutlined />
                            </Tooltip>

                            <Tooltip title={text} className='menu-icon'>
                                <StarOutlined />
                            </Tooltip>

                            <Tooltip title={text} className='menu-icon'>
                                <NotificationOutlined />
                            </Tooltip>

                            <Tooltip title={text} className='menu-icon'>
                                <BorderRightOutlined />
                            </Tooltip>
                            <div className='vl'></div>
                            <div className='arizona'>
                                <UserOutlined />
                                <Select
                                    defaultValue="Arizona Luxery Suits"

                                    style={{
                                        width: 200,
                                    }}
                                    onChange={handleChange}
                                >
                                    <OptGroup label="Manager">
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                    </OptGroup>
                                    <OptGroup label="Engineer">
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </OptGroup>
                                </Select>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <div className='dirty'>
                <Row>
                    <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                        <DatePicker onChange={onChange} picker="week" />
                        <span className='vl'></span>

                        <span className='all-number'>
                            <span>All</span>
                            <span className="dot">58</span>
                        </span>

                        <span className='all-number'>
                            <span>Vacant</span>
                            <span className="dot">55</span>
                        </span>

                        <span className='all-number'>
                            <span>Occupied</span>
                            <span className="dot">1</span>
                        </span>

                        <span className='all-number'>
                            <span>Reserved</span>
                            <span className="dot">0</span>
                        </span>

                        <span className='all-number'>
                            <span>Blocked</span>
                            <span className="dot">2</span>
                        </span>

                        <span className='all-number'>
                            <span>Due Out</span>
                            <span className="dot">0</span>
                        </span>

                        <span className='all-number'>
                            <span>Dirty</span>
                            <span className="dot">9</span>
                        </span>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Select
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                                {
                                    value: 'tom',
                                    label: 'Tom',
                                },
                            ]}
                        />
                        <Switch checkedChildren="Cozy" unCheckedChildren="Complit" defaultChecked />

                        <MedicineBoxOutlined onClick={showDrawer}>
                            Open
                        </MedicineBoxOutlined>
                        <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Drawer>

                        <ExclamationCircleOutlined />

                    </Col>
                </Row>

                <div id="container"></div>

            </div>

        </>
    );
}

export default Home;