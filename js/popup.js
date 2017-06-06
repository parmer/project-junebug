function ProjectJunebugPopupController($scope) {
    this.$scope = $scope;
    this.reloadUserLists();
    this.friendInput = "";
    this.adversaryInput = "";
    this.friends = [];
    this.adversaries = [];
}

ProjectJunebugPopupController.$inject = ["$scope"];

ProjectJunebugPopupController.prototype.addFriend = function() {
    if (this.friendInput.length > 0 && this.friends.indexOf(this.friendInput) < 0) {
        this.friends.push(this.friendInput);
        this.updateUserLists();
        this.friendInput = "";
    }
};

ProjectJunebugPopupController.prototype.addAdversary = function() {
    if (this.adversaryInput.length > 0 && this.adversaries.indexOf(this.adversaryInput) < 0) {
        this.adversaries.push(this.adversaryInput);
        this.updateUserLists();
        this.adversaryInput = "";
    }
};

ProjectJunebugPopupController.prototype.removeFriend = function(user) {
    var friendIndex = this.friends.indexOf(user);

    if (friendIndex !== -1) {
        this.friends.splice(friendIndex, 1);
        this.updateUserLists();
    }
};

ProjectJunebugPopupController.prototype.removeAdversary = function(user) {
    var adversaryIndex = this.adversaries.indexOf(user);

    if (adversaryIndex !== -1) {
        this.adversaries.splice(adversaryIndex, 1);
        this.updateUserLists();
    }
};

ProjectJunebugPopupController.prototype.updateUserLists = function() {
    var saveData = {
        friends: this.friends,
        adversaries: this.adversaries
    };

    chrome.storage.local.set(saveData, this.reloadUserLists.bind(this));
};

ProjectJunebugPopupController.prototype.reloadUserLists = function() {
    chrome.storage.local.get(['friends', 'adversaries'], function(response) {
        this.$scope.$applyAsync(function() {
            this.friends = response.friends || [];
            this.adversaries = response.adversaries || [];
        }.bind(this));
    }.bind(this));
};

angular.module("junebug-popup.app", []).controller("ProjectJunebugPopupController", ProjectJunebugPopupController);

document.addEventListener('DOMContentLoaded', function () {
    angular.bootstrap(document, ["junebug-popup.app"]);
});