const fs = require('fs');

const INDENT_CHAR = "\t";

var indexString = "# Index\n\n";
var docString = "";

const getIndent = (n) => {
	indent = "";
	for (var i=0;i<n;i++){
		indent += INDENT_CHAR;
	}
	return indent;
};

const getReadmeText = (path) => {
	let conts = fs.readFileSync(path)	
	return conts.toString();
}

const walk = (dir, level=0) => {
	let allFiles = fs.readdirSync(dir)
	let files = allFiles.filter(file => 
		fs.statSync(dir + "/" + file).isDirectory()
	);
	files.forEach(file => {
		let filePath = `${dir}/${file}`;
		let link = filePath.replace("./", "");
		indexString += `${getIndent(level)}- [${file}](${link})\n`;
		if (fs.existsSync(`${dir}/${file}/README.md`)) {
			docString += `# ${file}\n${getReadmeText(`${dir}/${file}/README.md`)}\n`
		}
		walk(filePath, level+1);
	});
};

const build = () => {
	walk("./problems");

	fs.writeFile("./INDEX.md", indexString, (err) => {
		if(err) {
			console.log("couldn't write to INDEX.md. err:", err);
		}else {
			console.log("INDEX.md successfully updated!");
		}
	});

	fs.writeFile("./docs/README.md", docString, (err) => {
		if(err) {
			console.log("couldn't write to docs/README.md err:", err);
		}else {
			console.log("docs/README.md successfully updated!");
		}
	});
};

build();
