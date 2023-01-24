import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, Button, Drawer, Image, Input, Collapse, Carousel, InputNumber, Modal, Tooltip, Select, Space, Form, DatePicker, AutoComplete, TimePicker } from 'antd';
import {
    MenuOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined,
    UserOutlined,
    AppstoreOutlined, MailOutlined, SettingOutlined,
    MoreOutlined,
    TeamOutlined,
    CoffeeOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Config from "../common/Config";
import Schedule from "../Schedule";
import { usePostApi } from "../hooks/useFetch";
import { apiPostCall, apiPutCall } from '../hooks/SiteAPIs'
const { Panel } = Collapse;
const { Option } = Select;
let { StringHelper, DateHelper, Toast } = window.bryntum.scheduler;
const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    textAlign: 'center',
};

const dateFormat = 'YYYY/MM/DD';
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
const selectBefore = (
    <Select defaultValue="Mr." className="select-before">
        <Option value="http://">Mr.</Option>
        <Option value="https://">Mr.</Option>
    </Select>
)

const selectAfter = (
    <i className="fa fa-address-card-o" aria-hidden="true"></i>
);


function Home() {
    const navigate = useNavigate();
    const timer = useRef(null);
    const schedulerHelper = useRef();
    const [startDate, setStartDate] = useState(new Date());
    const Edate = new Date()
    const [endDate, setEndDate] = useState(new Date(Edate.setDate(Edate.getDate() + 7)));
    const [currentType, setCurrentType] = useState('week');
    let allData = usePostApi('/api/method/bizmap_hotel.utill.api.fetch_data', JSON.stringify({ "from_date": Config.formatDate(startDate), "to_date": Config.formatDate(endDate) }))
    const [todayStatus, setTodayStatus] = useState({ all: 0, vacant: 0, Occupied: 0, reserved: 0, blocked: 0, ['Out Of Order']: 0, Dirty: 0 });
    const [companys, setCompanys] = useState([]);
    const [guests, setGuests] = useState([]);

    const onSearch = (value) => console.log(value);
    const [open, setOpen] = useState(false);
    const [side, setSide] = useState(false);
    const [view, setView] = useState(false);
    const [room, setRoom] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { Option, OptGroup } = Select;
    const [type, setType] = useState('time');
    const [openKeys, setOpenKeys] = useState(['sub1']);

    useEffect(() => {
        if (allData.data) {
            filterData(allData.data)
        }
    }, [allData]);


    const columns = [
        {
            text: 'Status',
            field: 'status',
            tooltip: 'Status',
            sortable: false,
            width: 20,
            region: 'left',
            htmlEncode: false,
            renderer: ({ record }) => {
                let icons = { Dirty: 'wrench', Occupied: 'bed', Availabel: 'cube', "Out Of Order": 'close' }
                return `<i class="fa fa-${icons[record.status]}" aria-hidden="true"></i>`
            },
        },
        {
            text: 'Room Type', tooltip: 'Room Type', field: 'room_type_name', width: 100, region: 'left', sortable: false
        },
        {
            text: `Room No`, tooltip: 'Room No', editor: null, field: 'room_no', width: 100, region: 'left', sortable: false, id: "room_column"
        },
    ]

    const localTooltips = {
        header: {
            titleAlign: 'start'
        },
        onBeforeShow({ source: tooltip }) {
            tooltip.title = tooltip?.eventRecord?.name
        },
        template: data => {
            let newData = data.eventRecord.data
            return `<dl>
            <dt>Contact:  <b>${newData?.contact ? newData?.contact : ''}</b></dt>
            <dt>Company:  <b>${newData?.company ? newData?.company : ''}</b></dt>
            <dt>Room NO:  <b>${newData?.room_no ? newData?.room_no : ''}</b></dt>
            <dt>Room Package:  <b>${newData?.room_package ? newData?.room_package : ''}</b></dt>
            <dt>Remark:  <b>${newData?.remark}</b></dt>
            <dt>Check In/Out: <b>${DateHelper.format(data.eventRecord.startDate, 'ddd MM/DD')} - ${DateHelper.format(data.eventRecord.endDate, 'ddd MM/DD')}</b></dt>
        </dl>
        `
        }
    }

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
                    eventTooltip: localTooltips,
                    group: 'room_type',
                    // eventEdit: EventEdit,
                },
                columns: columns,
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
                            setSide(true)
                            return false;
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
                            setSide(true)
                            return false;
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
            // searchData()
        }

        if (document.getElementById("today_date")) {
            let todayDate = document.getElementById("today_date");
            let date = Config.formatTodayDateTime(new Date())
            todayDate.innerHTML = date
        }
        setInterval(() => {
            if (document.getElementById("today_date")) {
                let todayDate = document.getElementById("today_date");
                let date = Config.formatTodayDateTime(new Date())
                todayDate.innerHTML = date
            }
        }, 1000);
    }, []);

    const filterData = (data) => {
        const schedule = window.bryntum.get('scheduler');
        let todayStatus = { all: 0, Availabel: 0, vacant: 0, Occupied: 0, reserved: 0, blocked: 0, ['Out Of Order']: 0, Dirty: 0 }
        let companys = []
        let resources = []
        let events = []
        for (let company of data) {
            companys.push({
                value: company.company_name,
                label: company.company_name,
            })
            let properties = company.properties
            for (let propertie in properties) {
                let roomTypes = properties[propertie].RoomType
                for (let roomType in roomTypes) {
                    let rooms = roomTypes[roomType].RoomNumbers
                    for (let room in rooms) {
                        let roomDet = rooms[room]
                        let roomLedger = rooms[room].RoomLedger
                        let ID = `${room}_${(propertie).replaceAll(' ', '_').toLowerCase()}_${company.company_abbreviation}`
                        resources.push({
                            company: company.company_name,
                            propertie: propertie,
                            room_type: roomType,
                            room_type_name: `${company.company_abbreviation} : ${propertie}`,
                            status: roomDet.CurrentStatus,
                            id: ID,
                            room_no: room,
                        })
                        for (let ledger of roomLedger) {
                            events.push({
                                // id: 11,
                                resourceId: ID,
                                // name: ledger.BookingCategory,
                                name: ledger.GuestName,
                                contact: ledger.ContactNumber,
                                company: company.company_name,
                                room_no: room,
                                room_package: ledger['Room Package'],
                                remark: ledger.Remark,
                                startDate: new Date(ledger.From),
                                duration: 2,
                            },)
                        }
                        let type = roomDet.CurrentStatus
                        todayStatus[type] = (todayStatus[type] || todayStatus[type] == 0) ? Number(todayStatus[type]) + 1 : 0
                    }
                }
            }

        }
        setCompanys(companys)
        // console.log(resources)
        // console.log(events)
        schedule.resourceStore.data = resources
        schedule.eventStore.data = events
        setTodayStatus(todayStatus)
    };

    const setCurrentTypes = (type, time, dateString) => {
        const schedule = window.bryntum.get('scheduler');
        let startDate = new Date(schedule.startDate)
        let date = new Date(schedule.startDate)
        if (type == 'today') {
            setCurrentType(type);
            date.setDate(date.getDate() + 1)
        }
        if (type == 'week') {
            setCurrentType(type);
            date.setDate(date.getDate() + 7)
        }
        if (type == 'month') {
            setCurrentType(type);
            date.setDate(date.getDate() + 30)
        }
        if (type == 'plus') {
            startDate = new Date(schedule.startDate)
            startDate.setDate(startDate.getDate() + 1)
            date = new Date(schedule.endDate)
            date.setDate(date.getDate() + 1)
        }
        if (type == 'minus') {
            startDate = new Date(schedule.startDate)
            startDate.setDate(startDate.getDate() - 1)
            date = new Date(schedule.endDate)
            date.setDate(date.getDate() - 1)
        }
        if (type == 'time') {
            startDate = new Date(dateString)
            date = new Date(dateString)
            let count = 1
            if (currentType == 'week') {
                count = 7
            }
            if (currentType == 'month') {
                count = 30
            }
            date.setDate(startDate.getDate() + count)
        }
        schedule.startDate = new Date(startDate)
        schedule.endDate = new Date(date)
        setStartDate(startDate)
        setEndDate(date)
    };

    const findGuest = (text) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            if (text) {
                let filters = [["Contact", "name", "like", `%${text}%`]]
                let params = `doctype=Contact&cmd=frappe.client.get_list&fields=${JSON.stringify(["*"])}&filters=${JSON.stringify(filters)}&limit_page_length=None`;
                let dataArray = await apiPostCall('/', params, window.frappe?.csrf_token)
                for (let item of dataArray) {
                    item.value = item.name
                    item.label = item.name
                }
                setGuests(dataArray)
            } else {
                setGuests([])
            }
        }, 500)
    }

    const onSelectGuest = (record) => {
        window.open(`${Config.hostUrl}/app/query-report/Guest%20History%20HMS?guest=${record}&date=today`, '_blank')
    }

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
                    <Col xs={{ span: 24 }} lg={{ span: 13 }}>
                        {/* <MenuOutlined type="primary" onClick={() => setOpen(true)} />
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
                        </Drawer> */}
                        <Image preview={false}
                            height={30}
                            src={"https://staybird.in/wp-content/uploads/2022/05/updated_logo.png.webp"}
                        />
                        <AutoComplete
                            options={guests}
                            onSelect={onSelectGuest}
                            onSearch={findGuest}
                        >
                            <Input.Search size="large" placeholder="input here" enterButton />
                        </AutoComplete>
                        <Tooltip title={text} className='icon'>
                            <ExclamationCircleOutlined />
                        </Tooltip>
                        <span id="today_date"></span>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 11 }}>

                        <div className='right-bar'>
                            <div className='vl'></div>
                            <div className='arizona'>
                                <Tooltip title={'Go to Home'} onClick={() => navigate('/dash')} className='menu-icon'>
                                    <i className="fa fa-home" aria-hidden="true"></i>
                                    <card-o />
                                </Tooltip>

                                <Tooltip className='menu-icon'>
                                    <i onClick={() => setSide(true)} className="fa fa-calendar-plus-o" aria-hidden="true"></i>
                                    <Drawer
                                        title="Quick Reservation"
                                        width={1000}
                                        onClose={() => setSide(false)}
                                        open={side}
                                        bodyStyle={{ paddingBottom: 80 }}
                                    >
                                        <Form>
                                            <div className='reservation'>
                                                <Space>
                                                    <div>
                                                        <p className='check'>Check-in</p>
                                                        <DatePicker
                                                        // onChange={onChange}
                                                        />
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
                                                        <DatePicker
                                                        //  onChange={onChange} 
                                                        />
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



                                <Tooltip title={product} className='menu-icon'>
                                    <i onClick={() => setView(true)} className="fa fa-bullhorn" aria-hidden="true"></i>

                                    <Drawer title="What's new in eZee Absolute" placement="right" onClose={() => setView(false)} open={view}>
                                        <div className='absolute'>
                                            <Space>
                                                <h6>ENHANCEMENT</h6>
                                                <p>28 Nov 2022</p>
                                            </Space>
                                            <h4><a href=''>Searching reservations becomes even easier in our reservation lists.</a> </h4>
                                            <p>Hotels requires a reservation list for different operational use in order to know about the reservations coming or the guest arriving every day. We have provided various filterations for our users to search the reservations in the reservation list i.e. by reservation date, arrival date, room type etc. However, our users were having difficulty searching ...</p>
                                            <h5><a href=''>Read More  <i className="fa fa-external-link" aria-hidden="true"></i></a> </h5>
                                        </div>

                                        <div className='absolute'>
                                            <Space>
                                                <h6>ENHANCEMENT</h6>
                                                <p>28 Nov 2022</p>
                                            </Space>
                                            <h4><a href=''>Searching reservations becomes even easier in our reservation lists.</a> </h4>
                                            <p>Hotels requires a reservation list for different operational use in order to know about the reservations coming or the guest arriving every day. We have provided various filterations for our users to search the reservations in the reservation list i.e. by reservation date, arrival date, room type etc. However, our users were having difficulty searching ...</p>
                                            <h5><a href=''>Read More  <i className="fa fa-external-link" aria-hidden="true"></i></a> </h5>
                                        </div>
                                    </Drawer>
                                </Tooltip>



                                <Tooltip title={quick} className='menu-icon'>
                                    <i onClick={showModal} className="fa fa-th" aria-hidden="true"></i>
                                    <th onClick={showModal} />

                                    <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                                        width={370}
                                    >
                                        <Row>
                                            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                                <Space>
                                                    <i className="fa fa-calendar-plus-o" aria-hidden="true"></i>
                                                    <p className='icon'>AddReservation</p>
                                                </Space>

                                                <Space>
                                                    <i className="fa fa-fa fa-id-card-o" aria-hidden="true"></i>
                                                    <p className='icon'>Stay view</p>
                                                </Space>

                                                <Space>
                                                    <i className="fa fa-tachometer" aria-hidden="true"></i>

                                                    <p className='icon'>Dashboard</p>
                                                </Space>

                                                <Space>
                                                    <i className="fa fa-line-chart" aria-hidden="true"></i>
                                                    <p className='icon'>Innalytics</p>
                                                </Space>

                                                <Space>
                                                    <i className="fa fa-calendar-plus-o" aria-hidden="true"></i>
                                                    <p className='icon'>Room View</p>
                                                </Space>
                                            </Col>
                                            <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                                <Space>
                                                    <i className="fa fa-calendar-o" aria-hidden="true"></i>
                                                    <p className='icon'>reservations</p>
                                                </Space>

                                                <br />
                                                <Space>
                                                    <i className="fa fa-star" aria-hidden="true"></i>
                                                    <p className='icon'>Rates</p>
                                                </Space>

                                                <Space>
                                                    <i className="fa fa-tachometer" aria-hidden="true"></i>
                                                    <p className='icon'>AddReservation</p>
                                                </Space>

                                                <Space>
                                                    <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                                                    <p className='icon'>Guest Reviews</p>
                                                </Space>

                                                <Space>
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                    <p className='icon'>Guest Statistice</p>
                                                </Space>
                                            </Col>
                                        </Row>
                                    </Modal>
                                </Tooltip>
                            </div>
                            <div className='vl'></div>

                            <div className='arizona'>
                                <div className="btn-group btn-group-sm">
                                    <button type="button" onClick={() => setCurrentTypes('today')} className={"btn btn-primary " + (currentType == 'today' ? 'active' : '')}>Today</button>
                                    <button type="button" onClick={() => setCurrentTypes('week')} className={"btn btn-primary " + (currentType == 'week' ? 'active' : '')}>Week</button>
                                    <button type="button" onClick={() => setCurrentTypes('month')} className={"btn btn-primary " + (currentType == 'month' ? 'active' : '')}>Month</button>
                                </div>
                            </div>

                            <div className='arizona'>
                                <div className="btn-group btn-group-sm">
                                    <button type="button" onClick={() => setCurrentTypes('minus')} className="btn btn-primary">{'<'}</button>
                                    <DatePicker onChange={(date, dateString) => setCurrentTypes('time', date, dateString)} format={dateFormat} />
                                    {/* <DatePicker value={moment('2015/01/01', dateFormat)} onChange={(dd) => console.log(dd)} format={dateFormat} /> */}
                                    <button type="button" onClick={() => setCurrentTypes('plus')} className="btn btn-primary">{'>'}</button>
                                </div>
                            </div>


                        </div>
                    </Col>
                </Row>


            </div>



            <div className='dirty'>
                <Row>
                    <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                        <span className='all-number'>
                            <span>All</span>
                            <span className="dot">{todayStatus.all}</span>
                        </span>

                        <span className='all-number'>
                            <span>Vacant</span>
                            <span className="dot">{todayStatus.vacant}</span>
                        </span>

                        <span className='all-number'>
                            <span>Occupied</span>
                            <span className="dot">{todayStatus.Occupied}</span>
                        </span>

                        <span className='all-number'>
                            <span>Reserved</span>
                            <span className="dot">{todayStatus.reserved}</span>
                        </span>

                        <span className='all-number'>
                            <span>Blocked</span>
                            <span className="dot">{todayStatus.blocked}</span>
                        </span>

                        <span className='all-number'>
                            <span>Due Out</span>
                            <span className="dot">{todayStatus['Out Of Order']}</span>
                        </span>

                        <span className='all-number'>
                            <span>Dirty</span>
                            <span className="dot">{todayStatus.Dirty}</span>
                        </span>
                    </Col>

                    <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <Select
                            style={{
                                width: 170
                            }}
                            showSearch
                            placeholder="Select Companys"
                            optionFilterProp="children"
                            // onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={companys}
                        />
                        {/* <Switch checkedChildren="Cozy" unCheckedChildren="Complit" defaultChecked /> */}
                        <Space>
                            <div className='bed-icon'><i onClick={() => setRoom(true)} className="fa fa-bed" aria-hidden="true" /> </div>

                            <Drawer title="" placement="right" onClose={() => setRoom(false)} open={room}
                                width={470}
                            >
                                <Space>
                                    Assign Rooms
                                    <DatePicker
                                        //  onChange={onChange} 
                                        style={{ width: 43, }} />
                                </Space>
                                <br />
                                <br />
                                <Carousel
                                    // afterChange={onChange}
                                    autoplay>
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

                                                <Tooltip title={<div>
                                                    <h5>text 1</h5>
                                                    <h5>text 1</h5>
                                                    <h5>text 1</h5>
                                                    <h5>text 1</h5>
                                                </div>} className='icon'>
                                                    <MoreOutlined />
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
                                                <Tooltip title={<div>
                                                    <h5>text 1</h5>
                                                    <h5>text 1</h5>
                                                    <h5>text 1</h5>
                                                    <h5>text 1</h5>
                                                </div>} className='icon'>
                                                    <MoreOutlined />
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
                            <Tooltip className='icon' title={<div>
                                <div className='room'>
                                    <h5>Room Indicators</h5>
                                    <div className='indicators'></div>

                                    <Row>
                                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                            <Space>
                                                <i className="fa fa-usd" aria-hidden="true"></i>
                                                <p className='room-Booking'>Payment Due</p>
                                            </Space>

                                            <Space>
                                                <i className="fa fa-commenting-o" aria-hidden="true"></i>
                                                <p className='room-Booking'>Guest Message</p>
                                            </Space>

                                            <Space>
                                                <TeamOutlined />
                                                <p className='room-Booking'>Group Booking</p>
                                            </Space>

                                            <Space>
                                                <CoffeeOutlined />
                                                <p className='room-Booking'>Smoking</p>
                                            </Space>

                                            <Space>
                                                <i className="fa fa-wrench" aria-hidden="true"></i>
                                                <p className='room-Booking'>Maintenance</p>
                                            </Space>

                                            <Space>
                                                <i className="fa fa-link" aria-hidden="true"></i>
                                                <p className='room-Booking'>Connected Rooms</p>
                                            </Space>
                                        </Col>
                                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                            <Space>
                                                <i className="fa fa-cutlery" aria-hidden="true"></i>
                                                <p className='room-Booking'>Meal Plan</p>
                                            </Space>

                                            <br />
                                            <Space>
                                                <i className="fa fa-gift" aria-hidden="true"></i>
                                                <p className='room-Booking'>Group Owner</p>
                                            </Space>

                                            <Space>
                                                <CoffeeOutlined />
                                                <p className='room-Booking'>Non Smoking</p>
                                            </Space>

                                            <Space>
                                                <i className="fa fa-calendar-o" aria-hidden="true"></i>
                                                <p className='room-Booking'>Next Reservation</p>
                                            </Space>

                                            <Space>
                                                <i className="fa fa-check-square-o" aria-hidden="true"></i>
                                                <p className='room-Booking'>Work Order</p>
                                            </Space>
                                        </Col>

                                    </Row>
                                    <h5>Room Types</h5>
                                    <div className='indicators'></div>
                                    <Row>
                                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                            <Space>
                                                <span className="label success"></span>
                                                <p className='room-Booking'>Guest Bed Room</p>
                                            </Space>


                                        </Col>
                                        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                            <Space>
                                                <span className="label danger"></span>
                                                <p className='room-Booking'>Kumbha Mahal Suite</p>
                                            </Space>




                                        </Col>
                                    </Row>


                                </div>
                            </div>}>
                                <ExclamationCircleOutlined />
                            </Tooltip>

                        </Space>

                    </Col>
                </Row>

                <div id="container"></div>

            </div>



        </>
    );
}

export default Home;