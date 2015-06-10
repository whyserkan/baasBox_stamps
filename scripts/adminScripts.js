var sortOption = '';
var tableResponse = new Object();

function openImage( url ) {
	
	window.open( url, "bigsize", "toolbar=no,scrollbar=yes,resizable=yes" );

}

function createTable ( res,perPage,pageNumber ) {
	var columnCount = 4,
		colCounter = 0,
		startIndex = 0,
		finishIndex = res.data.length;
	
	var t = '<table><tr>';	
	tableResponse = res.data;
	for (var i=startIndex; i<finishIndex ; i++){ 
		
		var obj = res.data[i];
		t += "<td> <div class='imageClass'><a href='javascript:;' onclick=\'openImage(\""+obj.imageOriginal+"\")\'> <img src='"+ obj.image +"'></a></div>"
		  +"<button onClick='save(\""+i+"\");'>Save</button>"
		  +getSubtable(obj,i) +"</td>";
		
		colCounter++;
		
		if( colCounter == columnCount ){
			t += "</tr><tr>";
			colCounter = 0;
		}
	}
	
	if (colCounter < columnCount) {
		t += "</tr>";
	}
	
	t += "</table>";
	
	return t;
}

function getSubtable(obj,index){
	var t = "<table>";
	
	var keys = Object.keys(obj);

	for(var i=0 ; i < keys.length; i++ ) {
		
		var 
		key = keys[i],
		value = obj[key];
		
		t += "<tr><td>" + key + ":</td><td><input id='text_"+index+"_"+key+"' name="+key+" type='text' value='" + value + "'></td></tr>"; 

	}
	t += "</table>";
	
	return t;
}

function createOptions(response){
	
	if( sortOption == '' ) {
		sortOption = "<option value='defaultSort'> ----- </option>";
		
		var keys = Object.keys(response.data[0]);
	
		for( var i=0 ; i<keys.length ; i++ ) {
			sortOption += "<option value=" + keys[i] + ">" + keys[i] + "</option>"; 
		}
	}
	
	return sortOption;
}

function logObject(obj){
	
	var keys = Object.keys(obj);
	
	for ( var i=0 ; i < keys.length ; i++) {
		//console.log( keys[i] + " - " + obj[keys[i]] );
	}
}

function logObjList(list,key){
	
	for( var i=0 ; i < list.length ; i++ ) {
	
		//console.log( list[i][key] );
	
	}
}

function queryBuild(where, limit, orderField, orderDirection){
	
	var q = Object();
	
	if ( where != null) {
		q.where = where;
	}
	
	if ( limit != null ) {
		q.where += " limit " + limit; 
	}
	
	if ( orderField != null ) {
		q.orderBy = orderField + " " + orderDirection;
	}
	
	return q;
}

function getQueryDataObj(fields,where,page,recordsPerPage,orderBy,orderDirection){
	
	var aObj = new Object();
	
	aObj.where = where;
	aObj.fields = fields;
	
	if( page ) {
		aObj.page = page;
	}
	if( recordsPerPage ) {
		aObj.recordsPerPage = recordsPerPage;
	}
	if( orderBy ) {
		aObj.orderBy = orderBy+" "+orderDirection;
	}
	
	return aObj;
}

function getNavtable ( perPage, selectedPage ) {
	var navTable = "";
	
	if ( realCount > perPage ) {
	
		var pageCount = Math.ceil( realCount / perPage );
		navTable = "Page:<select id='navSelect' onChange=\"openPage(this.value," + perPage + ");\" >";
	
		for( var i = 1 ; i < pageCount + 1 ; i++ ) {
			if( selectedPage == i ){
				navTable += "<option selected value='" + i + "'>" + i + "</option>";
			} else {
				navTable += "<option value='" + i + "'>" + i + "</option>";
			}
			
		}
	
		navTable += "</select>";
		navTable += " / <a href='#' onClick='openPage("+pageCount+","+perPage+")'>"+pageCount+"</a>"
	}
	return navTable;
}

function openPage( pageNumber, perPage ){
	setQueryResult(pageNumber-1);
	var nav = getNavtable(perPage, pageNumber );
	$("#navDiv").html(nav);
	$("#navDiv1").html(nav);
}

function save(index){
	var textPattern = "text_"+index;
	var obj = new Object();
	//tableResponse
	$( "input[id^='"+textPattern+"']" ).each(
		function(){
			if(this.name=="@version"){
				obj[this.name]=parseInt(this.value);
			}else{
				obj[this.name]=this.value;		
			}
		}
	)
	saveOne(obj);
}

function saveOne(obj){
	method = 'PUT';
	url = stampsEndPoint+ '/' + obj.id;
    json = JSON.stringify(obj);
    
	var req = $.ajax({
		url: url,
      	type: method,
      	contentType: 'application/json',
      	dataType: 'json',
      	data: json
    })
      .done(function(res) {
		  alert("ok");
      })
      .fail(function(error) {
		  alert("fail");
      })	
}