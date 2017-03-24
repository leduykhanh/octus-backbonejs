var Territory = Backbone.Model.extend({});

var Territories = Backbone.Collection.extend({
  model: Territory,
  url: "territories.json"
});

var territories = new Territories();
var columns = [{
    name: "id", // The key of the model attribute
    label: "ID", // The name to display in the header
    editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
    // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
    cell: Backgrid.IntegerCell.extend({
      orderSeparator: ''
    })
  }, {
    name: "name",
    label: "Name",
    // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
    cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
  }, {
    name: "pop",
    label: "Population",
    cell: "integer" // An integer cell is a number cell that displays humanized integers
  }, {
    name: "percentage",
    label: "% of World Population",
    cell: "number" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
  }, {
    name: "date",
    label: "Date",
    cell: "date"
  }, {
    name: "url",
    label: "URL",
    cell: "uri" // Renders the value in an HTML anchor element
}];

// Initialize a new Grid instance
var grid = new Backgrid.Grid({
  columns: columns,
  collection: territories
});

// Render the grid and attach the root to your HTML document
$("#example-1-result").append(grid.render().el);



// Fetch some countries from the url
territories.fetch({reset: true});
var CollectionView = Backbone.View.extend({
	
	template: $('#template').html(),
	
	initialize: function() {
	
        this.collection = territories;
		new RowView({ collection: this.collection });
		this.collection.on('add', this.addOne, this);
		// this.collection.fetch();
        
        this.render();
	},
	
	events: {
		'keyup #search': 'search',
	},
	
	// Returns array subset of models that match search.
	search: function(e) {
		
		var search = this.$('#search').val().toLowerCase();
		
        $('#example-1-result').empty(); // is this creating ghost views?
        
		_.each(this.collection.filter(function(model) {
			//console.log(model);
			return _.some(
				model.values(), 
				function(value) {
					console.log(value);
					return value.toLowerCase().indexOf(search);
				});
		}), $.proxy(this.addOne, this));
	},
	
	addOne: function(model) {
	
        // add row
		var view = new RowView({ model: model });
		$('#example-1-result').append(view.render().el);
	},
	
	render: function() {
		
        // first render
		$('#insert').replaceWith(this.$el.html(this.template));
        this.collection.each(this.addOne, this);
	}
});

var RowView = Backbone.View.extend({
	
	tagName: 'tr',
	
	events: {
        // Some detail view will listen for this.
		// App.trigger('person:view', this.model);
	},
	
	render: function() {
	
		this.$el.html('<td>' + this.model.get('id') + '</td><td>' + this.model.get('name') + '</td><td>' + this.model.get('pop') +  '</td><td>' + this.model.get('percentage') +  '</td><td>' + this.model.get('date') + '</td><td>' + this.model.get('date') + '</td><td>' + this.model.get('url') + '</td>');
        return this;
	}
});

new CollectionView;