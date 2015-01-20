
//var endpoint = 'http://192.168.0.128:8080/capybara/api';
var endpoint = './api';
//var endpoint = 'http://133.30.159.3:8080/Capybara';

$.ajax({
	url: endpoint + '/list',
	type: 'GET',
	success: function(data) {
		for (var i=0; i<data.metainfo.length; i++) {
			var $metaItem = $('<ul>');
			var meta = data.metainfo[i];
			var tags = '';
			if (meta.tags != undefined) {
				for (var j=0; j<meta.tags.length; j++) {
					tags += meta.tags[j];
				}
			}
			$metaItem.append('<li>' + meta.id + '</li>');
			$metaItem.append('<li>' + meta.title + '</li>');
			$metaItem.append('<li>' + tags + '</li>');
			$metaItem.append('<li>' + meta.createdAt + '</li>');
			$metaItem.append('<li>' + meta.lastUpdatedAt + '</li>');


			var editUrl = './?id=' + meta.id;
			var imgUrl = 'api/img/' + meta.id + '.png';

			$('<a>').attr('href', editUrl).append(
				$('<img class="pict">').attr('src', imgUrl)
			).appendTo($metaItem);

			$('<li>').append(
				$('<a>').attr('href', imgUrl).append(
					'png'
				)
			).appendTo($metaItem);


			$('#records').append($metaItem);

		}
	}
})
