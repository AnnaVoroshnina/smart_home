const dom = {
    selectbox: document.getElementById('selectbox'),
    selectboxList: document.querySelector('.selectbox__list'),
    rooms: document.getElementById('rooms'),
    settings: document.getElementById('settings'),
    settingsTabs: document.getElementById('settings-tabs'),
    settingsPanels: document.getElementById('settings-panel'),
    temperatureLine: document.getElementById('temperature-line'),
    temperatureRound: document.getElementById('temperature-round'),
    temperature: document.getElementById('temperature'),
    temperatureBtn: document.getElementById('temperature-btn'),
    temperatureSaveBtn: document.getElementById('save-temperature'),
    temperaturePowerBtn: document.getElementById('power'),
    slider: {
        lights: document.getElementById('light-slider'),
        humidity: document.getElementById('humidity-slider')
    },
    switch:{
        lights: document.getElementById('lights-power'),
        humidity: document.getElementById('humidity-power')
    }
}
const rooms = {
    all: 'Все комнаты',
    livingroom: 'Зал',
    bedroom: 'Спальня',
    kitchen: 'Кухня',
    bathroom: 'Ванная',
    studio: 'Кабинет',
    washingroom: 'Уборная'
}

let activeRoom = 'all'
let activeSetting = 'temperature'

const roomsData = { //будем хранить состояние настройки каждой комнаты
    livingroom: {
        temperature: 20,
        temperatureBtOff: false,
        lights: 100,
        lightsOff: false,
        humidity: 60,
        humidityOff: false
    },
    bedroom: {
        temperature: 20,
        temperatureOff: false,
        lights: 100,
        lightsOff: false,
        humidity: 60,
        humidityOff: false
    },
    kitchen: {
        temperature: 20,
        temperatureOff: false,
        lights: 100,
        lightsOff: false,
        humidity: 60,
        humidityOff: false
    },
    bathroom: {
        temperature: 20,
        temperatureOff: false,
        lights: 100,
        lightsOff: false,
        humidity: 60,
        humidityOff: false
    },
    studio: {
        temperature: 20,
        temperatureOff: false,
        lights: 100,
        lightsOff: false,
        humidity: 60,
        humidityOff: false
    },
    washingroom: {
        temperature: 20,
        temperatureOff: false,
        lights: 100,
        lightsOff: false,
        humidity: 60,
        humidityOff: false
    }
}


//Выпадающий список
dom.selectbox.querySelector('.selectbox__selected').addEventListener('click', (event) => {
    dom.selectbox.classList.toggle('open') //если есть клас удаляет, если нет добавляет
})
//клик вне выпадающего списка закрывает список
document.body.addEventListener('click', (event) => {
    const {target} = event //свойство объекта события (event), которое указывает на элемент, на котором произошло событие
    if (
        !target.matches('.selectbox') && //проверяем наличие классов
        !target.parentElement.matches('.selectbox') &&
        !target.parentElement.parentElement.matches('.selectbox')
    ) {
        dom.selectbox.classList.remove('open')
    }
})

//клик по позиции в спике
dom.selectboxList.addEventListener('click', (event) => {
    const {target} = event
    if (target.matches('.selectbox__item')) {
        const {room} = target.dataset
        const selectedItem = dom.selectbox.querySelector('.selected')

        selectedItem.classList.remove('selected')
        target.classList.add('selected')
        dom.selectbox.classList.remove('open')
        selectRoom(room)
    }
})

// выбор комнаты

function selectRoom(room) {
    const selectedRoom = dom.rooms.querySelector('.selected')
    if (selectedRoom) {
        selectedRoom.classList.remove('selected')
    }
    if (room !== 'all') {
        const newSelectedRoom = dom.rooms.querySelector(`[data-room=${room}]`)
        const {
            temperature,
            lights,
            humidity,
            lightsOff,
            humidityOff
        } = roomsData[room]
        activeRoom = room
        newSelectedRoom.classList.add('selected')
        renderScreen(false)
        dom.temperature.innerText = temperature //задаем температуру конкретной комнате
        renderTemperature(temperature)
        setTemperaturePower()
        changeSettingsType(activeSetting) //текущая активная вкладка настроек
        changeSlider(lights, dom.slider.lights)
        changeSlider(humidity, dom.slider.humidity)
        changeSwitch ('lights', lightsOff)
        changeSwitch ('humidity', humidityOff)
    } else {
        renderScreen(true)
    }
    const selectedSelectBoxRoom = dom.selectbox.querySelector('.selectbox__item.selected')
    selectedSelectBoxRoom.classList.remove('selected')
    const newSelectedSelectboxRoom = dom.selectbox.querySelector(`[data-room= ${room}]`)
    newSelectedSelectboxRoom.classList.add('selected')
    const selectboxSelected = dom.selectbox.querySelector('.selectbox__selected span')
    selectboxSelected.innerText = rooms[room]


}

//клик по элемемнту комнаты
dom.rooms.querySelectorAll('.room').forEach(room => {
    room.addEventListener('click', event => {

        const value = room.dataset.room
        selectRoom(value)
    })
})

//Отображение нужного экрана
function renderScreen(isRooms) {
    setTimeout(() => {
        if (isRooms) {
            dom.rooms.style.display = 'grid'
            dom.settings.style.display = 'none'
        } else {
            dom.rooms.style.display = 'none'
            dom.settings.style.display = 'block'
        }
    }, 300)
}

//Панель настроек комнаты

