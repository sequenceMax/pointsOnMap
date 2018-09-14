$('#signin').click(function (event) {

    let username = $('#loginInput').val();
    let pass = $('#passInput').val();

    let data = new FormData();

    data.append('username', username);
    data.append('password', pass);

    $.ajax({
        type: 'POST',
        url: '/auth/jwt/create/',
        data: data,
        processData: false,
        contentType: false,
        success: function (data) {
            let token = data.data.token;
            $.cookie('csrftoken', token);
            location.reload();
        },
        error: function (error) {
            let errorMsg = parseTextError(error);
            $('#errors').empty().append(errorMsg);

            function parseTextError(error) {
                let msg = '';
                for (let errType in error.responseJSON.errors) {
                    if (errType === 'username' || errType === 'password') {
                        msg += errType + ' : ' + error.responseJSON.errors[errType] + '<br>';
                    } else if (errType === 'non_field_errors') {
                        msg = 'unreliable login or password'
                    }
                }
                return msg;
            }
        }
    });
});
