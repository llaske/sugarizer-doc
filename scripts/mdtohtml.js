// Get MD filename
var filename = null;
if (process.argv.length != 3) {
	console.log("Usage: mdtohtml <mdfile_lang>");
	return 1;
}
filename = process.argv[2];
var path = require('path');
var basename = path.basename(filename);
var parser = basename.match(/([^_]*)_([^\.]*)(\..+)?/);
if (parser == null) {
	console.log("Usage: mdtohtml <mdfile_lang>");
	return 1;
}
var fileprefix = parser[1];

// Load file 
var	fs = require('fs');
if (filename) {
	fs.readFile(filename, 'utf-8', function(err, read) {
		// Retrieve file properties
		var language = (parser[2]!="fr"?"en":"fr");
		var enSelected = (language=="en"?" selected":"");
		var frSelected = (language=="fr"?" selected":"");
		parser = read.match(/^# (.*)$/m);
		var title = "<no title>";
		if (parser != null) {
			title = parser[1];
		}
		parser = read.match(/^([^# \n].+)$/m);
		var description = "<no description>";
		if (parser != null) {
			description = parser[1];
		}
		const thumbnailPrefix = "thumbnail!!";
		var thumbnail = "";

		// Generate header 
		var header = fs.readFileSync("templates/header_"+language+".html", {encoding:'utf8', flag:'r'});
		header = header
			.replaceAll("{{title}}", title)
			.replaceAll("{{description}}", description)
			.replaceAll("{{language}}", language)
			.replaceAll("{{fileprefix}}", fileprefix)
			.replaceAll("{{en_selected}}", enSelected)
			.replaceAll("{{fr_selected}}", frSelected);

		// Convert to HTML
		var md = require('markdown-it')();
		var markdownStyle = require('markdown-it-style');
		md.use(markdownStyle, {
			'ul': "list-style-type: disc; padding-left: 2rem;"
		});
		md.renderer.rules.image = function (tokens, idx, options, env, self) {
			var token = tokens[idx], aIndex = token.attrIndex('src');
			var caption = token.content;
			if (caption.startsWith(thumbnailPrefix)) {
				caption = caption.substring(thumbnailPrefix.length);
				thumbnail = token.attrs[aIndex][1];
			}
			return '<div class="text-center"><img src="'+token.attrs[aIndex][1]+'" class="ms-3 img-fluid p-2 bg-light border" width="800px" alt="'+caption+'"></div><figcaption class="ms-3 figure-caption text-center">'+caption+'</figcaption>';
		};
		md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
			var token = tokens[idx];
			const hrefIndex = token.attrIndex('href');
			if (hrefIndex >= 0) {
				token.attrs[hrefIndex][1] = token.attrs[hrefIndex][1].replace('.md', '.html');
			}
			return self.renderToken(tokens, idx, options);
		};
		var result = md.render(read);
		header = header.replaceAll("{{thumbnail}}", thumbnail);

		// Add footer 
		const footer = fs.readFileSync("templates/footer_"+language+".html", {encoding:'utf8', flag:'r'});

		// Write file
		console.log("<!-- DO NOT UPDATE THIS FILE - Generated from "+basename+" -->")
		console.log(header);
		console.log(result);
		console.log(footer);
	});
}
