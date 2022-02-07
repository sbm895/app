//we set the input date element
const inputDate = document.getElementById('date-input');
const cardsCtn = document.querySelector('.grid-ctn');

console.log(cardsCtn)

const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday"]

const currentDate = new Date();
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
    const response = await axios.get('/data.json');

    //clear all elements from the main div
    cardsCtn.innerHTML = '';

    const array = response.data.schedules
    const elements = [];

    const selectedHour = flatpickrInstance.selectedDates[0];

    for (let i = 0, n = array.length; i < n; i++) {
        //get the day of the week
        const classDay = array[i].days[weekDays[selectedHour.getDay() - 1]]

        const isInClass = classDay.some((e) => {
            const beginning = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), e.beginning.split(':')[0], e.beginning.split(':')[1])
            const ending = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), e.ending.split(':')[0], e.ending.split(':')[1])

            if(selectedHour >= beginning && selectedHour <= ending) return true
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
            <p>${isInClass === true ? "Ocupado" : "Libre" }</p>
        </div>
        `

        elements.push(div)
    }

    elements.forEach((e)=> {
        cardsCtn.appendChild(e)
    })
}

getData();