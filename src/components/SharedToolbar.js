import Config from "../common/Config";
let { DomHelper, WidgetHelper, Localizable, Events, Fullscreen } = window.bryntum.scheduler;


const appConfig = {
    "title": 'Staybird',
    "description": 'Staybird',
    "favicon": 'https://staybird.in/wp-content/uploads/2022/05/cropped-staybird_favicon-1-180x180.png',
    "logo": 'https://staybird.in/wp-content/uploads/2022/05/updated_logo.png.webp',
    "groupBg": true,
    "groupColor": '#ff0000',
};

document.title = appConfig.title;

class SharedToolbar extends Localizable(Events()) {

    constructor() {
        super();
        const me = this;
        me.insertHeader();
        me.insertFooter();
        me.injectFavIcon();
    }

    injectFavIcon() {
        DomHelper.createElement({
            tag: 'link',
            parent: document.head,
            rel: 'icon',
            href: appConfig.favicon,
            sizes: '32x32'
        });
    }

    insertHeader() {
        let date = new Date()
        let mon = date.getMonth() + 1
        let year = date.getFullYear()
        let month = mon < 10 ? "0" + mon : mon
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
        let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
        let min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
        let sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        DomHelper.insertFirst(document.getElementById('container'), {
            tag: 'header',
            className: 'main-header',
            html: `
            <style>
            #unplannedGrid .b-grid-row.b-group-row,
            #scheduler-lockedSubgrid .b-grid-row.b-group-row{
                background: ${appConfig.groupBg}!important;
              }
              .b-grid-cell.b-group-title::before,
              .b-grid-cell.b-group-title{
                color: ${appConfig.groupColor}!important;
              }
            </style>
            <div id="title-container">
                <span id="title">
                    ${appConfig.logo ? `<img class="image" src="${appConfig.logo}"/>` : ''}
                    ${`<span class="today_date"><b>Date:</b> ${Config.formatDate(new Date())}  <b>Time: </b>  ${Config.formatAMPM(new Date())}</span>`}
                </span>
            </div>
            <div id="tools"></div>
        `
        });

        const tools = document.getElementById('tools') || document.body;

        if (Fullscreen.enabled) {
            const fullscreenButton = WidgetHelper.createWidget({
                type: 'button',
                id: 'fullscreen-button',
                icon: 'b-icon b-icon-fullscreen',
                tooltip: this.L('Fullscreen'),
                toggleable: true,
                cls: 'b-blue b-raised',
                keep: true,
                appendTo: tools,
                onToggle: ({ pressed }) => {
                    if (pressed) {
                        Fullscreen.request(document.body);
                    }
                    else {
                        Fullscreen.exit();
                    }
                }
            });

            Fullscreen.onFullscreenChange(() => {
                fullscreenButton.pressed = Fullscreen.isFullscreen;
            });
        }

        const button = this.infoButton = WidgetHelper.createWidget({
            type: 'button',
            ref: 'infoButton',
            icon: 'b-icon b-icon-info',
            cls: 'b-blue b-raised keep',
            toggleable: true,
            hidden: true,
            tooltip: {
                html: this.L('Click to show info and switch theme or locale'),
                align: 't100-b100'
            },
            preventTooltipOnTouch: true,
            keep: true,
            appendTo: tools
        });

    }

    insertFooter() {
        DomHelper.append(document.getElementById('container'), {
            tag: 'footer',
            className: 'main-footer',
            html: `
            <div id="title-footer">
           
                <ul class="legend">
                  <li class="title"> Booking Status </li>
                  <li><span class="hms-pre-check-in"></span> Pre CheckIn</li>
                  <li><span class="hms-in-house"></span> In House</li>
                  <li><span class="hms-gtd-reservation"></span>Deposit Reservation</li>
                  <li><span class="hms-ngtd-reservation"></span>NGTD Reservation</li>
                  <li><span class="hms-checked-out"></span>Checked Out</li>
                </ul>
         
                
                <ul class="legend">
                  <li class="title"> Days Header </li>
                  <li><span class="ag-header-today"></span> Today</li>
                  <li><span class="ag-header-weekend"></span> Weekend</li>
                  <li><span class="ag-header-holiday"></span> Holiday</li>
                </ul>
             
                
                <ul class="legend">
                  <li class="title"> Room Status</li>
                  <li><i class="fa fa-suitcase"></i>Occupied</li>
                  <li><i class="fa fa-paint-brush"></i>Dirty</li>
                  <li><i class="fa fa-genderless"></i> &nbsp;Available</li>
                  <li><i class="fa fa-wrench"></i> Out Of Order</li>
                </ul>
            
            </div>
        `
        });
    }


}

export default SharedToolbar;