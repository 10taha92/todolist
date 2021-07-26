module.exports =daygen;
function daygen() {

      var today = new Date();
      var day = "";
      if(today.getDay()===0 )
        day = "sunday";

        else if(today.getDay()===1 )
        day = "monday";

        else if(today.getDay()===2 )
        day = "tuesday";

        else if(today.getDay()===3 )
        day = "wednesday";

        else if(today.getDay()===4 )
        day = "thursday";

        else if(today.getDay()===5 )
        day = "friday";

        else if(today.getDay()===6 )
        day = "saturday";
      return day;
}
