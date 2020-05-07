const viewConst = require('../js/viewConst')
const ipc = require('electron').ipcRenderer
const dialog = require('electron').dialog

var openModalAddEvents = (document) => {
    Array.from(document.getElementsByClassName(viewConst.hourBoxClass)).map((element) => {
        element.addEventListener('click', (event) => {
            document.getElementById(viewConst.modalID).style.display = 'block'
            document.getElementById(viewConst.dateEventInputID).value = event.toElement.getAttribute('date')
        });
    })
    Array.from(document.getElementsByClassName(viewConst.dayBoxClass)).map((element) => {
        element.addEventListener('click', (event) => {
            document.getElementById(viewConst.modalID).style.display = 'block'
            console.log(event.toElement)
            document.getElementById(viewConst.dateEventInputID).value = event.toElement.getAttribute('date')
        });
    })
}

var saveEvent = (document) => {
    let date = document.getElementById(viewConst.dateEventInputID).value;
    let startTime = document.getElementById(viewConst.startTimeInputID).value;
    let endTime = document.getElementById(viewConst.endTimeInputID).value;
    let title = document.getElementById(viewConst.titleEventInputID).value;
    let description = document.getElementById(viewConst.descriptionEventInputID).value
    let badgeClass = viewConst.badgeClasses[Math.floor(Math.random() * viewConst.badgeClasses.length)]
    ipc.send('save-event', {
        date: date,
        startTime: startTime,
        endTime: endTime,
        title: title,
        description: description,
        badgeClass: badgeClass
    })

}

var modalButtonsEvents = (document, reloadCalendar) => {
    var modal = document.getElementById(viewConst.modalID)
    document.getElementById(viewConst.saveID).addEventListener('click', () => {
        saveEvent(document)
        modal.style.display = 'none';
        reloadCalendar(document)
    })
    document.getElementById(viewConst.closeID).addEventListener('click', () => {
        modal.style.display = 'none';
    })
}

module.exports = {
    openModalAddEvents: openModalAddEvents,
    modalButtonsEvents: modalButtonsEvents
}