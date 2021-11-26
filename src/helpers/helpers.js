/**
 * Helpers Functions
 */
import moment from 'moment';

// Get Date
export function getTheDate(timestamp, format) {
	let time = timestamp * 1000;
	let formatDate = format ? format : 'MM-DD-YYYY';
	return moment(time).format(formatDate);
}

// Convert Date To Timestamp
export function convertDateToTimeStamp(date, format) {
	let formatDate = format ? format : 'YYYY-MM-DD';
	return moment(date, formatDate).unix();
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
	if (length == null) {
		length = 100;
	}
	if (ending == null) {
		ending = '...';
	}
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	} else {
		return str;
	}
}

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
	var c;
	if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split('');
		if (c.length === 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = '0x' + c.join('');
		return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
	}
	throw new Error('Bad Hex');
}

/**
 * Function to return currenr app layout
 */
export function getCurrentAppLayout(router) {
	let location = router.history.current.fullPath;
	let path = location.split("/")
	return path[1];
}


export function slugify (text, ampersand = 'and') {
	const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿỳýœæŕśńṕẃǵǹḿǘẍźḧ'
	const b = 'aaaaeeeeiiiioooouuuuncsyyyoarsnpwgnmuxzh'
	const p = new RegExp(a.split('').join('|'), 'g')

	return text.toString().toLowerCase()
	.replace(/[\s_]+/g, '-')
	.replace(p, c =>
	b.charAt(a.indexOf(c)))
	.replace(/&/g, `-${ampersand}-`)
	.replace(/[^\w-]+/g, '')
	.replace(/--+/g, '-')
	.replace(/^-+|-+$/g, '')
}   




export function getListIdInOrder(array,arrayretorno,element){


	if(typeof arrayretorno[0]=='undefined'){
		arrayretorno[0]= null;
	}


	if(typeof element == 'object'){

		if( arrayretorno[0]== null && element.parent == null){
			arrayretorno[0] = new Object(element).id;
		}
	
		var next =  array.filter(function(n) { return new Object(n.parent).id == new Object(element).id});

		if(typeof next[0] != 'undefined'){
			arrayretorno.push(new Object(next[0]).id);
		}
			
		return getListIdInOrder(array,arrayretorno,next[0]);
	}

}
