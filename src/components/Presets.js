let { PresetManager, PresetStore } = window.bryntum.scheduler;
export const requiredPresetIds = {
    //secondAndMinute: 1,
    minuteAndHour: 1,
    hourAndDay: 1,
    dayNightShift: 1,
    weekAndDay: 1,
    weekAndMonth: 1,
    weekAndDayLetter: 1,
    weekDateAndMonth: 1,
    monthAndYear: 1,
    year: 1
    //manyYears: 1
};

// Create a presets store with just the ones we want.
// The set of available Presets is what provides the zoom levels.
export const presets = PresetManager.records.filter(p => requiredPresetIds[p.id]);
export const presetStore = new PresetStore({
    data: presets,
    // We'd like the order to go from seconds to years, rather than the default order
    zoomOrder: -1
});