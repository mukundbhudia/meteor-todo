// simple-todos.js
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        tasks: function () {
            return Tasks.find({}, {sort: {createdAt: -1}});
        }
    });

    Template.body.events({
        "submit .new-task": function (event) {
            //Function called on submission of new task form
            console.debug(event);
            var text = event.target.text.value;

            Tasks.insert({
                text: text,
                createdAt: new Date() //now
            });

            //Clear the form
            event.target.text.value = "";

            //Prevent default form submit
            return false;
        }
    });

    Template.task.events({
        "click .toggle-checked": function() {
            Tasks.update(this._id, {$set: {checked: ! this.checked}});
        },
        "click .delete": function() {
            Tasks.remove(this._id);
        }
    });
}
