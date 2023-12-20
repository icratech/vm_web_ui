

import { debug } from "../des/utils"
export const validateUnixMilli = ( unixMilli /*UnixMilli*/ ) => {
    let td = new Date( unixMilli )
    if ( td == "Invalid Date" ) { return 0 } 
    else { return unixMilli }
} 

export const FormatDate = (d) => {
    let date = new Date(d)
    let ye = date.getFullYear()
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return`${ye}-${mo}-${da}`;
}
export const FormatTime = (d) => {
    let date = new Date(d)
    let hr =  String(date.getHours()). padStart(2, "0")
    let mn = String(date.getMinutes()). padStart(2, "0")
    let sc = String(date.getSeconds()). padStart(2, "0")
    return`${hr}:${mn}:${sc}`;
}

export const FormatDateSRED = (d) => {
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    return`${ye}-${mo}-${da}`;
}

export const FormatDateTime = (d) => {
    let date = new Date(d)
    let ye = date.getFullYear()
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    let hr =  String(date.getHours()). padStart(2, "0")
    let mn = String(date.getMinutes()). padStart(2, "0")
    let sc = String(date.getSeconds()). padStart(2, "0")
    return`${ye}-${mo}-${da} ${hr}:${mn}:${sc}`;
}

export const FormatDateTimeHTML = (d) => {
    let date = new Date(d)
    let ye = date.getFullYear()
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    let hr =  String(date.getHours()). padStart(2, "0")
    let mn = String(date.getMinutes()). padStart(2, "0")
    let sc = String(date.getSeconds()). padStart(2, "0")
    return `${ye}-<span class="fg-green_a">${mo}</span>-${da}  ${hr}<span class="fg-green_a">:</span>${mn}<span class="fg-green_a">:</span>${sc}`
}

export const FormatTimeCode = (d) => {
    let date = new Date(d)
    let ye = date.getFullYear()
    let mo =  String(date.getMonth() + 1).padStart(2, "0")
    let da =  String(date.getDate()).padStart(2, "0")
    let hr =  String(date.getHours()). padStart(2, "0")
    let mn = String(date.getMinutes()). padStart(2, "0")
    let sc = String(date.getSeconds()). padStart(2, "0")
    let ms = String(date.getMilliseconds()). padStart(3, "0")
    return`${ye}${mo}${da}${hr}${mn}${sc}${ms}`;
}

export const FormatTimeCodeDashed = (d) => {
    let date = new Date(d)
    let ye = date.getFullYear()
    let mo =  String(date.getMonth() + 1).padStart(2, "0")
    let da =  String(date.getDate()).padStart(2, "0")
    let hr =  String(date.getHours()).padStart(2, "0")
    let mn = String(date.getMinutes()).padStart(2, "0")
    let sc = String(date.getSeconds()).padStart(2, "0")
    let ms = String(date.getMilliseconds()).padStart(3, "0")
    return`${ye}${mo}${da}-${hr}${mn}${sc}-${ms}`;
}
