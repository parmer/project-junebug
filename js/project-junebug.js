function ProjectJunebugPageController() {
    this.reloadUserLists();
    window.setInterval(this.checkForUsers.bind(this), 1000);
}

ProjectJunebugPageController.prototype.JUNEBUG_USERNAME_CLASS = "project-junebug-username";

ProjectJunebugPageController.prototype.USERNAME_SELECTORS = [
    ".chat-box .message .username",
    ".game-list .player"
];

ProjectJunebugPageController.prototype.FRIEND = "friend";
ProjectJunebugPageController.prototype.ADVERSARY = "adversary";
ProjectJunebugPageController.prototype.INFO = "info";

ProjectJunebugPageController.prototype.checkForUsers = function() {
    var selector = this.USERNAME_SELECTORS.join(',');
    var usernameElements = document.querySelectorAll(selector);

    for (var i = 0; i < usernameElements.length; i++) {
        var usernameElement = usernameElements[i];
        var usernameText = usernameElement.innerText;

        var alreadyHasTag = usernameElement.classList.contains(this.JUNEBUG_USERNAME_CLASS);
        var isFriend = this.friends.indexOf(usernameText) > -1;
        var isAdversary = this.adversaries.indexOf(usernameText) > -1;

        if (!alreadyHasTag) {
            if (isFriend) {
                this.enableJunebugUsername(usernameElement, this.FRIEND);
            }
            else if (isAdversary) {
                this.enableJunebugUsername(usernameElement, this.ADVERSARY);
            }
        }
        else if (!isFriend && !isAdversary) {
            this.disableJunebugUsername(usernameElement);
        }
    }
};

ProjectJunebugPageController.prototype.createUserTag = function(type) {
    var userTag = document.createElement("span");
    userTag.classList.add(this.JUNEBUG_USERNAME_CLASS + "__" + type);

    return userTag;
};

ProjectJunebugPageController.prototype.enableJunebugUsername = function(element, type) {
  element.classList.add(this.JUNEBUG_USERNAME_CLASS);
  element.appendChild(this.createUserTag(type));
};

ProjectJunebugPageController.prototype.disableJunebugUsername = function(element) {
    element.classList.remove(this.JUNEBUG_USERNAME_CLASS);
    var tags = element.querySelectorAll("[class^='" + this.JUNEBUG_USERNAME_CLASS + "']");

    for (var i = 0; i < tags.length; i++) {
        tags[i].remove();
    }
};

ProjectJunebugPageController.prototype.updateUserLists = function() {
    var saveData = {
        friends: this.friends,
        adversaries: this.adversaries
    };

    chrome.storage.local.set(saveData, this.reloadUserLists.bind(this));
};

ProjectJunebugPageController.prototype.reloadUserLists = function() {
    chrome.storage.local.get(['friends', 'adversaries'], function(response) {
        this.friends = response.friends || [];
        this.adversaries = response.adversaries || [];
    }.bind(this));
};

new ProjectJunebugPageController();
