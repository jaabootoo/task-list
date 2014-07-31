
/** @jsx React.DOM */
var TodoItem = React.createClass({
	render: function() {
		return <li key={this.props.task.id}><input type='checkbox' checked={this.props.task.complete} onChange={this.handleComplete} /> 
		<input onChange={this.handleEdit} value={this.props.task.text} className='todo-item' />
		<button onClick={this.handleDelete}>x</button></li>;
	},
	handleComplete: function(e) {
		this.props.checked(e,this.props.task);
	},
	handleEdit: function(e) {
		this.props.edit(e,this.props.task);
	},
	handleDelete: function(e) {
		this.props.delete(e,this.props.task);
	}
});

var TodoList = React.createClass({
	render: function() {
		that = this;
		var todoItems = this.props.items.map(function(task){
			return <TodoItem task={task} checked={that.whenChecked} edit={that.whenEdited} delete={that.whenDeleted}/>
		});
		return <ul>{todoItems}</ul>;
	},
	whenChecked: function(e,task) {
		var taskIndex = this.props.items.indexOf(task);
		var setTasks = this.props.items;
		var setTask = task;
		setTask.complete = !setTask.complete;
		setTasks[taskIndex] = setTask;
		this.setState({items:setTasks});
	},
	whenEdited: function(e,task) {
		var taskIndex = this.props.items.indexOf(task);
		var setTasks = this.props.items;
		var setTask = task;
		setTask.text = e.target.value;
		setTasks[taskIndex] = setTask;
		this.setState({items:setTasks});
	},
	whenDeleted: function(e,task) {
		var taskIndex = this.props.items.indexOf(task);
		var setTasks = this.props.items.splice(taskIndex,1);
		this.setState({items:setTasks});
	}
});

var TodoApp = React.createClass({
  getInitialState: function() {
    return {items: [], text: ''};
  },
  onChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var nextTask = {"id":(this.state.items.length +1),"text":this.state.text,"complete":false};
    var nextItems = this.state.items.concat([nextTask]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
    return (
      <div>
        <h1>My Todo List</h1>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{'Add Task'}</button>
        </form>
      </div>
    );
  }
});
React.renderComponent(<TodoApp />, tasklist);