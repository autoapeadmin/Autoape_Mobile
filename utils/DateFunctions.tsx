export const findDaysDiffrent = (fromDate) => {


    var fullDate = fromDate;
    fullDate = fullDate.split(' ');

    var date = fullDate[0].split("-");

    var newDate = date[0] + '/' + date[1] + '/' + date[2];
    var k = new Date(newDate);

    let CreatedDate = new Date(newDate)

    let today = new Date()
    let requiredDiffrentDays

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((CreatedDate - today) / oneDay));


    if (diffDays >= 360) {
        requiredDiffrentDays = Math.floor(diffDays / 360) == 1 ? `${Math.floor(diffDays / 365)} year ago` : `${Math.floor(diffDays / 365)} years ago`
    } else if (diffDays >= 30) {
        requiredDiffrentDays = Math.floor(diffDays / 30) == 1 ? `${Math.floor(diffDays / 30)} month ago` : `${Math.floor(diffDays / 30)} months ago`
    } else if (diffDays < 30) {
        requiredDiffrentDays = (diffDays == 1 || diffDays == 0) ? `${diffDays} day ago` : `${diffDays} days ago`
    }

    return requiredDiffrentDays;
}

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const  dateFormat1 = (d) => {
  var t = new Date(d);
  return t.getDate() + ' ' + monthNames[t.getMonth()] + ', ' + t.getFullYear();
}

function dateFormat2(d) {
  var t = new Date(d);
  return t.getDate() + ' ' + monthShortNames[t.getMonth()] + ', ' + t.getFullYear();
}

