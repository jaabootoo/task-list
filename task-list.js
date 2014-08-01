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

		var completeText = 'In Process';
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

var TodoList = React.createClass({
	render: function() {
		that = this;
		var todoItems = this.props.tasks.map(function(task){
			return <TodoItem task={task} complete={that.whenCompleted} edit={that.whenEdited} delete={that.whenDeleted}/>
		});
		return (
			<table className='table'>
			<tbody>{todoItems}</tbody>
			</table>)
		;
	},
	whenCompleted: function(e,task) {
		var taskIndex = this.props.tasks.indexOf(task);
		var setTasks = this.props.tasks;
		var setTask = task;
		setTask.complete = !setTask.complete;
		setTasks[taskIndex] = setTask;
		this.setState({tasks:setTasks});
	},
	whenEdited: function(e,task) {
		var taskIndex = this.props.tasks.indexOf(task);
		var setTasks = this.props.tasks;
		var setTask = task;
		setTask.text = e.target.value;
		setTasks[taskIndex] = setTask;
		this.setState({tasks:setTasks});
	},
	whenDeleted: function(e,task) {
		var taskIndex = this.props.tasks.indexOf(task);
		var setTasks = this.props.tasks.splice(taskIndex,1);
		this.setState({tasks:setTasks});

		var setDeleted = this.props.deletedtasks.concat([task]);
		this.setState({deletedtasks: setDeleted});
		console.log(this.props.deletedtasks);
	}
});

var DeletedTaskList = React.createClass({
	render: function() {
		that = this;
		var deletedItems = this.props.deletedtasks.map(function(task){
			return <DeletedItem task={task} undelete={that.whenUndeleted}/>
		});
		return (
			<table className='table'>
			<tbody>{deletedItems}</tbody>
			</table>)
		;
	},
	whenUndeleted: function(e,task) {
		var deletedIndex = this.props.deletedtasks.indexOf(task);
		var setDeleted = this.props.deletedtasks.splice(deletedIndex,1);
		this.setState({deletedtasks:setTasks});

		var setTasks = this.props.tasks.concat([task]);
		this.setState({tasks: setTasks});
	}

});

var TodoApp = React.createClass({
	getInitialState: function() {
		return {tasks: [], deletedtasks: [{"id":-1,"text":'This is a sample deleted.',"complete":false}], text: '', currentid: 1};
	},

	onChange: function(e) {
		this.setState({text: e.target.value});
	},

	handleSubmit: function(e) {
		e.preventDefault();
		var currentId = this.state.currentid;
		var nextTask = {"id":currentId,"text":this.state.text,"complete":false};
		var nextTasks = this.state.tasks.concat([nextTask]);
		var nextText = '';
		this.setState({tasks: nextTasks, text: nextText, currentid: this.state.currentid+1});
	},
	render: function() {
		return (
			<div>
				<h1>My Todo List</h1>
				<form onSubmit={this.handleSubmit}>
					<div className='input-group col-lg-12'>
						<label className='sr-only' htmlFor='taskInput'>New task</label>
						<input id='taskInput' placeholder='Enter your new task here' className='form-control' onChange={this.onChange} value={this.state.text} />
						<span className='input-group-btn'><button type='submit' className='btn btn-default'>{'Add Task'}</button></span>
					</div>
				</form>
				<TodoList tasks={this.state.tasks} deletedtasks={this.state.deletedtasks} />
				<DeletedTaskList tasks={this.state.tasks} deletedtasks={this.state.deletedtasks} />
			</div>
		);
	}
});
React.renderComponent(<TodoApp />, tasklist);