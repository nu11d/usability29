(function(template2){
	let Sel = ng.core
	.Component({
		selector: 'sel',
		inputs: ['col_name','tbl_name','option'],
		template: '<template [ngIf]="option">'+
		'<input on-blur="scan()" size=5>&nbsp;&nbsp;</template>'+
		'<select on-change="print()">'+
		'<option value=""></option>'+
		'</select>'
	})
	.Class({
		constructor: [ng.http.Http,function(httpService) {
			this.http = httpService;
			console.log(this.option);
		}],

		ngOnInit: function() {

			//todo: this.option check 

			if( typeof this.option === 'boolean' ) {

				console.log("boolean: ",this.option);

			} else if( typeof this.option === 'string' ) {

				console.log("string: ",this.option.length);

			} else if( typeof this.option === 'array' ) {

				console.log("array: ",this.option.length);

			} else {

				console.log("etc: ",this.option);

			}

		},

		ngAfterViewInit: function() {

			let name = this.tbl_name;
			let data = [this.col_name];
			let htmlsel = document.getElementsByTagName("sel_"+name);

			if( htmlsel.length ) {

				let val = htmlsel[0].getAttribute("name");
				htmlsel[0].removeAttribute("name");
				htmlsel[0].getElementsByTagName("sel")[0].getElementsByTagName("select")[0].setAttribute("name",val);

				this.cd = htmlsel[0].getElementsByTagName("sel")[0].getElementsByTagName("input")[0];
				this.select = document.querySelectorAll('[name="'+val+'"]')[0];

				let _sel = this;
				this.m_cmn_dtl_aj(name,data)
				.subscribe(function(json) {

					_sel.addoption(json);

				});

			}

		},

		selset: function() {
			for ( let i = 0, len = this.select.options.length; i < len; i++ ) {
				if ( this.select.parentNode.parentNode.dataset.search == this.select.options[i].value ) {
					return i;
				}
			}
			return false;
		},

		selsearch: function() {
			for ( let i = 0, len = this.select.options.length; i < len; i++ ) {
				if ( this.cd.value == this.select.options[i].dataset.cd ) {
					return i;
				}
			}
			return false;
		},

		scan: function() {

			let newselindex = this.selsearch();

			if (newselindex) {

				this.cd.style.color = "black";

				if ( this.select.selectedIndex !== newselindex ) {

					this.select.selectedIndex = newselindex;

				}

			} else if (this.cd.value) {

				this.cd.style.color = "red";

			} else {

				this.cd.style.color = "black";

			}

		},

		print: function() {

			if (this.cd) {

				if (this.select.selectedIndex) {

					this.cd.value = this.select.options[this.select.selectedIndex].dataset.cd;

				} else {

					this.cd.value = '';

				}

			}

		},

		addoption: function(json) {

			let len = 0;

			if (json.result.length) {

				len = json.result.length;

				for (let i=0; i<len; i++) {

					let opt_array = json.result[i].split(',');
					let newopt = new Option(opt_array[2],opt_array[0]);
					this.select.appendChild(newopt);
					newopt.setAttribute('data-cd',opt_array[1]);

				}

			}

			if(this.select.parentNode.parentNode.dataset.search){

				let selindex = this.selset();

				if (selindex) {

					this.select.selectedIndex = selindex;
					this.print();

				}

			}

		},

		m_cmn_dtl_aj: function(name,data) {
			let parcel = {};
			parcel.name = name;
			parcel.data = data;
			parcel.where = null;
			parcel.order = data[0];
			let trans_data = JSON.stringify(parcel);
			return this.http.post('../130/m_cmn_dtl_aj2.php', trans_data).map(function(response) {
				return response.json();
			});
		}

	});

	let Calendar = function () {};
	Calendar.prototype.cDay = function (offset) {
		this.youbi = ['日','月','火','水','木','金','土'];

		if (offset && !isNaN(offset)) {

			offset %= 7;

			for (let i=0; i<offset; i++) {

				let first = this.youbi.shift();
				this.youbi.push(first);

			}

		}

		return this.youbi;
	}
	Calendar.prototype.cYear = function () {
		let today = new Date();
		return today.getFullYear();
	}
	Calendar.prototype.ciMonth = function () {
		let today = new Date();
		let monthindex = today.getMonth();
		return monthindex;
	}
	Calendar.prototype.cnMonth = function (para1) {
		this.gatsu = ['１','２','３','４','５','６','７','８','９','１０','１１','１２'];
		if (typeof para1 === "undefined") {
			return this.gatsu[this.ciMonth()];
		} else {
			return this.gatsu[para1];
		}
	}
	Calendar.prototype.ctMonth = function () {
		return this.ciMonth()+1;
	}
	Calendar.prototype.cMonth = function (para1,opts) {
		this.stream = [];
		this.bpool = [];

		let offset = 0;

		if (opts && opts[1]) {

			offset = opts[1];

		}

		this.youbi = this.cDay(offset);

		if (typeof para1 === "undefined") {

			var thepast = new Date(this.cYear(),this.ciMonth(),0);
			var thefirst = new Date(this.cYear(),this.ciMonth(),1);
			var thelast = new Date(this.cYear(),this.ciMonth()+1,0);

		} else if (typeof opts === "undefined") {

			var thepast = new Date(this.cYear(),para1-1,0);
			var thefirst = new Date(this.cYear(),para1-1,1);
			var thelast = new Date(this.cYear(),para1,0);

		} else {

			var thepast = new Date(opts[0],para1-1,0);
			var thefirst = new Date(opts[0],para1-1,1);
			var thelast = new Date(opts[0],para1,0);

		}

		let pastdate = thepast.getDate();
		let namefirstdayindex = thefirst.getDay();
		let lastdate = thelast.getDate();
		let pool = [];

		for(let i = 1; i <= lastdate; i++){
			pool.push(i);
		}

		let row = [];

		if (offset && isNaN(offset)) {

			this.bpool = (JSON.parse(JSON.stringify(pool)));

			for (let i=0; i<namefirstdayindex; i++) {

				let first = this.youbi.shift();
				this.youbi.push(first);

			}

			let youbi = this.youbi.concat(this.youbi).concat(this.youbi).concat(this.youbi);

			for (let i=0; i<lastdate-28; i++) {
				youbi.push(this.youbi[i]);
			}

			this.youbi = (JSON.parse(JSON.stringify(youbi))); // length of 28~31 youbi.

		} else {

			if (offset && !isNaN(offset)) {

				offset %= 7;
				namefirstdayindex -= offset;

				if (namefirstdayindex < 0) {
					namefirstdayindex += 7;
				}

			}

		}

		for(let i = 0; i < namefirstdayindex; i++){
			pool.unshift(0);
		}

		for(let i = 1; i <= pool.length%7; i++){
			pool.push(0);
		}

		while (pool.length) {

			if (pool.length < 7) {

				while (pool.length) {
					row.push(pool.shift());
				}

				this.stream.push(row);
				row = [];

			} else {

				for(let i = 0; i < 7; i++){
					row.push(pool.shift());
				}

				this.stream.push(row);
				row = [];

			}
		}

		let premark = [];

		if (typeof opts === "undefined") {

		} else {

			if (typeof opts[2] === "undefined") {

			} else {

				premark = (JSON.parse(JSON.stringify(opts[2])));

			}

		}

		return ( this.bpool.length ? [this.youbi,this.bpool,premark] : [this.youbi,this.stream,premark] );
	}

	let Rdbms = ng.core
	.Class({
		constructor: [ ng.http.Http, function(http) {
			this.http = http;
		}],

		getName: function(resource) {
			return this.http.get(resource+ "?"+new Date().toString())
			.map(function(response){
				return response.json();
			})
		},

		sendName: function(resource,postbody) {
			return this.http.post(resource, { "jsondata":  JSON.stringify({
		header_memo: 'bar', title: postbody.name, body: postbody.data }) } )
			.map(function(response){ return response.json(); })
		}
	});

	let nService = function () {};

	let InMemHeroService = function () {
		let hero = [
			{id: 1, name: "Sprite"},
			{id: 2, name: "X"},
			{id: 3, name: "Net"},
			{id: 4, name: "Mix"}
			];
		return ng.inMemoryWebApi.InMemoryDbService;
		//return hero;
	}

	InMemHeroService.prototype.lst = function () {
		let name = ["Sprite","X","Net","Mix"];
		return name;
	}

	
	template2.share = 2;
	template2.module1 = ng.core.NgModule({ }).Class({ constructor: function() { } });
	template2.module1.Sel = Sel;
	template2.module1.Calendar = Calendar;
	template2.module1.Rdbms = Rdbms;
	template2.module1.nService = nService;
	template2.module1.InMemHeroService = InMemHeroService;
})(window.template2 || (window.template2 = {}));