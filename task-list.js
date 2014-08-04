/** @jsx React.DOM */
var TodoItem = React.createClass({
	render: function() {
		var rowClass = '';
		if (this.props.task.complete) rowClass = 'success';

		var completeClass = 'btn';
		completeClass += (this.props.task.complete) ? ' btn-success active' : ' btn-default';

		var completeText = 'In Process';
		if (this.props.task.complete) completeText = 'Complete';

		return (
			<tr className={rowClass}>
				<td className='col-md-12'>
					<div className='input-group'>
						<span className='input-group-btn'><button onClick={this.handleComplete} className={completeClass}>{completeText}</button></span>
						<input onChange={this.handleEdit} value={this.props.task.text} className='form-control' />
						<span className='input-group-btn'><button onClick={this.handleDelete} className='btn btn-default'>x</button></span>
					</div>
				</td>
			</tr>
		);
	},
	handleComplete: function(e) {
		this.props.complete(e,this.props.task);
	},
	handleEdit: function(e) {
		this.props.edit(e,this.props.task);
	},
	handleDelete: function(e) {
		this.props.delete(e,this.props.task);
	}
});

var DeletedItem = React.createClass({
	render: function() {
		var rowClass = 'active';

		var completeClass = 'btn btn-default';
		if (this.props.task.complete) completeClass += ' active';

		var completeText = 'Removed';
		if (this.props.task.complete) completeText = 'Complete';

		return (
			<tr className={rowClass}>
				<td className='col-md-12'>
					<div className='input-group'>
						<span className='input-group-btn'><button className={completeClass} disabled>{completeText}</button></span>
						<input value={this.props.task.text} className='form-control' disabled />
						<span className='input-group-btn'><button onClick={this.handleUnDelete} className='btn btn-default'>Undelete</button></span>
					</div>
				</td>
			</tr>
		);
	},
	handleUnDelete: function(e) {
		this.props.undelete(e,this.props.task);
	}
});


var SaveLink = React.createClass({
	render: function() {
		var taskList = JSON.stringify(this.props.tasks);
		var tasksParameter = '?' + encodeURIComponent(taskList);
		return (
			<div className='pull-right'><a href={tasksParameter}>Share this task list</a></div>
		);
	}
});

var ClearStorage = React.createClass({
	render: function() {
		return (
			<div className='pull-right'><a href='?' onClick={this.handleClear}>Clear existing list (no undo)</a></div>
		);
	},
	handleClear: function(){
		localStorage.removeItem('jb-taskList');
		localStorage.removeItem('jb-currentId');
	}
});

var TodoList = React.createClass({
	render: function() {
		that = this;
		var todoItems = this.props.tasks.map(function(task){
			if (!task.deleted) return <TodoItem task={task} complete={that.whenCompleted} edit={that.whenEdited} delete={that.whenDeleted}/>
		});

		var deletedItems = this.props.tasks.map(function(task){
			if (task.deleted) return <DeletedItem task={task} undelete={that.whenDeleted}/>
		});

		return (
			<div>
				<div className='input-group col-lg-12'><SaveLink tasks={this.props.tasks} /></div>
				<table className='table'>
					<tbody>{todoItems}</tbody>
				</table>
				<table className='table'>
					<tbody>{deletedItems}</tbody>
				</table>
			</div>
		);
	},
	whenCompleted: function(e,task) {
		var taskIndex = this.props.tasks.indexOf(task);
		var setTasks = this.props.tasks;
		var setTask = task;
		setTask.complete = !setTask.complete;
		setTasks[taskIndex] = setTask;
		this.setState({tasks:setTasks});
		localStorage.setItem('jb-taskList', JSON.stringify(setTasks));
	},
	whenEdited: function(e,task) {
		var taskIndex = this.props.tasks.indexOf(task);
		var setTasks = this.props.tasks;
		var setTask = task;
		setTask.text = e.target.value;
		setTasks[taskIndex] = setTask;
		this.setState({tasks:setTasks});
		localStorage.setItem('jb-taskList', JSON.stringify(setTasks));
	},
	whenDeleted: function(e,task) {
		var taskIndex = this.props.tasks.indexOf(task);
		var setTasks = this.props.tasks;
		var setTask = task;
		setTask.deleted = !setTask.deleted;
		setTasks[taskIndex] = setTask;
		this.setState({tasks:setTasks});
		localStorage.setItem('jb-taskList', JSON.stringify(setTasks));
	}
});


var TodoApp = React.createClass({
	getInitialState: function() {
		var queryString = location.search;
		queryString = queryString.replace('?','');
		if (queryString) {
			var existingTasks = JSON.parse(decodeURIComponent(queryString));
			var existingId = existingTasks[existingTasks.length-1].id;
		} else {
			var existingTasks = JSON.parse(localStorage.getItem('jb-taskList'));
			if (!existingTasks) existingTasks = [];
			var existingId = JSON.parse(localStorage.getItem('jb-currentId'));
			if (!existingId) existingId = 1;
		}
		return {tasks: existingTasks, text: '', currentid: existingId};
	},

	onChange: function(e) {
		this.setState({text: e.target.value});
	},

	handleSubmit: function(e) {
		e.preventDefault();
		var currentId = this.state.currentid;
		var nextTask = {"id":currentId,"text":this.state.text,"complete":false,"deleted":false};
		var nextTasks = this.state.tasks.concat([nextTask]);
		var nextText = '';
		this.setState({tasks: nextTasks, text: nextText, currentid: this.state.currentid+1});
		localStorage.setItem('jb-taskList', JSON.stringify(nextTasks));
		localStorage.setItem('jb-currentId', JSON.stringify(this.state.currentid+1));
	},
	render: function() {
		return (
			<div>
				<h1>My Todo List</h1>
				<div className='input-group col-lg-12'><ClearStorage /></div>
				<form onSubmit={this.handleSubmit}>
					<div className='input-group col-lg-12'>
						<label className='sr-only' htmlFor='taskInput'>New task</label>
						<input id='taskInput' placeholder='Enter your new task here' className='form-control' onChange={this.onChange} value={this.state.text} />
						<span className='input-group-btn'><button type='submit' className='btn btn-default'>{'Add Task'}</button></span>
					</div>
				</form>

				<br />

				<br />
				<TodoList tasks={this.state.tasks} />
			</div>
		);
	}
});
React.renderComponent(<TodoApp />, tasklist);