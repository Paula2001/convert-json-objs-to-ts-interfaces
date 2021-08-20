let convertable = false ;
let obj ;
let errorLine = 0 ;
let inputHtml = document.getElementById('input');
inputHtml.onkeydown = function(event) {
	if (event.key == 'Tab') {
		event.preventDefault();
		var start = this.selectionStart;
		var end = this.selectionEnd;
		this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
		this.selectionStart = this.selectionEnd = start + 1;
	}
}
function selectTextareaLine(tarea,lineNum) {
	lineNum--; // array starts at 0
	var lines = tarea.value.split("\n");

	// calculate start/end
	var startPos = 0, endPos = tarea.value.length;
	for(var x = 0; x < lines.length; x++) {
		if(x == lineNum) {
			break;
		}
		startPos += (lines[x].length+1);

	}

	var endPos = lines[lineNum].length+startPos;

	// do selection
	// Chrome / Firefox

	if(typeof(tarea.selectionStart) != "undefined") {
		tarea.focus();
		tarea.selectionStart = startPos;
		tarea.selectionEnd = endPos;
		return true;
	}

	// IE
	if (document.selection && document.selection.createRange) {
		tarea.focus();
		tarea.select();
		var range = document.selection.createRange();
		range.collapse(true);
		range.moveEnd("character", endPos);
		range.moveStart("character", startPos);
		range.select();
		return true;
	}

	return false;
}

function checkJsonValid(){
	try {
		obj = JSON.parse(inputHtml.value);
		inputHtml.style.backgroundColor = "#eed59a";
		inputHtml.style.color = "black";
		convertable = true;
		document.getElementById('error').innerText = '';
	} catch (error) {
		const lineNumber = parseInt(error.toString().match(/\d/i));
		const errorItSelf = error.toString().match(/JSON.parse: (.*) at/);
		document.getElementById('error').innerText = `error in line ${lineNumber} , ${errorItSelf[1]}`
		inputHtml.style.color = "white";
		inputHtml.style.backgroundColor = "#bb2124";
	}
}
inputHtml.onkeyup = function() {
	checkJsonValid()
}
const checkIfArr = (key) => {
	//Todo : has to have recursion in here
	if(Array.isArray(key)){
		let type = 'any';
		if(key[0]){
			type = typeof key[0];
		}
		return `Array<${type}>`;
	}else{
		return 'unknown'
	}
}

document.getElementById('convert').onclick = () => {
	checkJsonValid();
	if(convertable){
		const Iname = document.getElementById("interface_name").value;
		let types = `interface ${Iname} {`;
		for (const key in obj){
			const name = key;
			const type = typeof obj[key] === 'object' ? checkIfArr(obj[key]) : typeof obj[key];
			types += `\n ${name}: ${type};`;
		}
		types += `\n}`;
		document.getElementById('result').value = types;
	}else{
		// alert("json is not invalid !")
	}
}


