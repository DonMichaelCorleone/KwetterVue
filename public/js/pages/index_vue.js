new Vue({
    el: '#app',
    data: {
        users: [],
        j_loginPassword: '',
        j_loginUserName: '',
        activeUser: {},
        authenticatedUser: {},
        posts: [],
        searchedPosts: [],
        viewtype: "index",
        imageURL: '',
        followers: [],
        errorMessage: '',
        following: [],
        searchTerm: '',
        subview: "tweets",
        loggedOn: false,
        biographyChars: 160,
        postChars: 160,
        newUserName: '',
        newPostTitle: '',
        newPostContent: ''
    },
    mounted: function ()
    {
        this.getUsers();
        Vue.http.options.emulateJSON = true;
    },
    methods:
            {
                clearChars() {
                    this.biographyChars = 160;
                    this.postChars = 160;
                },
                displayHome: function () {
                    this.viewtype = 'index';
                },
                displayUser: function (user) {
                    if (user.userName === this.authenticatedUser.userName) {
                        this.renderProfilePage();
                        this.activeUser = user;
                        this.newUserName = user.userName;
                        this.imageURL = "../images/" + user.profilePicture;
                    } else {
                        this.viewtype = "user";
                        this.activeUser = user;
                        this.newUserName = user.userName;
                        this.imageURL = "../images/" + user.profilePicture;
                        this.getUserPosts();
                        this.getFollowers();
                        this.getFollowing();
                    }
                },
                displayModerator: function (user) {
                    this.viewtype = "moderator";
                    this.activeUser = user;
                    this.getUsers();
                    this.getAllPosts();
                },
                renderProfilePage: function () {
                    this.viewtype = 'profile';
                    this.getUserPosts();
                    this.getFollowers();
                    this.getFollowing();
                    this.getAllConnectedPosts();
                    this.searchPosts();
                },
                doHttpGet(url, property) {
                    this.$http.get(url, headers = "Access-Control-Allow-Origin").then(response => {
                        console.log("HttpGet Request called on url : " + url + " Response:", response.body);
                        this[property] = response.body;
                    }, response => {
// error callback 
                    });
                },
                doHttpPost(url, data, callback) {
                    var context = this;
                    console.log("doHttpPost", callback);
                    Vue.http.headers.common['Authorization'] = 'Basic Og==';
                    this.$http.post(url, data, {
                        headers: {"Content-Type": 'application/x-www-form-urlencoded'}}).then(response => {
                        console.log("HttpPost Request called on url : " + url + " Response:", response.body, data);
                        console.log(response.body);
                        console.log(response);
                        if (response.body !== 'false') {
                            console.log("detected True:", response.body);
                            if (callback !== undefined) {
                                console.log("callback not undefined");
                                callback(context, response.body);
                            }
                        } else {
                            console.log("detected false:", response.body);
                        }
                    }, response => {
                        context.errorMessage = 'Incorrect username or password, please try again';
                    });
                },
                changeSubview(type) {
                    console.log("Subview : ", type);
                    this.subview = type;
                },
                setBiographyChars() {
                    this.biographyChars = 160 - this.activeUser.biography.length;
                },
                setPostChars() {
                    this.postChars = 160 - this.newPostContent.length;
                },
                changeViewType(type) {
                    console.log("View : ", type);
                    if (type === 'profile') {
                        this.setBiographyChars();
                        this.setPostChars();
                    } else {
                    }
                    this.viewtype = type;
                },
                getUserPosts() {
                    this.doHttpGet('http://localhost:8080/Kwetter/resources/api/user/getAllPosts/' + this.activeUser.userName, 'posts');
                },
                getUsers: function () {
                    this.doHttpGet('http://localhost:8080/Kwetter/resources/api/user', 'users');
                },
                getAllPosts() {
                    this.doHttpGet('http://localhost:8080/Kwetter/resources/api/post', 'posts');
                },
                getFollowers() {
                    this.doHttpGet('http://localhost:8080/Kwetter/resources/api/user/findAllFollowers/' + this.activeUser.userName, 'followers');
                },
                getFollowing() {
                    this.doHttpGet('http://localhost:8080/Kwetter/resources/api/user/findAllFollowing/' + this.activeUser.userName, 'following');
                },
                removeUser(user) {
                    this.$http.get('http://localhost:8080/Kwetter/resources/api/user/remove/' + user.userName, headers = "Access-Control-Allow-Origin").then(response => {
                        var context = this;
                        if (user.userName !== context.authenticatedUser.userName) {
                            let index = this.users.indexOf(user);
                            context.users.splice(index, 1);
                        } else{
                            context.errorMessage = 'You cannot remove yourself';
                        }

                    }, response => {
// error callback 
                    });
                },
                getAllConnectedPosts() {
                    this.doHttpGet('http://localhost:8080/Kwetter/resources/api/user/findAllConnectedPosts/' + this.activeUser.userName, 'posts');
                },
                editUser() {

                    var formData = new FormData();
                    formData.append('user', this.activeUser);
                    this.doHttpPost('http://localhost:8080/Kwetter/resources/api/user/edit', this.activeUser);
                },
                removePost(post) {
                    this.$http.get('http://localhost:8080/Kwetter/resources/api/post/remove/' + post.id, headers = "Access-Control-Allow-Origin").then(response => {
                        let index = this.posts.indexOf(post)
                        this.posts.splice(index, 1);
                    }, response => {
// error callback 
                    });
                },
                logout() {
                    this.authenticatedUser = {};
                    this.displayUser(this.activeUser);
                },
                authenticateUser() {
                    Vue.http.options.emulateJSON = true;
                    this.doHttpPost('http://localhost:8080/Kwetter/resources/api/user/authenticate', {"username": this.j_loginUserName, "password": this.j_loginPassword}, function (context, user) {
                        console.log("User : ", user);
                        var subContext = context;
                        if (user['role'] === "Moderator") {
                            console.log("Moderator detected ");
                            console.log(context);
                            subContext.viewtype = "moderator";
                        } else {
                            context.renderProfilePage();
                        }
                        context.activeUser = user;
                        context.newUserName = user.userName;
                        context.authenticatedUser = user;
                        context.getUserPosts();
                        context.getAllConnectedPosts();
                        context.imageURL = "../images/" + user.profilePicture;

                        context.j_loginUserName = '';
                        context.j_loginPassword = '';
                    });
                },
                sendPost() {
                    Vue.http.options.emulateJSON = true;
                    if (this.doHttpPost('http://localhost:8080/Kwetter/resources/api/user/post/', {"username": this.activeUser.userName, 'content': this.newPostContent, 'title': this.newPostTitle}, function (context) {
                        context.getAllConnectedPosts();
                        context.searchPosts();
                        context.searchTerm = '';
                        context.newPostTitle = '';
                        context.newPostContent = '';
                        context.clearChars();
                    }))
                        ;
                },
                searchPosts() {
                    var context = this;
                    context.searchedPosts = [],
                            console.log("searchPosts triggered!", this.searchTerm);
                    for (var i = 0; i < this.posts.length; i++) {
                        let index = this.posts[i].content.indexOf(this.searchTerm);
                        if (index >= 0) {
                            context.searchedPosts.push(this.posts[i]);
                        }
                    }
                }
            }

})