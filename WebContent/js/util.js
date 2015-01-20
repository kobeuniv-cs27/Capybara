function cl(s) {
	console.log(s);
	$('#debug').html(s);
}


function sleep(ms) {
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); }
	while(curDate-date < ms);
}

function getUrlParams()
{
  var vars = new Object, params;
  var temp_params = window.location.search.substring(1).split('&');
  for(var i = 0; i <temp_params.length; i++) {
    params = temp_params[i].split('=');
    vars[params[0]] = params[1];
  }
  return vars;
}