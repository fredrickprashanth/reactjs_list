React = require("../bower_components/react/react.js");
$ = require("../bower_components/jquery/dist/jquery.js");

var ListItem = React.createClass({
    handleOnClick: function(e) {
        e.preventDefault();
        var name = this.refs.name.getDOMNode().value.trim();
        if (!name) {
            return;
        }
        this.props.handleRemove(name);
    },
    render: function() {
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.desc}</td>
                <input type="hidden" value={this.props.name} ref="name"/>
                <td> <a href="" className="uk-icon-hover uk-icon-minus-square" onClick={this.handleOnClick}></a> </td>
            </tr>
        );
    }
});

var ListAdd = React.createClass({
    onClick: function(e) {
        e.preventDefault();
        var name = this.refs.name.getDOMNode().value.trim();
        var desc = this.refs.desc.getDOMNode().value.trim();
        if (!name || !desc) {
            return;
        }
        this.props.handleAdd({name:name, desc:desc});
        this.refs.name.getDOMNode().value = "";
        this.refs.desc.getDOMNode().value = "";
    },
    render: function() {
        return (
                <tr>
                    <td> <input type="text" placeholder="name" ref="name"/> </td>
                    <td> <input type="text" placeholder="description" ref="desc"/> </td>
                    <td> <a href="" className="uk-icon-hover uk-icon-plus-square" onClick={this.onClick}></a> </td>
                </tr>
        );
    }
});
        
var List = React.createClass({
    loadData: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []}
    },
    componentDidMount: function() {
        this.loadData();
    },
    handleAddItem: function(item) {
        var items = this.state.data;
        $.ajax({
            url: 'item/add',
            dataType: 'json',
            type: 'POST',
            data: item,
            success: function(data) {
                if (data["status"] == "SUCCESS") {
                    items.push(item);
                    this.setState({data:items});
                }
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },
    handleRemoveItem: function(name) {
        var items = this.state.data;
        $.ajax({
            url: 'item/remove',
            dataType:'json',
            type:'POST',
            data:{"name": name},
            success: function(data) {
                if (data["status"] == "SUCCESS") {
                    items.every(function(item, i, items) {
                        if (item.name == name) {
                            items.splice(i, 1);
                        } else {
                            return 1;
                        }
                    });
                    this.setState({data:items});
                }
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },
    render: function() {
        var items = this.state.data;
        var ListItemNodes = items.map(function(item) {
            return (
                <ListItem name={item.name} desc={item.desc} handleRemove={this.handleRemoveItem}/>
            );
        }, this);
        return (
            <table className="uk-table uk-table-hover">
                <tbody>
                    {ListItemNodes}
                    <ListAdd handleAdd={this.handleAddItem} />
                </tbody>
            </table>
        );
   }
});

React.render(
        <List url="item/list" />,
        document.getElementById('content')
);
