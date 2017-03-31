new Vue({
    el: '#app',
    data: {
        users: [],
        j_loginPassword: '',
        j_loginUserName: '',
        activeUser: {},
        posts: [],
        searchedPosts: [],
        viewtype: "index",
        imageURL: '',
        followers: [],
        following: [],
        searchTerm: '',
        subview: "tweets",
        loggedOn: false,
        biographyChars: 0,
        postChars: 0,
        newUserName: '',
        newPostTitle: '',
        newPostContent: ''
    },
    mounted: function ()
    {
        this.getUsers();
    },
    methods:
            {
                displayUser: function (user) {
                    this.viewtype = "user";
                    this.activeUser = user;
                    this.newUserName = user.userName;
                    this.imageURL = "../images/" + user.profilePicture;
                    this.getUserPosts();
                    this.getFollowers();
                    this.getFollowing();
                },
                displayModerator: function (user) {
                    this.viewtype = "moderator";
                    this.activeUser = user;
                    this.getUsers();
                    this.getAllPosts();
                },
                renderProfilePage: function () {
                    this.viewtype = 'profile';
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
            console.log("doHttpPost" , callback);
                    Vue.http.headers.common['Authorization'] = 'Basic Og==';
                    this.$http.post(url, data, {
                        headers: {"Content-Type": 'application/x-www-form-urlencoded'}}).then(response => {
                        console.log("HttpPost Request called on url : " + url + " Response:", response.body, data);
                        console.log(response.body);
                        console.log(response);
                        if (response.body === 'true post') {
                            console.log("detected True:", response.body);
                            if (callback !== undefined) {
                                console.log("callback not undefined");
                                callback(context);
                            }
                        } else {
                            console.log("detected false:", response.body);
                        }
                    }, response => {
                        console.log('postFailed');
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
                        let index = this.users.indexOf(user)
                        this.users.splice(index, 1);
                    }, response => {
                        // error callback 
                    });
                },
                getAllConnectedPosts() {
                    this.doHttpGet('http://localhost:8080/Kwetter/resources/api/user/findAllConnectedPosts/' + this.activeUser.userName, 'posts');
                },
                editUser() {
                    Vue.http.options.emulateJSON = true;
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
                authenticateUser() {
                    this.doHttpPost('http://localhost:8080/Kwetter/j_security_check', {"j_username": this.j_loginUserName, "j_password": this.j_loginPassword});
                },
                sendPost() {
                    Vue.http.options.emulateJSON = true;
                    var formData = new FormData();
                    formData.append('username', this.activeUser.userName);
                    if (this.doHttpPost('http://localhost:8080/Kwetter/resources/api/user/post/', {"username": this.activeUser.userName, 'content': this.newPostContent, 'title': this.newPostTitle}, function (context) {
                        context.getAllConnectedPosts();
                        context.searchTerm = '';
                        context.searchPosts(); 
                    })); 
            },
                searchPosts() {
                    var context = this;
                    context.searchedPosts = [],
                            console.log("searchPosts triggered!");
                    for (var i = 0; i < this.posts.length; i++) {
                        let index = this.posts[i].content.indexOf(this.searchTerm);
                        if (index >= 0) {
                            context.searchedPosts.push(this.posts[i]);
                        }
                    }
                }
            }

})