// simple-todos.js
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        tasks: function() {
            if (Session.get("hideCompleted")) {
                //If the user has checked hide completed then we filter tasks
                return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
            } else {
                return Tasks.find({}, {sort: {createdAt: -1}});
            }
        },
        hideCompleted: function() {
            return Session.get("hideCompleted");
        },
        incompleteCount: function() {
            return Tasks.find({checked: {$ne: true}}).count();
        }
    });

    Template.body.events({
        "submit .new-task": function(event) {
            //Function called on submission of new task form
            console.debug(event);
            var text = event.target.text.value;

            Meteor.call("addTask", text);

            //Clear the form
            event.target.text.value = "";

            //Prevent default form submit
            return false;
        },
        "change .hide-completed input": function(event) {
            Session.set("hideCompleted", event.target.checked);
        }
    });

    Template.task.events({
        "click .toggle-checked": function() {
            Meteor.call("setChecked", this._id, !this.checked);
        },
        "click .delete": function() {
            Meteor.call("deleteTask", this._id);
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

Meteor.methods({
    addTask: function(text) {
        //Check the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.error("not-authorised");
        }

        Tasks.insert({
            text: text,
            createdAt: new Date(),              //now
            owner: Meteor.userId(),             //_id of user logged in
            username: Meteor.user().username    //username of logged in user
        });
    },
    deleteTask: function(taskId) {
        Tasks.remove(taskId);
    },
    setChecked: function(taskId, setChecked) {
        Tasks.update(taskId, { $set: {checked: setChecked} });
    }
});
