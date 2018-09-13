$('#signup').click(function () {


    let username = $('#loginInput').val();
    let email = $('#emailInput').val();
    let pass = $('#passInput').val();

    this.data = new FormData();

    let _this = this;


    this.data.append('username', username);
    this.data.append('email', email);
    this.data.append('password', pass);

    $.ajax({
        type: 'POST',
        url: '/auth/users/create/',
        data: this.data,
        processData: false,
        contentType: false,
        success: function (data) {
            //sign in start////

            $.ajax({
                type: 'POST',
                url: '/auth/jwt/create/',
                data: _this.data,
                processData: false,
                contentType: false,
                success: function (data) {
                    let token = data.data.token;
                    $.cookie('csrftoken', token, { path: '/' });
                    $(location).attr('href', '/')
                },
                error: function (error) {
                   console.log('Kakoi-to pizdec', error)
                }
            });

            //sign in end////

        },
        error: function (error) {
            let errorMsg = parseTextError(error);
            $('#errors').empty().append(errorMsg);


            function parseTextError(error) {
                let msg = '';
                for (let errType in error.responseJSON.errors) {
                    msg += errType + ' : ' + error.responseJSON.errors[errType] + '<br>';
                }
                return msg;
            }
        }
    });

});