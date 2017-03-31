new Vue({
    el: '#app',
    data: {
        message: 'hello world!',
        users: [],
        j_loginPassword: '',
        j_loginUserName: '',
        activeUser: {},
        posts: [],
        viewtype: "index",
        imageURL: '',
        followers: [],
        following: [],
        searchTerm: '',
        subview: "tweets",
        loggedOn: false
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
                doHttpGet(url, property) {
                    this.$http.get(url, headers = "Access-Control-Allow-Origin").then(response => {
                        console.log("HttpGet Request called on url : " + url + " Response:", response.body);
                        this[property] = response.body;
                    }, response => {
                        // error callback 
                    });
                },
                doHttpPost(url, data) {
                    Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';
                    this.$http.post(url, data, {
                        headers: {
                            "content-type": 'application/x-www-form-urlencoded',
                        }}).then(response => {
//                        console.log("HttpPost Request called on url : " + url + " Response:", response.body);
//                        console.log(response.body);
                        console.log(response);
                    }, response => {
                        alert('postFailed');
                    });
                },
                changeSubview(type) {
                    console.log("Subview : ", type);
                    this.subview = type;
                },
                changeViewType(type) {
                    console.log("View : ", type);
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
                removePost(post) {
                    this.$http.get('http://localhost:8080/Kwetter/resources/api/post/remove/' + post.id, headers = "Access-Control-Allow-Origin").then(response => {
                        let index = this.posts.indexOf(post)
                        this.posts.splice(index, 1);
                    }, response => {
                        // error callback 
                    });
                },
                authenticateUser() {
                    this.$http.post('http://localhost:8080/Kwetter/User/j_security_check?j_username=' + this.j_loginUserName + "&j_password=" + this.j_loginPassword, null);
//                     this.$http.post('http://localhost:8080/Kwetter/j_security_check', { "j_username": this.j_loginUserName ,"j_password=" : this.j_loginPassword });
                }
            }
})