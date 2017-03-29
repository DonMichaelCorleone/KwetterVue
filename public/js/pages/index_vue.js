/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


new Vue({
    el: '#app',
    data: {
        message: 'hello world!',
        users: []
    },
    mounted: function ()
    {
        this.getData();

    },
    methods:
            {
                alert: function (variable) {
                    alert(variable);
                },
                getData: function () {
          
                 
                    this.$http.get('http://localhost:8080/Kwetter/resources/api/user', headers = "Access-Control-Allow-Origin").then(response => { 

                        // get body data 
                        console.log(response.body);

                    }, response => {
                        // error callback 
                    });

                }
            }
})