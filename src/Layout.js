import React, { useState, createRef } from 'react';
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
import logo from "./Images/logo.png";
import Schedule from "./Schedule";

const { Option } = Select;
let { StringHelper, DateHelper, Toast, Popup } = window.bryntum.scheduler;

// const scheduler = new Schedule({

//     appendTo: 'container_book',

//     features: {
//         eventDragCreate: false,
//         eventResize: false,
//         eventTooltip: false,
//         stickyEvents: false,
//         eventDrag: {
//             constrainDragToResource: true
//         }
//     },

//     columns: [
//         {
//             type: 'resourceInfo',
//             text: 'Staff',
//             field: 'name',
//             width: '13em',
//             showEventCount: false,
//             showRole: true
//         }
//     ],

//     rowHeight: 80,
//     startDate: new Date(2017, 5, 1),
//     endDate: new Date(2017, 5, 11),
//     viewPreset: {
//         base: 'dayAndWeek',
//         headers: [
//             {
//                 unit: 'day',
//                 align: 'center',
//                 renderer: (startDate, endDate) => `
//                     <div>${DateHelper.format(startDate, 'ddd')}</div>
//                     <div>${DateHelper.format(startDate, 'DD MMM')}</div>
//                 `
//             }
//         ]
//     },
//     eventLayout: 'none',
//     managedEventSizing: false,

//     crudManager: {
//         autoLoad: true,
//         eventStore: {
//             fields: [
//                 'startInfo',
//                 'startInfoIcon',
//                 'endInfo',
//                 'endInfoIcon'
//             ]
//         },
//         loadUrl: 'data.json'
//     },

//     eventRenderer({ eventRecord, resourceRecord, renderData }) {
//         let startEndMarkers = '';

//         // Add a custom CSS classes to the template element data by setting a property name
//         renderData.cls.milestone = eventRecord.isMilestone;
//         renderData.cls.normalEvent = !eventRecord.isMilestone;
//         renderData.cls[resourceRecord.id] = 1;

//         if (eventRecord.startInfo) {
//             startEndMarkers = `<i class="b-start-marker ${eventRecord.startInfoIcon}" data-btip="${eventRecord.startInfo}"></i>`;
//         }
//         if (eventRecord.endInfo) {
//             startEndMarkers += `<i class="b-end-marker ${eventRecord.endInfoIcon}" data-btip="${eventRecord.endInfo}"></i>`;
//         }

//         return startEndMarkers + StringHelper.encodeHtml(eventRecord.name);
//     }
// });


function Layout() {
    // let myRef = createRef();
    const { Search } = Input;
    const onSearch = (value) => console.log(value);
    const text = <span>prompt text</span>;
    const [open, setOpen] = useState(false);
    const { Option, OptGroup } = Select;


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
                            <span class="dot">58</span>
                        </span>

                        <span className='all-number'>
                            <span>Vacant</span>
                            <span class="dot">55</span>
                        </span>

                        <span className='all-number'>
                            <span>Occupied</span>
                            <span class="dot">1</span>
                        </span>

                        <span className='all-number'>
                            <span>Reserved</span>
                            <span class="dot">0</span>
                        </span>

                        <span className='all-number'>
                            <span>Blocked</span>
                            <span class="dot">2</span>
                        </span>

                        <span className='all-number'>
                            <span>Due Out</span>
                            <span class="dot">0</span>
                        </span>

                        <span className='all-number'>
                            <span>Dirty</span>
                            <span class="dot">9</span>
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

            </div>

        </>
    );
}

export default Layout;
