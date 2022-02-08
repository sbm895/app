//we set the input date element
const inputDate = document.getElementById('date-input'),
    cardsCtn = document.querySelector('.grid-ctn');

const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday"];

//this variable returns the current date
const currentDate = new Date();
//we declare the input date instace with the flatpickr library
const flatpickrInstance = flatpickr(inputDate, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    //change the current value of the input date
    defaultDate: new Date(),
    onChange: () => {
        getData();
    }
})

//declarate the function for getting the json data
async function getData() {
    //we fetch the data from the data file (json)
    const response = await axios.get('/data.json');

    //clear all elements from the main div
    cardsCtn.innerHTML = '';

    //we save the schedules in this variable
    const array = response.data.schedules;
    //we declare the array that contiains
    const elements = [];

    //We get the selected hour from the library
    const selectedHour = flatpickrInstance.selectedDates[0];

    //loop for create the cards rely on the schedules
    for (let i = 0, n = array.length; i < n; i++) {
        //get the day of the week
        const classDay = array[i].days[weekDays[selectedHour.getDay() - 1]]

        console.log('class day: ', classDay)

        if (!classDay) continue;

        //we validate if the student is currently in class
        const isInClass = classDay.some((e) => {
            //we get the beginning and the ending of the class
            const beginning = new Date(selectedHour.getFullYear(), selectedHour.getMonth(), selectedHour.getDate(), e.beginning.split(':')[0], e.beginning.split(':')[1])
            const ending = new Date(selectedHour.getFullYear(), selectedHour.getMonth(), selectedHour.getDate(), e.ending.split(':')[0], e.ending.split(':')[1])

            //we verify if the selected hour is between the beginning and the ending
            if (selectedHour >= beginning && selectedHour <= ending) return true
            else return false
        });

        //create the div for the card
        const div = document.createElement('div');
        div.classList.add('card')

        //create the div for the headers
        div.innerHTML = `
        <div class="header">
            <img src="${array[i].image}" alt="female icon">
            <h3>
                ${array[i].name}    
            </h3>
        </div>

        <div class="state">
            <span class="${isInClass ? 'red' : 'blue'}"></span>
            <p>${isInClass ? "Ocupado" : "Libre" }</p>
        </div>
        `

        //we add the element to the array
        elements.push(div)
    }

    if (elements.length === 0) return Swal.fire('Error', 'Losentimos, no hemos encontrado datos para esta fecha', 'error');

    //we loop the cards
    elements.forEach((e) => {
        //we add the element to the DOM
        cardsCtn.appendChild(e)
    })
}

getData();