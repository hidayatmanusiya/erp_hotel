import React, { useState, createRef } from 'react';
import { Col, Row, Button, Drawer, Image, Input, Tooltip, Select, Space, Form, DatePicker, Switch } from 'antd';

import logo from "../images/logo.png";

import CanvasJSReact from '../images/canvasjs/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const { Option } = Select;
let { StringHelper, DateHelper, Toast, Popup } = window.bryntum.scheduler;


function Dash() {

    const options_one = {
        title: {
            text: "Type One"
        },
        data: [{
            type: "column",
            dataPoints: [
                { label: "Apple", y: 10 },
                { label: "Orange", y: 15 },
                { label: "Banana", y: 25 },
                { label: "Mango", y: 30 },
                { label: "Grape", y: 28 }
            ]
        }]
    }

    const options_two = {
        title: {
            text: "Type Two"
        },
        data: [{
            type: "pie",
            dataPoints: [
                { label: "Apple", y: 10 },
                { label: "Orange", y: 15 },
                { label: "Banana", y: 25 },
                { label: "Mango", y: 30 },
                { label: "Grape", y: 28 }
            ]
        }]
    }



    return (
        <>
            <div className="menu-bar">
                <Row>
                    <Col xs={{ span: 12 }} lg={{ span: 12 }}>
                        <CanvasJSChart options={options_one} />
                    </Col>
                    <Col xs={{ span: 12 }} lg={{ span: 12 }}>
                        <CanvasJSChart options={options_two} />
                    </Col>
                </Row>

            </div>

        </>
    );
}

export default Dash;