let { Toast, GlobalEvents, LocaleManager, StringHelper, BrowserHelper, DomHelper, WidgetHelper, Localizable, Events, Fullscreen } = window.bryntum.scheduler;

const appConfig = {
    "title": '',
    "description": 'Staybird',
    "favicon": 'https://staybird.in/wp-content/uploads/2022/05/cropped-staybird_favicon-1-180x180.png',
    "logo": 'https://staybird.in/wp-content/uploads/2022/05/updated_logo.png.webp',
    "groupBg": true,
    "groupColor": '#ff0000',
};


const
    productName = 'scheduler', //LEAVE AS IS, DEFAULT PRODUCT NAME
    defaultTheme = 'Stockholm';

const themes = {
    stockholm: 'Stockholm',
    classic: 'Classic',
    "classic-light": 'Classic-Light',
    "classic-dark": 'Classic-Dark',
    material: 'Material'
};
document.body.classList.add('b-initially-hidden');
// Prevent google translate messing up the DOM in our examples, https://github.com/facebook/react/issues/11538
document.body.classList.add('notranslate');
document.title = appConfig.title;

class SharedToolbar extends Localizable(Events()) {

    constructor() {

        super();

        const
            me = this,
            reset = document.location.href.match(/(\?|&)reset/),
            themeInfo = DomHelper.themeInfo;

        if (reset) {
            BrowserHelper.removeLocalStorageItem('exampleLanguage');
            BrowserHelper.removeLocalStorageItem('bryntumExampleTheme');
        }

        me.productName = productName;

        // Only do theme restoration if we are using a standard theme
        if (themeInfo && themes[themeInfo.name.toLowerCase()]) {
            const theme = me.qs('theme', BrowserHelper.getLocalStorageItem('bryntumExampleTheme') || defaultTheme);

            // Apply default theme first time when the page is loading
            me.applyTheme(theme, true);
        }
        else {
            document.body.classList.remove('b-initially-hidden');
        }

        // Enables special styling when generating thumbs
        if (document.location.href.match(/(\?|&)thumb/)) {
            document.body.classList.add('b-generating-thumb');
        }

        // Subscribe on locale update to save it into the localStorage
        me.localeManager.on('locale', (localeConfig) => BrowserHelper.setLocalStorageItem('exampleLanguage', localeConfig.locale.localeName));

        // Apply default locale first time when the page is loading
        me.localeManager.applyLocale(BrowserHelper.getLocalStorageItem('exampleLanguage') || LocaleManager.locale.localeName, false, true);
        //}

        me.insertHeader();
        me.insertFooter();

        me.loadDescription();

        me.injectFavIcon();

        document.body.style.paddingRight = '0';
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
                    ${appConfig.title}
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

        // const tools = document.getElementById('tools') || document.body;



    }


    loadDescription() {
        const
            me = this,
            button = me.infoButton;

        const
            themeInfo = DomHelper.themeInfo,
            locales = [];

        Object.keys(me.localeManager.locales).forEach(key => {
            const locale = me.localeManager.locales[key];
            locales.push({ value: key, text: locale.desc, data: locale });
        });

        let localeValue = me.localeManager.locale.localeName,
            storedLocaleValue = BrowserHelper.getLocalStorageItem('exampleLanguage'),
            themeCombo;

        // check that stored locale is actually available among locales for this demo
        if (storedLocaleValue && locales.some(l => l.key === storedLocaleValue)) localeValue = storedLocaleValue;

        // Leave as a config during app startup. `Button#get menu` will promote it to a widget
        // when the user clicks it.
        button.menu = {
            type: 'popup',
            anchor: true,
            align: 't100-b100',
            cls: 'info-popup',
            width: '22em',
            items: [
                {
                    type: 'widget',
                    html: `<div class="header">${appConfig.title}</div><div class="description">${appConfig.description}</div>`
                }].concat(themeInfo && themes[themeInfo.name.toLowerCase()]
                    ? [themeCombo = {
                        type: 'combo',
                        ref: 'themeCombo',
                        placeholder: me.L('Select theme'),
                        editable: false,
                        value: StringHelper.capitalizeFirstLetter(BrowserHelper.getLocalStorageItem('bryntumExampleTheme') || defaultTheme),
                        items: themes,
                        onAction: ({ value }) => {
                            me.applyTheme(value);
                            button.menu.hide();
                        }
                    }] : []).concat([
                        {
                            type: 'combo',
                            ref: 'localeCombo',
                            placeholder: me.L('Select locale'),
                            editable: false,
                            store: {
                                data: locales,
                                sorters: [{
                                    field: 'text',
                                    ascending: true
                                }]
                            },
                            displayField: 'text',
                            valueField: 'value',
                            value: localeValue,
                            onAction: ({ value }) => {
                                me.localeManager.applyLocale(value);
                                Toast.show(me.L('Locale changed'));
                                button.menu.hide();
                            }
                        }]),
            listeners: {
                beforeShow() {
                    const popup = this;
                    themeCombo = popup.widgetMap.themeCombo;
                }
            }
        };

        // React to theme changes
        GlobalEvents.on({
            theme: ({ theme, prev }) => {
                theme = theme.toLowerCase();

                themeCombo.value = theme;
                BrowserHelper.setLocalStorageItem('bryntumExampleTheme', theme);
                document.body.classList.add(`b-theme-${theme}`);
                document.body.classList.remove(`b-theme-${prev}`);

                me.prevTheme = prev;

                me.trigger('theme', { theme, prev });
            },
            // call before other theme listeners
            prio: 1
        });
    }

    //endregion

    //region QueryString

    qs(key, defaultValue = null) {
        const regexp = new RegExp(`(?:\\?|&)${key}=([^&]*)`),
            matches = document.location.href.match(regexp);

        if (!matches) return defaultValue;

        return matches[1];
    }

    //endregion

    //region Theme applying

    applyTheme(newThemeName, initial = false) {
        const { body } = document;

        newThemeName = newThemeName.toLowerCase();

        // only want to block transition when doing initial apply of theme
        if (initial) {
            body.classList.add('b-notransition');
        }

        DomHelper.setTheme(newThemeName).then(() => {
            // display after loading theme to not show initial transition from default theme
            document.body.classList.remove('b-initially-hidden');

            if (initial) {
                body.classList.add(`b-theme-${newThemeName}`);
                setTimeout(() => {
                    body.classList.remove('b-notransition');
                }, 100);
            }
        });
    }

    get themeInfo() {
        return DomHelper.themeInfo || { name: defaultTheme };
    }

    get theme() {
        return this.themeInfo.name;
    }

    // Utility method for when creating thumbs.
    // Eg: shared.fireMouseEvent('mouseover', document.querySelector('.b-task-rollup'));
    fireMouseEvent(type, target) {
        const
            targetRect = Rectangle.from(target),
            center = targetRect.center;

        target.dispatchEvent(new MouseEvent(type, {
            clientX: center.x,
            clientY: center.y,
            bubbles: true
        }));
    }

    //endregion
}

export default SharedToolbar;