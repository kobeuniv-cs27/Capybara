//var endpoint = 'http://192.168.0.128:8080/capybara/api';
//var endpoint = './api';
var endpoint = 'http://133.30.159.3:8080/capybara/api';

$.ajax({
	url: endpoint + '/list',
	type: 'GET',
	success: function(data) {
		for (var i=0; i<data.metainfo.length; i++) {
            
			var meta = data.metainfo[i];

            var grid = document.querySelector('#grid');
            var thumbnail = createThumbnail(meta);
            salvattore['append_elements'](grid, thumbnail);            
		}
	}
});


function createThumbnail(meta) {

	var editUrl = endpoint + '/?id=' + meta.id;
	var imgUrl =  endpoint + '/img/' + meta.id + '.png';

    // itemに画像やメタ情報を追加していく
    var item = '';

    
    item += '<a href="' + editUrl + '"><img src="' + imgUrl +'"></a>';
    item += '<div><h3><' + meta.title + '</h3></div>';
    
    item += '<div class="tag">';
    if (meta.tags != undefined) {
        for (var i = 0; i < meta.tags.length; i++ ) {
            console.log(meta.tags[i]);
            item += '<span class="">' + meta.tags[i] + '</span> ';
        }        
    }
    item += '</div>';

    item += '<p>create: ' + meta.createdAt + '</p>';
    item += '<p>last update: ' + meta.lastUpdatedAt+ '</p>';
    
    return $('<div class="cover"><div class="item">' + item + '</div></div>');

}
