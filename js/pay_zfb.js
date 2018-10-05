/**
 * Created by ji on 2017/11/21.
 */
$(document).ready(function () {
    var source = getSessionData('html');
    if (!!source) {
        source = JSON.parse(source) || {};
        //console.log(source.html);
      getDom('#Pay').innerHTML=source.html;
        document.forms[0].submit();
    }



})
;
