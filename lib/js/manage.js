$(document).ready(function() {
    let $ban = $('.ban');

    $ban.on('click', ban);

    function ban(e) {
        let $this = $(e.currentTarget),
            target = $this.data('target');

        $.post('/ban', { target }).done(res => {
            alert(res);
            location.reload();
        }).catch(err => {
            alert(err.responseJSON.message);
        });
    }
});
