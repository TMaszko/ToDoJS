(function(){


	function Task (data) {
		var title = data.title;
		var done = data.done;
		var date = new Date();
		var months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru']
		var	dateStr = date.getDay() + ' - ' + (months[date.getMonth()]) +' - ' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() ;

		return {
			getTitle: function () {
					return title;
			},
			isDone: function () {
				return done;
			},
			taskDone: function () {
					done = !done;

			},
			getTaskDate: function () {
				return dateStr;
			},
			setTitle: function (newTitle) {
					title = newTitle;
			},

		};
	}

	

function Model(items){
	this._items = items;
	Model.prototype.addItem = function (task) {
		this._items.push(task);
	};
	Model.prototype.done = function (index) {
		this._items[index].taskDone();
		return this._items[index].isDone();
	}
	Model.prototype.removeItem = function (index) {
		this._items.splice(index,1);
	}
	Model.prototype.getItems = function () {
		return this._items;
	}
}
function View (model , elements){
	var _elements = elements;
	var list = _elements.list;
	var items = model.getItems();
	View.prototype.addElementToList = function (id) {
		var li = document.createElement('li');
			li.id = id;
			if(items[id].isDone())
				this.doneTask(li);
			li.innerHTML = items[id].getTitle() + "<button class='removeTaskBtn'>Remove</button><button class='doneBtn'>Done</button>" + items[id].getTaskDate();
			list.appendChild(li);
	}

	View.prototype.rebuildList = function () {
		 // get items from model to render
		list.innerHTML = ''; // clean the list
		for(var key in items) {
			if (items.hasOwnProperty(key)){
				this.addElementToList(key);
			}
		}
	}

	View.prototype.doneTask = function (node) {
		node.style.textDecoration = 'line-through';
	}

	View.prototype.notDoneTask = function ( node ) {
		node.style.textDecoration = ' none ';
	}

	View.prototype.show = function () { // more semantically for first use
		this.rebuildList();
	}
}

function Controller ( model , view ) {
	var addBtn,
		doneBtns, 
		input,
		removeBtns,
		inputValue,
		_model = model,
		_view = view;

	function cacheDom () {
		addBtn = document.querySelector('.addTaskBtn');
		input = document.querySelector('.newTaskIn');
		removeBtns = document.querySelectorAll('.removeTaskBtn');
		doneBtns = document.querySelectorAll('.doneBtn');
	}

	cacheDom();

	function bindEvents () {
	 	input.addEventListener('change' , function () {
			inputValue = input.value;
		});
		addBtn.addEventListener('click', function () {
			_model.addItem(new Task({ title: inputValue }));
			_view.rebuildList(); // render new list
			removeBtns = document.querySelectorAll('.removeTaskBtn'); // cache again remove btns 
			doneBtns = document.querySelectorAll('.doneBtn'); // cache again done btns
			bindRemoveAndDoneEvents(); // bind again remove events because of rebuilded list 
		});
	 }

		function bindRemoveAndDoneEvents () { 
		[].forEach.call(doneBtns,function (el) {
			el.addEventListener('click', function (e) {
				if(_model.done(e.target.parentNode.id,e.target)) {
					_view.doneTask(e.target.parentNode);
				}
				else {
					_view.notDoneTask(e.target.parentNode);
				}
				doneBtns = document.querySelectorAll('.doneBtn'); //  cache again done btns
			})
		});
		[].forEach.call(removeBtns,function (el) {
			el.addEventListener('click', function (e) {
				_model.removeItem(e.target.parentNode.id);
				_view.rebuildList();
				removeBtns = document.querySelectorAll('.removeTaskBtn');
				doneBtns = document.querySelectorAll('.doneBtn');  //  cache again remove btns
				bindRemoveAndDoneEvents();
			})
		})
	}

	function bindAllEvents () {
		bindEvents();
		bindRemoveAndDoneEvents();
	}
	bindAllEvents();

}
	function init () {
	var modelList = new Model([new Task({ title: 'Koduj'}),new Task({ title: 'Posprzataj'})]);
	var viewList = new View(modelList, {list : document.querySelector('.tasks')});
	viewList.show(); 
	var contollerList = new Controller(modelList,viewList);
	}	

	init();
	
})();





