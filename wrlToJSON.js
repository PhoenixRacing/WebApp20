var fs = require('fs');

console.log('Started')
wrlToJSON('die.wrl', function(err, data){
	var dataStr = JSON.stringify(data);
	fs.writeFileSync('cad.json', dataStr)
	console.log("Finished");
});
function wrlToJSON (path, callback) {
	fs.readFile(path, 'ascii', function(err, data){
		if (err) {
			return callback(err, null);
		}

		if (!data) {
			return callback(new Error('Bad Data'), null);
		}
		var output = {};
		var coor3 = get_coor3(data)
		output.verts = coor3;

		var faces = get_faces3(data);
		output.faces = faces;
		return callback(null, output);
	});
}

function get_coor3(data) {
	var re = /( -?[0-9.]*){3}/g;
	var re2 = /point \[([^]*)\]/g;
	var points = data.match(re2);
	var matches = points[0].match(re);
	var verts = [];
	var check;
	for (var i = 0; i<matches.length; i++) {
		check  = matches[i].split(" ");
		if (check.length !== 4) {
			break;
		}
		
		verts.push([Number(check[1]), Number(check[2]), Number(check[3])]);
	}
	return verts;
}

function get_faces3(data) {
	var re = /( -?[0-9]*,){4}/g;
	var re2 = /coordIndex \[([^]*)\]/g;
	var re3 = / (-?[0-9]*)/g;
	var coordIndex = data.match(re2);
	var matches = coordIndex[0].match(re);
	var faces = [];
	var check;
	for (var i = 0; i<matches.length; i++) {
		check  = matches[i].match(re3);
		if (check.length !== 4) {
			break;
		}
		
		faces.push([Number(check[0].split(" ")[1]), Number(check[1].split(" ")[1]),
					 Number(check[2].split(" ")[1]), Number(check[3].split(" ")[1])]);
	}
	return faces;
}