//Изменение температуры - отрисовка
function renderTemperature(temp) {
    const minTemp = 16
    const maxTemp = 40
    const percentRangeTemp = (maxTemp - minTemp) / 100 // 1 процент разницы температуры

    const minLine = 54
    const maxLine = 276
    const percentRangeLine = (maxLine - minLine) / 100  //1 процент линии

    const minRound = -240
    const maxRound = 48
    const percentRangeRound = (maxRound - minRound) / 100  //1 процент круга

    if (temp >= minTemp && temp <= maxTemp) {
        const finishPercentTemperature = Math.round((temp - minTemp) / percentRangeTemp)
        const finishPercentLine = minLine + percentRangeLine * finishPercentTemperature
        const finishPercentRound = minRound + percentRangeRound * finishPercentTemperature

        dom.temperatureLine.style.strokeDasharray = `${finishPercentLine} 276`
        dom.temperatureRound.style.transform = `rotate(${finishPercentRound}deg)`
        dom.temperature.innerText = temp
    }
}

//Изменение температуры мышью
function changeTemperature() {
    let mouseover = false;
    let mousedown = false;
    let position = 0
    let range = 0
    let change = 0

    dom.temperatureBtn.onmouseover = () => {
        mouseover = true
        mousedown = false
    }
    dom.temperatureBtn.onmouseleave = () => mouseover = false
    dom.temperatureBtn.onmousedown = (e) => {
        mousedown = true;
        position = e.offsetY
        range = 0
    }
    dom.temperatureBtn.onmouseup = () => mousedown = false
    dom.temperatureBtn.onmousemove = (e) => {
        if (mouseover && mousedown) {
            range = e.offsetY - position
            const newChange = Math.round(range / -5)
            if (newChange !== change) {
                let temperature = +dom.temperature.innerText
                if (newChange < change) {
                    temperature = temperature - 1
                } else {
                    temperature = temperature + 1
                }
                change = newChange
                renderTemperature(temperature)
            }
        }
    }
}

changeTemperature()

//Сохранение температуры
dom.temperatureSaveBtn.addEventListener('click', () => {
    const temperature = +dom.temperature.innerText
    roomsData[activeRoom].temperature = temperature
})

//Отключение обогрева
dom.temperaturePowerBtn.addEventListener('click', () => {
    const power = dom.temperaturePowerBtn
    power.classList.toggle('off')

    if (power.matches('.off')) {
        roomsData[activeRoom].temperatureOff = true
    } else {
        roomsData[activeRoom].temperatureOff = false
    }
})

//Установка значения кнопки включения температуры
function setTemperaturePower() {
    if (roomsData[activeRoom].temperatureOff) {
        dom.temperaturePowerBtn.classList.add('off')
    } else {
        dom.temperaturePowerBtn.classList.remove('off')
    }
}

/*Переключение настроек*/

dom.settingsTabs.querySelectorAll('.settings__type').forEach(type => {
    type.onclick = () => {
        const optionType = type.dataset.type //получаем инфу о настройке
        changeSettingsType(optionType)
        activeSetting = optionType
    }
})

//Смена панели настроек
function changeSettingsType(type) {
    const tabSelected = dom.settingsTabs.querySelector('.settings__type.selected')
    tabSelected.classList.remove('selected')

    const tab = dom.settingsTabs.querySelector(`[data-type= ${type}]`)
    //текущему настройе добавляем класс selected
    tab.classList.add('selected')

    const panelSelected = dom.settingsPanels.querySelector('.selected')
    panelSelected.classList.remove('selected')

    const panel = dom.settingsPanels.querySelector(`[data-type= ${type}]`)
    panel.classList.add('selected')
}

//Функция изменения слайдера
function changeSlider(percent, slider) {
    if (percent >= 0 && percent <= 100) {
        const {type} = slider.dataset
        slider.querySelector('span').innerText = percent
        slider.style.height = `${percent}%`
        roomsData[activeRoom][type] = percent
    }
}

//Отслеживание и изменение слайдера
function watchSlider (slider){
    let mouseover = false;
    let mousedown = false;
    let position = 0
    let range = 0
    let change = 0

    slider.parentNode.onmouseover = () => {
        mouseover = true
        mousedown = false
    }
    slider.parentNode.onmouseleave = () => mouseover = false
    slider.parentNode.onmousedown = (e) => {
        mousedown = true;
        position = e.offsetY
        range = 0
    }
    slider.parentNode.onmouseup = () => mousedown = false
    slider.parentNode.onmousemove = (e) => {
        if (mouseover && mousedown) {
            range = e.offsetY - position
            const newChange = Math.round(range / -0.1)
            if (newChange !== change) {
                let percent = +slider.querySelector('span').innerText //сколько процентов у нас сейчас
                if (newChange < change) {
                    percent = percent - 1
                } else {
                    percent = percent + 1
                }
                change = newChange
                changeSlider(percent, slider)
            }
        }
    }
}

watchSlider(dom.slider.lights)
watchSlider(dom.slider.humidity)

/*Переключение свича света/влажности*/
function changeSwitch (activeSetting, isOff) {
    if (isOff) {
        dom.switch[activeSetting].classList.add('off')
    } else dom.switch[activeSetting].classList.remove('off')
    roomsData[activeRoom][`${activeSetting}Off`] = isOff
}
//Переключение свича - клик
dom.switch.humidity.onclick = () =>{
    const isOff = !dom.switch.humidity.matches('.off')
    changeSwitch(activeSetting, isOff)
}
dom.switch.lights.onclick = () =>{
    const isOff = !dom.switch.lights.matches('.off')
    changeSwitch(activeSetting, isOff)
}



