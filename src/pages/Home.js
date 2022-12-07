import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, Button, Drawer, Image, Input, Collapse, Carousel, InputNumber, Modal, Tooltip, Select, Space, Form, DatePicker, Switch, Menu, TimePicker } from 'antd';
import {
    MenuOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined,
    UserOutlined,
    AppstoreOutlined, MailOutlined, SettingOutlined,
    MoreOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import logo from "../Images/logo.png";
import Config from "../common/Config";
import Schedule from "../Schedule";

const { Panel } = Collapse;
const { Option } = Select;
let { StringHelper, DateHelper, Toast, Popup } = window.bryntum.scheduler;
const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    textAlign: 'center',

};


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

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
const selectBefore = (
    <Select defaultValue="Mr." className="select-before">
        <Option value="http://">Mr.</Option>
        <Option value="https://">Mr.</Option>
    </Select>
)

const selectAfter = (
    <i class="fa fa-address-card-o" aria-hidden="true"></i>
);

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem('Front Office', 'sub1', <MailOutlined />, [
        getItem('Reports', '1', <MailOutlined />),
        getItem('Reports', '1', <MailOutlined />),
        getItem('Reports', '1', <MailOutlined />),
        getItem('Reports', '1', <MailOutlined />),
    ]),
    getItem('Cashiering', 'sub2', <AppstoreOutlined />, [
        getItem('Reports', '1', <MailOutlined />),
        getItem('Reports', '1', <MailOutlined />),
        getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    getItem('Housekeeping', 'sub4', <SettingOutlined />, [
        getItem('Reports', '1', <MailOutlined />),
        getItem('Reports', '1', <MailOutlined />),
        getItem('Reports', '1', <MailOutlined />),
        getItem('Reports', '1', <MailOutlined />),
    ]),
    getItem('Reports', '1', <MailOutlined />),
    getItem('Net Locks', '2', <CalendarOutlined />),
    getItem('Night Audit Log', '2', <CalendarOutlined />),

];

function Home() {
    const navigate = useNavigate();
    const schedulerHelper = useRef();
    const { Search } = Input;
    const onSearch = (value) => console.log(value);
    const [open, setOpen] = useState(false);
    const [opens, setOpens] = useState(false);
    const [menu, setMenu] = useState(false);
    const [side, setSide] = useState(false);
    const [view, setView] = useState(false);
    const [room, setRoom] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const { Option, OptGroup } = Select;
    const [type, setType] = useState('time');
    const [openKeys, setOpenKeys] = useState(['sub1']);

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

    const showSearch = () => {
        setSide(true);
    };

    const showMenu = () => {
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

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const PickerWithType = ({ type, onChange }) => {
        if (type === 'time') return <TimePicker onChange={onChange} />;
        if (type === 'date') return <DatePicker onChange={onChange} />;
        return <DatePicker picker={type} onChange={onChange} />;
    };




    const text = <span>Search by Room Type, Room, Reservation No, Folio No, Bill No, Voucher No, Guest Name, Email, Mobile No, Phone No, Last 4 Digits of CC No, Group ID, Sharer name, GR Card No</span>;
    const reservation = <span>Add Reservation</span>;
    const stay = <span>Stay View</span>;
    const reservations = <span>Reservations</span>;
    const rates = <span>Rates</span>;
    const guest = <span>Guest Portal</span>;
    const user = <span>User Activity</span>;
    const reputation = <span>Reputation Management</span>;
    const product = <span>Product Update</span>;
    const quick = <span>Quick Menu</span>;
    const edite = <span>Quick Menu</span>;





    return (
        <>
            <div className="menu-bar">
                <Row>
                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <MenuOutlined type="primary" onClick={() => setOpen(true)} />
                        <Drawer placement="left" onClose={() => setOpen(false)} open={open}
                            style={{ width: "75%" }}
                        >
                            <Menu
                                mode="inline"
                                openKeys={openKeys}
                                onOpenChange={onOpenChange}
                                style={{
                                    width: 256
                                }}
                                items={items}
                            />
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

                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                        <div className='right-bar'>
                            <Tooltip title={reservation} onClick={() => navigate('/dash')} className='menu-icon'>
                                <i class="fa fa-home" aria-hidden="true"></i>
                                <card-o />
                            </Tooltip>

                            <Tooltip title={stay} className='menu-icon'>
                                <i onClick={() => setSide(true)} class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                                <calendar-plus-o onClick={() => setSide(true)} />
                                <Drawer
                                    title="Quick Reservation"
                                    width={1000}
                                    onClose={() => setSide(false)}
                                    open={side}
                                    bodyStyle={{ paddingBottom: 80 }}
                                >
                                    <Form hideRequiredMark>
                                        <div className='reservation'>
                                            <Space>
                                                <div>
                                                    <p className='check'>Check-in</p>
                                                    <DatePicker onChange={onChange} />
                                                </div>

                                                <div className='time-line'>
                                                    <PickerWithType type={type} onChange={(value) => console.log(value)} />
                                                </div>

                                                <div className='nights'>
                                                    <p className='check'>1</p>
                                                    <p className='check'>Nights</p>
                                                </div>

                                                <div>
                                                    <p className='check'>Check-out</p>
                                                    <DatePicker onChange={onChange} />
                                                </div>
                                                <div className='time-line'>
                                                    <PickerWithType type={type} onChange={(value) => console.log(value)} />
                                                </div>

                                                <div>
                                                    <p className='check'>Room(s)</p>
                                                    <InputNumber min={1} max={10} defaultValue={1} onChange={onChange} />
                                                </div>

                                                <div>
                                                    <p className='check'>Reservation Type</p>
                                                    <Select
                                                        style={{
                                                            width: 116,
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

                                                <div>
                                                    <p className='check'>Reservation Type</p>
                                                    <Select
                                                        style={{
                                                            width: 200,
                                                        }}
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
                                                </div>
                                            </Space>

                                            <div className='Child'>
                                                <Row>
                                                    <Col span={4}>Room Type</Col>
                                                    <Col span={4}>Rate Type</Col>
                                                    <Col span={4}>Room</Col>
                                                    <Col span={4}>Adult</Col>
                                                    <Col span={4}>Child</Col>
                                                    <Col span={4}>Rate(Rs)(Tax Inc.)</Col>
                                                </Row>
                                            </div>

                                            <br />
                                            <Space>
                                                <Select
                                                    style={{
                                                        width: 170,
                                                    }}
                                                    showSearch
                                                    placeholder="-Select-"
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

                                                <Select
                                                    defaultValue="-Select-"
                                                    style={{
                                                        width: 170,
                                                    }}
                                                    disabled
                                                    options={[
                                                        {
                                                            value: 'lucy',
                                                            label: 'Lucy',
                                                        },
                                                    ]}
                                                />

                                                <Select
                                                    defaultValue="-Select-"
                                                    style={{
                                                        width: 170,
                                                    }}
                                                    disabled
                                                    options={[
                                                        {
                                                            value: 'lucy',
                                                            label: 'Lucy',
                                                        },
                                                    ]}
                                                />
                                                <Select
                                                    defaultValue="1"
                                                    style={{
                                                        width: 80,
                                                    }}
                                                    disabled
                                                    options={[
                                                        {
                                                            value: 'lucy',
                                                            label: 'Lucy',
                                                        },
                                                    ]}
                                                />
                                                <Select
                                                    defaultValue="0"
                                                    style={{
                                                        width: 80,
                                                    }}
                                                    disabled
                                                    options={[
                                                        {
                                                            value: 'lucy',
                                                            label: 'Lucy',
                                                        },
                                                    ]}
                                                />

                                                <Select
                                                    defaultValue="lucy"
                                                    style={{
                                                        width: 150,
                                                    }}
                                                    disabled
                                                    options={[
                                                        {
                                                            value: 'lucy',
                                                            label: 'Lucy',
                                                        },
                                                    ]}
                                                />
                                            </Space>

                                            <br />
                                            <br />
                                            <Row>
                                                <Col span={19}>
                                                    <Button>Add Room</Button>
                                                </Col>
                                                <Col span={5}>
                                                    Total
                                                    <span className='number'>0.00</span>
                                                </Col>
                                            </Row>
                                            <div className='hr-border'></div>
                                            <br />

                                            <Space >
                                                <div>
                                                    <p className='check'>Guest Name</p>
                                                    <Input
                                                        style={{
                                                            width: 430,
                                                        }}
                                                        addonBefore={selectBefore} addonAfter={selectAfter} defaultValue="mysite" />
                                                </div>
                                                <div>
                                                    <p className='check'>Mobile</p>
                                                    <Input placeholder="Mobile"
                                                        style={{
                                                            width: 200,
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className='check'>Email</p>
                                                    <Input style={{
                                                        width: 300,
                                                    }}
                                                        placeholder="Email" />
                                                </div>
                                            </Space>


                                            <div className='option'>
                                                <div className='hr-border'></div>
                                                <Row>
                                                    <Col span={22}>
                                                        <Button onClick={onClose}>More option</Button>
                                                    </Col>
                                                    <Col span={2}>
                                                        <Button type="primary" onClick={onClose}>Confirm</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Form>
                                </Drawer>
                            </Tooltip>

                            <Tooltip title={reservations} className='menu-icon'>
                                <i class="fa fa-calendar-o" aria-hidden="true"></i>
                                <calendar-o />
                            </Tooltip>

                            <Tooltip title={rates} className='menu-icon'>
                                <i class="fa fa-building" aria-hidden="true"></i>
                                <building />
                            </Tooltip>

                            <Tooltip title={guest} className='menu-icon'>
                                <i class="fa fa-envelope-o" aria-hidden="true"></i>
                                <envelope-o />
                            </Tooltip>

                            <Tooltip title={user} className='menu-icon'>
                                <i class="fa fa-user-plus" aria-hidden="true"></i>
                                <user-plus />
                            </Tooltip>

                            <Tooltip title={reputation} className='menu-icon'>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <star />
                            </Tooltip>

                            <Tooltip title={product} className='menu-icon'>
                                <i onClick={() => setView(true)} class="fa fa-bullhorn" aria-hidden="true"></i>

                                <Drawer title="What's new in eZee Absolute" placement="right" onClose={() => setView(false)} open={view}>
                                    <div className='absolute'>
                                        <Space>
                                            <h6>ENHANCEMENT</h6>
                                            <p>28 Nov 2022</p>
                                        </Space>
                                        <h4><a href=''>Searching reservations becomes even easier in our reservation lists.</a> </h4>
                                        <p>Hotels requires a reservation list for different operational use in order to know about the reservations coming or the guest arriving every day. We have provided various filterations for our users to search the reservations in the reservation list i.e. by reservation date, arrival date, room type etc. However, our users were having difficulty searching ...</p>
                                        <h5><a href=''>Read More  <i class="fa fa-external-link" aria-hidden="true"></i></a> </h5>
                                    </div>

                                    <div className='absolute'>
                                        <Space>
                                            <h6>ENHANCEMENT</h6>
                                            <p>28 Nov 2022</p>
                                        </Space>
                                        <h4><a href=''>Searching reservations becomes even easier in our reservation lists.</a> </h4>
                                        <p>Hotels requires a reservation list for different operational use in order to know about the reservations coming or the guest arriving every day. We have provided various filterations for our users to search the reservations in the reservation list i.e. by reservation date, arrival date, room type etc. However, our users were having difficulty searching ...</p>
                                        <h5><a href=''>Read More  <i class="fa fa-external-link" aria-hidden="true"></i></a> </h5>
                                    </div>
                                </Drawer>
                            </Tooltip>



                            <Tooltip title={quick} className='menu-icon'>
                                <i onClick={showModal} class="fa fa-th" aria-hidden="true"></i>
                                <th onClick={showModal} />

                                <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                                    width={370}
                                >
                                    <Row>
                                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                            <Space>
                                                <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                                                <p className='icon'>AddReservation</p>
                                            </Space>

                                            <Space>
                                                <i class="fa fa-fa fa-id-card-o" aria-hidden="true"></i>
                                                <p className='icon'>Stay view</p>
                                            </Space>

                                            <Space>
                                                <i class="fa fa-tachometer" aria-hidden="true"></i>

                                                <p className='icon'>Dashboard</p>
                                            </Space>

                                            <Space>
                                                <i class="fa fa-line-chart" aria-hidden="true"></i>
                                                <p className='icon'>Innalytics</p>
                                            </Space>

                                            <Space>
                                                <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>
                                                <p className='icon'>Room View</p>
                                            </Space>
                                        </Col>
                                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                            <Space>
                                                <i class="fa fa-calendar-o" aria-hidden="true"></i>
                                                <p className='icon'>reservations</p>
                                            </Space>

                                            <br />
                                            <Space>
                                                <i class="fa fa-star" aria-hidden="true"></i>
                                                <p className='icon'>Rates</p>
                                            </Space>

                                            <Space>
                                                <i class="fa fa-tachometer" aria-hidden="true"></i>
                                                <p className='icon'>AddReservation</p>
                                            </Space>

                                            <Space>
                                                <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                                <p className='icon'>Guest Reviews</p>
                                            </Space>

                                            <Space>
                                                <i class="fa fa-user" aria-hidden="true"></i>
                                                <p className='icon'>Guest Statistice</p>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Modal>
                            </Tooltip>

                            <div className='vl'></div>
                            <div className='arizona'>
                                <UserOutlined />
                                <Select
                                    defaultValue="Arizona Luxery Suits"
                                    style={{
                                        width: 217,
                                    }}
                                    onChange={handleChange}
                                >

                                    <OptGroup label="Engineer">
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </OptGroup>

                                    {/* <Option>
                                        <div className='configurationas'>
                                            <div>
                                                <span className='suits'>P</span>
                                                PMSTrial@2
                                            </div>
                                            <div className='ationas'></div>

                                            <div className='icon-configuration'>
                                                <i class="fa fa-cog" aria-hidden="true"></i>
                                                Go to Configuration
                                            </div>

                                            <div className='icon-configuration'>
                                                <i class="fa fa-snowflake-o" aria-hidden="true"></i>
                                                Go to Extranet
                                            </div>
                                            <div className='ationas'></div>
                                            <h5>NEED HELP?</h5>

                                            <div className='icon-configuration'>
                                                <i class="fa fa-envelope-o" aria-hidden="true"></i>
                                                Report an Issue
                                            </div>

                                            <div className='icon-configuration'>
                                                <i class="fa fa-commenting-o" aria-hidden="true"></i>
                                                Chat Support
                                                <span><i class="fa fa-external-link" aria-hidden="true"></i></span>
                                            </div>

                                            <div className='icon-configuration'>
                                                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                                                Explore FAQs
                                                <span><i class="fa fa-external-link" aria-hidden="true"></i></span>
                                            </div>
                                            <div className='ationas'></div>

                                            <div className='icon-configuration'>
                                                <i class="fa fa-power-off" aria-hidden="true"></i>
                                                Logout
                                            </div>
                                        </div>
                                    </Option> */}
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
                            style={{
                                width: 170
                            }}
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
                        <Space>
                            <div className='bed-icon'><i onClick={() => setRoom(true)} class="fa fa-bed" aria-hidden="true"/> </div>
                            
                            <Drawer title="" placement="right" onClose={() => setRoom(false)} open={room}
                                width={470}
                            >
                                <Space>
                                    Assign Rooms
                                    <DatePicker onChange={onChange} style={{ width: 43, }} />
                                </Space>
                                <br />
                                <br />
                                <Carousel afterChange={onChange} autoplay>
                                    <div style={contentStyle}>
                                        <div className='celnder'>
                                            <div className='vl'></div>
                                            <div className='day'>
                                                <p>Sun</p>
                                                <h5>26</h5>
                                                <p>Dec</p>
                                            </div>
                                            <div className='vl'></div>
                                            <div className='day'>
                                                <p>Mon</p>
                                                <h5>27</h5>
                                                <p>Dec</p>
                                            </div>
                                            <div className='vl'></div>
                                            <div className='day'>
                                                <p>Tue</p>
                                                <h5>28</h5>
                                                <p>Dec</p>
                                            </div>
                                            <div className='vl'></div>
                                            <div className='day'>
                                                <p>wed</p>
                                                <h5>29</h5>
                                                <p>Dec</p>
                                            </div>
                                            <div className='vl'></div>
                                            <div className='day'>
                                                <p>Thu</p>
                                                <h5>30</h5>
                                                <p>Dec</p>
                                            </div>
                                            <div className='vl'></div>
                                            <div className='day'>
                                                <p>Fri</p>
                                                <h5>31</h5>
                                                <p>Dec</p>
                                            </div>
                                            <div className='vl'></div>
                                            <div className='day'>
                                                <p>Sat</p>
                                                <h5>01</h5>
                                                <p>Dec</p>
                                            </div>
                                            <div className='vl'></div>
                                        </div>
                                        <div className='ationas'></div>
                                    </div>
                                </Carousel>
                                <br />
                                <Collapse defaultActiveKey={['1']} onChange={onChange} style={{ border: "none" }}>
                                    <Panel header="Kumbha Mahal Suite (1)" key="1">
                                        <div className='celnder-number'>
                                            <div className='celnder'>
                                                <Tooltip title={edite} onClick={() => navigate('/dash')} className='menu-icon'>
                                                <MoreOutlined />
                                                    <thermometer-full />
                                                </Tooltip>
                                                <div className='day'>
                                                    <p>Sun</p>
                                                    <p>Dec</p>
                                                    <div className='assign'></div>
                                                    <p>Sun</p>
                                                    <p>Dec</p>
                                                </div>
                                                <div className='mohamamd'>
                                                    <a href=''>Mr. mohamamd</a>
                                                    <p>N43A76F9683B-3</p>
                                                </div>
                                                <Space>
                                                    <div className='mohamamds'>
                                                        <p>Room Type</p>
                                                        <p>Deluxe Non AC</p>
                                                    </div>
                                                    <Button>Assign Room</Button>
                                                </Space>
                                            </div>
                                        </div>
                                        <br />
                                        <div className='celnder-number'>
                                            <div className='celnder'>
                                                <Tooltip title={edite} onClick={() => navigate('/dash')} className='menu-icon'>
                                                <MoreOutlined />
                                                    <thermometer-full />
                                                </Tooltip>
                                                <div className='day'>
                                                    <p>Sun</p>
                                                    <p>Dec</p>
                                                    <div className='assign'></div>
                                                    <p>Sun</p>
                                                    <p>Dec</p>
                                                </div>
                                                <div className='mohamamd'>
                                                    <a href=''>Mr. mohamamd</a>
                                                    <p>N43A76F9683B-3</p>
                                                </div>
                                                <Space>
                                                    <div className='mohamamds'>
                                                        <p>Room Type</p>
                                                        <p>Deluxe Non AC</p>
                                                    </div>
                                                    <Button>Assign Room</Button>
                                                </Space>
                                            </div>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </Drawer>

                            <ExclamationCircleOutlined />




                        </Space>

                    </Col>
                </Row>

                <div id="container"></div>

            </div>



        </>
    );
}

export default Home;